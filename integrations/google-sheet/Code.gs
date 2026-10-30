/**
 * Blackhood Africa: website receiver for model applications and brand booking requests.
 * Paste this into Extensions → Apps Script of the "Blackhood Applications" Google Sheet.
 * Applications go to the "Applications" tab (photos saved to Google Drive); bookings go to the "Bookings" tab.
 *
 * Setup: Project Settings → Script properties → add SHARED_SECRET (the same value as APPLY_SECRET in Vercel).
 * Optional: NOTIFY_EMAIL (comma-separated) for team alerts; defaults to the script owner.
 */

const SHEET_NAME = 'Applications'
const BOOKINGS_SHEET_NAME = 'Bookings'
const DRIVE_FOLDER_NAME = 'Blackhood Applications – Photos'
const SITE_URL = 'https://blackhoodafrica-website.vercel.app' // change when the custom domain is live

const HEADERS = [
  'Received', 'Reference', 'Status', 'Full name', 'Age', 'Gender', 'Height (cm)', 'City / area',
  'Phone (WhatsApp)', 'Email', 'Instagram / TikTok', 'Interested in', 'Experience',
  'Guardian name', 'Guardian phone', 'Language', 'Headshot', 'Full length', 'Side profile', 'Photo folder', 'Notes',
  'Talent code', 'Approved on',
]
// Column numbers in the Applications tab (1-based)
const COL = { status: 3, name: 4, email: 10, lang: 16, code: 22, approvedOn: 23 }
const APPLICATION_STATUSES = ['New', 'Contacted', 'Invited to casting', 'Academy', 'Approved', 'Signed', 'Not now']

const BOOKING_HEADERS = [
  'Received', 'Reference', 'Status', 'Contact name', 'Company / brand', 'Phone', 'Email', 'Job type', 'Date(s)',
  'Location', 'Talent needed', 'Budget (TZS)', 'Usage rights', 'Details', 'Language', 'Notes',
]

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const secret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET')
    if (!secret || data.secret !== secret) return json({ ok: false, error: 'unauthorized' })

    const lock = LockService.getScriptLock()
    lock.waitLock(20000)
    try {
      if (data.type === 'booking') return json(handleBooking(data))
      if (data.type === 'subscribe') return json(handleSubscribe(data))
      if (data.type === 'verify') return json(handleVerify(data))
      if (data.type === 'verify-email') return json(handleVerifyEmail(data))
      if (data.type === 'login-code') return json(sendLoginCode(data))
      return json(handleApplication(data))
    } finally {
      lock.releaseLock()
    }
  } catch (err) {
    return json({ ok: false, error: String(err) })
  }
}

function handleApplication(data) {
  const sheet = getSheet()
  const ref = makeRef('BHA', sheet)

  const folder = getFolder().createFolder(ref + ' – ' + clean(data.name))
  const links = ['headshot', 'full', 'side'].map(function (key) {
    const photo = data.photos && data.photos[key]
    if (!photo) return ''
    const blob = Utilities.newBlob(Utilities.base64Decode(photo), 'image/jpeg', key + '.jpg')
    return folder.createFile(blob).getUrl()
  })

  sheet.appendRow([
    new Date(), ref, 'New', clean(data.name), data.age, clean(data.gender), data.height, clean(data.city),
    phoneText(data.phone), clean(data.email), clean(data.social), clean(data.interest), clean(data.experience),
    clean(data.guardianName), phoneText(data.guardianPhone), clean(data.lang),
    links[0], links[1], links[2], folder.getUrl(), '',
  ])

  sendConfirmation(data, ref)
  notifyTeam(data, ref, sheet, folder.getUrl())
  return { ok: true, ref: ref }
}

function handleBooking(data) {
  const sheet = getBookingsSheet()
  const ref = makeRef('BKG', sheet)

  sheet.appendRow([
    new Date(), ref, 'New', clean(data.name), clean(data.company), phoneText(data.phone), clean(data.email),
    clean(data.jobType), clean(data.dates), clean(data.location), clean(data.talent), clean(data.budget),
    clean(data.usage), clean(data.notes), clean(data.lang), '',
  ])

  sendBookingConfirmation(data, ref)
  notifyBooking(data, ref, sheet)
  return { ok: true, ref: ref }
}

// Newsletter sign-up: one row per email (repeat sign-ups are ignored), plus a short welcome email.
function handleSubscribe(data) {
  const email = validEmail(data.email)
  if (!email) return { ok: false, error: 'invalid email' }
  const sheet = getSubscribersSheet()

  const existing = sheet.getLastRow() > 1 ? sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues() : []
  const already = existing.some(function (r) { return String(r[0]).toLowerCase() === email.toLowerCase() })
  if (already) return { ok: true, already: true }

  sheet.appendRow([new Date(), email, clean(data.name), clean(data.interest), clean(data.lang), clean(data.source), 'Subscribed'])

  const sw = data.lang === 'sw'
  const subject = sw ? 'Karibu kwenye jarida la Blackhood Africa' : 'Welcome to the Blackhood Africa newsletter'
  const lines = sw
    ? [
        'Karibu!',
        'Asante kwa kujiunga na jarida la Blackhood Africa. Utakuwa wa kwanza kupata habari za usaili, nafasi za chuo, sura mpya na kazi zetu.',
        'Ili kuacha kupokea barua pepe hizi wakati wowote, jibu barua hii ukiandika "STOP".',
        'Timu ya Blackhood Africa',
      ]
    : [
        'Welcome!',
        "Thanks for joining the Blackhood Africa newsletter. You'll be first to hear about castings, academy intakes, new faces and our latest work.",
        'To stop receiving these emails at any time, just reply "STOP".',
        'The Blackhood Africa team',
      ]
  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: lines.join('\n\n'),
      htmlBody: lines.map(function (l) { return '<p>' + l + '</p>' }).join(''),
      name: 'Blackhood Africa',
    })
  } catch (err) {
    console.warn('Welcome email failed: ' + err)
  }
  return { ok: true }
}

function getSubscribersSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName('Subscribers')
  if (!sheet) {
    sheet = ss.insertSheet('Subscribers')
    const headers = ['Signed up', 'Email', 'Name', 'Interested in', 'Language', 'Signed up from', 'Status']
    sheet.appendRow(headers)
    sheet.setFrozenRows(1)
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold')
    const rule = SpreadsheetApp.newDataValidation().requireValueInList(['Subscribed', 'Unsubscribed'], true).build()
    sheet.getRange('G2:G').setDataValidation(rule)
  }
  return sheet
}

function makeRef(prefix, sheet) {
  return prefix + '-' + Utilities.formatDate(new Date(), 'Africa/Dar_es_Salaam', 'yyMMdd') + '-' +
    String(sheet.getLastRow()).padStart(4, '0')
}

// Phone numbers stored as text so "+255…" isn't treated as a formula or number.
function phoneText(v) {
  const s = String(v == null ? '' : v).replace(/[^\d+\s()-]/g, '').slice(0, 30).trim()
  return s ? "'" + s : ''
}

function notifyTo() {
  return PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL') || Session.getEffectiveUser().getEmail()
}

function validEmail(v) {
  const s = String(v || '').trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : ''
}

// Confirmation email to the brand/client.
function sendBookingConfirmation(data, ref) {
  const email = validEmail(data.email)
  if (!email) return
  const first = clean(data.name).split(' ')[0] || ''
  const sw = data.lang === 'sw'
  const subject = sw
    ? 'Tumepokea ombi lako la kuajiri – Blackhood Africa (' + ref + ')'
    : 'We received your booking request – Blackhood Africa (' + ref + ')'
  const lines = sw
    ? [
        'Habari ' + first + ',',
        'Asante kwa kuwasiliana na Blackhood Africa. Tumepokea maelezo ya kazi yako na timu yetu ya booking inayafanyia kazi.',
        'Namba ya ombi lako ni: ' + ref,
        'Tutakujibu ndani ya saa 24 na sura zinazofaa, upatikanaji na bei. Kwa jambo la haraka, tupigie au tuandikie WhatsApp +255 711 505 927.',
        'Kila la heri,',
        'Timu ya Blackhood Africa',
      ]
    : [
        'Hi ' + first + ',',
        'Thank you for contacting Blackhood Africa. We have received your brief and our bookings team is working on it.',
        'Your booking reference is: ' + ref,
        'We will reply within 24 hours with suitable talent, availability and a quote. For anything urgent, call or WhatsApp +255 711 505 927.',
        'Best regards,',
        'The Blackhood Africa team',
      ]
  const html = lines
    .map(function (l, i) { return i === 2 ? '<p><strong>' + l + '</strong></p>' : '<p>' + l + '</p>' })
    .join('')
  try {
    MailApp.sendEmail({ to: email, subject: subject, body: lines.join('\n\n'), htmlBody: html, name: 'Blackhood Africa' })
  } catch (err) {
    console.warn('Booking confirmation failed: ' + err)
  }
}

// Alert to the team for every booking request.
function notifyBooking(data, ref, sheet) {
  const to = notifyTo()
  if (!to) return
  const rows = [
    ['Reference', ref],
    ['Contact', clean(data.name)],
    ['Company / brand', clean(data.company)],
    ['Phone', clean(data.phone)],
    ['Email', clean(data.email)],
    ['Job type', clean(data.jobType)],
    ['Date(s)', clean(data.dates)],
    ['Location', clean(data.location)],
    ['Talent needed', clean(data.talent)],
    ['Budget (TZS)', clean(data.budget)],
    ['Usage rights', clean(data.usage)],
    ['Details', clean(data.notes)],
  ]
  const html =
    '<p>New booking request on the website. Promised reply: within 24 hours.</p><table cellpadding="4">' +
    rows.map(function (r) { return '<tr><td><b>' + r[0] + '</b></td><td>' + escapeHtml(r[1]) + '</td></tr>' }).join('') +
    '</table><p><a href="' + sheet.getParent().getUrl() + '">Open the bookings sheet</a></p>'
  const message = {
    to: to,
    subject: 'New booking request: ' + (clean(data.company) || clean(data.name)) + ' (' + ref + ')',
    body: rows.map(function (r) { return r[0] + ': ' + r[1] }).join('\n'),
    htmlBody: html,
    name: 'Blackhood Website',
  }
  const clientEmail = validEmail(data.email)
  if (clientEmail) message.replyTo = clientEmail
  try {
    MailApp.sendEmail(message)
  } catch (err) {
    console.warn('Booking alert failed: ' + err)
  }
}

function getBookingsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(BOOKINGS_SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(BOOKINGS_SHEET_NAME)
    sheet.appendRow(BOOKING_HEADERS)
    sheet.setFrozenRows(1)
    sheet.getRange(1, 1, 1, BOOKING_HEADERS.length).setFontWeight('bold')
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['New', 'Replied', 'Quote sent', 'Confirmed', 'Completed', 'Lost'], true)
      .build()
    sheet.getRange('C2:C').setDataValidation(rule)
  }
  return sheet
}

// Confirmation email to the applicant, in the language they used on the site.
// Sent from the Google account that owns this script (free Gmail allows ~100 emails a day).
function sendConfirmation(data, ref) {
  const email = String(data.email || '').trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
  const first = clean(data.name).split(' ')[0] || ''
  const sw = data.lang === 'sw'

  const subject = sw
    ? 'Tumepokea ombi lako – Blackhood Africa (' + ref + ')'
    : 'We received your application – Blackhood Africa (' + ref + ')'

  const lines = sw
    ? [
        'Habari ' + first + ',',
        'Asante kwa kuomba kujiunga na Blackhood Africa. Tumepokea ombi lako na picha zako, na timu yetu ya usaili inalipitia sasa.',
        'Namba yako ya ombi ni: ' + ref,
        'Tutawasiliana nawe kupitia WhatsApp. Tafadhali amini ujumbe kutoka +255 711 505 927 pekee. Usaili na maombi ya wakala ni bure – hatutakuomba pesa kwa ajili ya kuomba.',
        'Kila la heri,',
        'Timu ya Blackhood Africa',
      ]
    : [
        'Hi ' + first + ',',
        'Thank you for applying to Blackhood Africa. We have received your application and photos, and our scouting team is reviewing it now.',
        'Your application reference is: ' + ref,
        'We will contact you on WhatsApp. Please only trust messages from +255 711 505 927. Scouting and agency applications are free – we will never ask you for money to apply.',
        'Best wishes,',
        'The Blackhood Africa team',
      ]

  const html = lines
    .map(function (l, i) { return i === 2 ? '<p><strong>' + l + '</strong></p>' : '<p>' + l + '</p>' })
    .join('')

  try {
    MailApp.sendEmail({ to: email, subject: subject, body: lines.join('\n\n'), htmlBody: html, name: 'Blackhood Africa' })
  } catch (err) {
    // Email quota or bad address: the application is still saved.
    console.warn('Confirmation email failed: ' + err)
  }
}

// Alert to the team for every new application.
// Goes to the NOTIFY_EMAIL script property (comma-separate several addresses), or to the script owner if unset.
function notifyTeam(data, ref, sheet, folderUrl) {
  const to = notifyTo()
  if (!to) return
  const minor = Number(data.age) < 18
  const rows = [
    ['Reference', ref],
    ['Name', clean(data.name)],
    ['Age', String(data.age) + (minor ? ' (under 18)' : '')],
    ['Height', String(data.height) + ' cm'],
    ['City / area', clean(data.city)],
    ['Interested in', clean(data.interest)],
    ['WhatsApp', clean(data.phone)],
    ['Email', clean(data.email)],
    ['Instagram / TikTok', clean(data.social)],
  ]
  if (minor) rows.push(['Guardian', clean(data.guardianName) + ' ' + clean(data.guardianPhone)])

  const html =
    '<p>New application on the website.</p><table cellpadding="4">' +
    rows.map(function (r) { return '<tr><td><b>' + r[0] + '</b></td><td>' + escapeHtml(r[1]) + '</td></tr>' }).join('') +
    '</table><p><a href="' + sheet.getParent().getUrl() + '">Open the applications sheet</a> · <a href="' + folderUrl + '">See photos</a></p>'

  const message = {
    to: to,
    subject: 'New application: ' + clean(data.name) + ' (' + ref + ')',
    body: rows.map(function (r) { return r[0] + ': ' + r[1] }).join('\n') + '\n\nPhotos: ' + folderUrl,
    htmlBody: html,
    name: 'Blackhood Website',
  }
  const applicantEmail = String(data.email || '').trim()
  if (applicantEmail) message.replyTo = applicantEmail // "Reply" goes straight to the applicant

  try {
    MailApp.sendEmail(message)
  } catch (err) {
    console.warn('Team notification failed: ' + err)
  }
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow(HEADERS)
    sheet.setFrozenRows(1)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
    applyStatusDropdown(sheet)
  }
  return sheet
}

// Status dropdown for tracking each applicant
function applyStatusDropdown(sheet) {
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(APPLICATION_STATUSES, true).build()
  sheet.getRange('C2:C').setDataValidation(rule)
}

// ---- Talent approval ----------------------------------------------------------------------------
// Installed by setup() as an "on edit" trigger. When a row's Status is set to "Approved",
// the applicant gets a talent code (BHA-T-0001…) and a welcome email. Codes are never reused.
function onStatusEdit(e) {
  const range = e && e.range
  if (!range) return
  const sheet = range.getSheet()
  if (sheet.getName() !== SHEET_NAME || range.getColumn() > COL.status || range.getLastColumn() < COL.status) return

  for (let row = range.getRow(); row <= range.getLastRow(); row++) {
    if (row < 2) continue
    const status = String(sheet.getRange(row, COL.status).getValue())
    const codeCell = sheet.getRange(row, COL.code)
    if (status !== 'Approved' || codeCell.getValue()) continue

    const code = nextTalentCode()
    codeCell.setValue(code)
    sheet.getRange(row, COL.approvedOn).setValue(new Date())
    sendApprovalEmail({
      name: String(sheet.getRange(row, COL.name).getValue()),
      email: String(sheet.getRange(row, COL.email).getValue()),
      lang: String(sheet.getRange(row, COL.lang).getValue()),
    }, code)
  }
}

function nextTalentCode() {
  const props = PropertiesService.getScriptProperties()
  const n = Number(props.getProperty('TALENT_COUNTER') || '0') + 1
  props.setProperty('TALENT_COUNTER', String(n))
  return 'BHA-T-' + String(n).padStart(4, '0')
}

function sendApprovalEmail(person, code) {
  const email = validEmail(person.email)
  if (!email) return
  const first = clean(person.name).split(' ')[0] || ''
  const sw = person.lang === 'sw'
  const subject = sw ? 'Hongera! Umekubaliwa Blackhood Africa' : 'Congratulations – welcome to Blackhood Africa'
  const lines = sw
    ? [
        'Hongera ' + first + '!',
        'Tunafurahi kukujulisha kuwa umekubaliwa kujiunga na Blackhood Africa.',
        'Namba yako ya kipaji ni: ' + code,
        'Hifadhi namba hii. Makampuni na wazazi wanaweza kuithibitisha kwenye ukurasa wetu wa "Ni sisi kweli?". Timu yetu itawasiliana nawe kwa WhatsApp kuhusu hatua zinazofuata.',
        'Tengeneza comp card yako yenye nembo ya Blackhood hapa: ' + SITE_URL + '/compcard',
        'Karibu kwenye familia,',
        'Timu ya Blackhood Africa',
      ]
    : [
        'Congratulations ' + first + '!',
        "We're delighted to tell you that you've been approved to join Blackhood Africa.",
        'Your talent code is: ' + code,
        'Keep this code safe. Brands and parents can check it on our "Is it really us?" page. Our team will contact you on WhatsApp about next steps.',
        'Make your Blackhood-branded comp card here: ' + SITE_URL + '/compcard',
        'Welcome to the family,',
        'The Blackhood Africa team',
      ]
  const html = lines
    .map(function (l, i) { return i === 2 ? '<p><strong style="font-size:18px">' + l + '</strong></p>' : '<p>' + l + '</p>' })
    .join('')
  try {
    MailApp.sendEmail({ to: email, subject: subject, body: lines.join('\n\n'), htmlBody: html, name: 'Blackhood Africa' })
  } catch (err) {
    console.warn('Approval email failed: ' + err)
  }
}

// Public code check for the website: returns the name only for a valid, approved code.
function handleVerify(data) {
  const code = String(data.code || '').trim().toUpperCase()
  if (!/^BHA-T-\d{4}$/.test(code)) return { ok: true, valid: false }
  const sheet = getSheet()
  const last = sheet.getLastRow()
  if (last < 2) return { ok: true, valid: false }
  const rows = sheet.getRange(2, 1, last - 1, COL.code).getValues()
  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][COL.code - 1]).toUpperCase() === code) {
      const status = String(rows[i][COL.status - 1])
      const active = status === 'Approved' || status === 'Signed'
      return { ok: true, valid: active, name: active ? String(rows[i][COL.name - 1]) : '' }
    }
  }
  return { ok: true, valid: false }
}

// Account sign-up check (server-to-server only): the code must be active AND belong to this email.
function handleVerifyEmail(data) {
  const code = String(data.code || '').trim().toUpperCase()
  const email = validEmail(data.email).toLowerCase()
  if (!/^BHA-T-\d{4}$/.test(code) || !email) return { ok: true, valid: false }
  const sheet = getSheet()
  const last = sheet.getLastRow()
  if (last < 2) return { ok: true, valid: false }
  const rows = sheet.getRange(2, 1, last - 1, COL.code).getValues()
  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][COL.code - 1]).toUpperCase() !== code) continue
    const status = String(rows[i][COL.status - 1])
    const active = status === 'Approved' || status === 'Signed'
    const sameEmail = String(rows[i][COL.email - 1]).trim().toLowerCase() === email
    return { ok: true, valid: active && sameEmail, name: active && sameEmail ? String(rows[i][COL.name - 1]) : '' }
  }
  return { ok: true, valid: false }
}

// 6-digit login code for the model account area.
function sendLoginCode(data) {
  const email = validEmail(data.email)
  const code = String(data.code || '').replace(/\D/g, '')
  if (!email || code.length !== 6) return { ok: false }
  const sw = data.lang === 'sw'
  const subject = sw ? 'Namba yako ya kuingia: ' + code : 'Your Blackhood login code: ' + code
  const lines = sw
    ? ['Namba yako ya kuingia Blackhood Africa ni:', code, 'Inatumika kwa dakika 10. Kama hukuomba, puuza barua hii.']
    : ['Your Blackhood Africa login code is:', code, "It works for 10 minutes. If you didn't ask for it, you can ignore this email."]
  const html = '<p>' + lines[0] + '</p><p style="font-size:28px;letter-spacing:6px"><strong>' + code + '</strong></p><p>' + lines[2] + '</p>'
  MailApp.sendEmail({ to: email, subject: subject, body: lines.join('\n\n'), htmlBody: html, name: 'Blackhood Africa' })
  return { ok: true }
}

function installTrigger() {
  const exists = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'onStatusEdit' })
  if (!exists) ScriptApp.newTrigger('onStatusEdit').forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create()
}

function getFolder() {
  const found = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME)
  return found.hasNext() ? found.next() : DriveApp.createFolder(DRIVE_FOLDER_NAME)
}

// Keep cells as plain text and stop spreadsheet formulas being injected through the form.
function clean(v) {
  const s = String(v == null ? '' : v).slice(0, 1000).trim()
  return /^[=+\-@]/.test(s) ? "'" + s : s
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}

// Run once from the editor to create the sheet/folder and approve permissions (Sheets, Drive, email).
function setup() {
  const sheet = getSheet()
  // Bring an existing Applications tab up to date: new header columns and the "Approved" status option.
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold')
  applyStatusDropdown(sheet)
  getBookingsSheet()
  getSubscribersSheet()
  getFolder()
  installTrigger()
  console.log('Emails left today: ' + MailApp.getRemainingDailyQuota())
}
