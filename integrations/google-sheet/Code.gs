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
const BOOKING_STATUSES = ['New', 'Replied', 'Quote sent', 'Confirmed', 'Completed', 'Lost']

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const secret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET')
    if (!secret || data.secret !== secret) return json({ ok: false, error: 'unauthorized' })

    const lock = LockService.getScriptLock()
    lock.waitLock(30000)
    try {
      // First request after an update switches on the hourly summary, so nobody has to press Run.
      if (!PropertiesService.getScriptProperties().getProperty('TRIGGERS_V2')) installTrigger()
      if (data.type === 'booking') return json(handleBooking(data))
      if (data.type === 'subscribe') return json(handleSubscribe(data))
      if (data.type === 'verify') return json(handleVerify(data))
      if (data.type === 'verify-email') return json(handleVerifyEmail(data))
      if (data.type === 'login-code') return json(sendLoginCode(data))
      if (data.type === 'profile-live') return json(sendProfileLiveEmail(data))
      if (data.type === 'casting-alert') return json(sendCastingAlert(data))
      if (data.type === 'resend-approval') return json(resendApproval(data))
      if (data.type === 'approve-ref') return json(approveByRef(data))
      if (data.type === 'profile-reminder') return json(sendProfileReminder(data))
      if (data.type === 'list-bookings') return json(listBookings())
      if (data.type === 'booking-status') return json(setBookingStatus(data))
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
  // Team alerts go out as one hourly summary (sendApplicationDigest) to save the daily email quota.
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

// Running number per prefix, kept in script properties so deleting rows never repeats a reference.
function makeRef(prefix, sheet) {
  const props = PropertiesService.getScriptProperties()
  const key = 'REF_COUNTER_' + prefix
  const n = Math.max(Number(props.getProperty(key) || 0) + 1, sheet.getLastRow())
  props.setProperty(key, String(n))
  return prefix + '-' + Utilities.formatDate(new Date(), 'Africa/Dar_es_Salaam', 'yyMMdd') + '-' + String(n).padStart(4, '0')
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

// New casting posted on /admin: one email to all approved models (BCC, so they don't see each other).
function sendCastingAlert(data) {
  const emails = (data.emails || []).map(validEmail).filter(Boolean)
  if (!emails.length) return { ok: true, sent: 0 }
  const c = data.casting || {}
  const facts = [clean(c.type), clean(c.date_text), clean(c.place)].filter(Boolean).join(' · ')
  const page = SITE_URL + '/castings'
  const en = [
    'New casting: ' + clean(c.title),
    facts,
    clean(c.details),
    "If you're interested, log in and tap \"I'm interested\" on the Castings page: " + page,
    'The Blackhood Africa team',
  ].filter(Boolean)
  const sw = [
    'Usaili mpya: ' + clean(c.title),
    facts,
    'Kama una nia, ingia kisha gusa "Nina nia" kwenye ukurasa wa Usaili: ' + page,
    'Timu ya Blackhood Africa',
  ].filter(Boolean)
  const html =
    '<p><img src="' + SITE_URL + '/brand/logo-black.png" alt="Blackhood Africa" height="40" style="height:40px;width:auto"></p>' +
    '<p style="font-size:20px"><strong>' + escapeHtml(en[0]) + '</strong></p>' +
    en.slice(1).map(function (l) { return '<p>' + escapeHtml(l).replace(/\n/g, '<br>') + '</p>' }).join('') +
    '<hr>' + sw.map(function (l) { return '<p>' + escapeHtml(l) + '</p>' }).join('')
  for (let i = 0; i < emails.length; i += 40) {
    MailApp.sendEmail({
      to: notifyTo(),
      bcc: emails.slice(i, i + 40).join(','),
      subject: 'New casting: ' + clean(c.title) + ' / Usaili mpya',
      body: en.filter(Boolean).join('\n\n') + '\n\n— — —\n\n' + sw.filter(Boolean).join('\n\n'),
      htmlBody: html,
      name: 'Blackhood Africa',
    })
  }
  return { ok: true, sent: emails.length }
}

// For the Bookings tab on /admin (server-to-server only, behind the shared secret).
function listBookings() {
  const sheet = getBookingsSheet()
  const last = sheet.getLastRow()
  if (last < 2) return { ok: true, bookings: [] }
  const start = Math.max(2, last - 299)
  const rows = sheet.getRange(start, 1, last - start + 1, BOOKING_HEADERS.length).getValues()
  const keys = ['received', 'ref', 'status', 'name', 'company', 'phone', 'email', 'jobType', 'dates', 'location', 'talent', 'budget', 'usage', 'details', 'lang', 'notes']
  const bookings = rows
    .filter(function (r) { return r[1] })
    .map(function (r) {
      const b = {}
      keys.forEach(function (k, i) { b[k] = r[i] instanceof Date ? r[i].toISOString() : String(r[i]) })
      return b
    })
    .reverse()
  return { ok: true, bookings: bookings, statuses: BOOKING_STATUSES }
}

function setBookingStatus(data) {
  const sheet = getBookingsSheet()
  const last = sheet.getLastRow()
  if (last < 2) return { ok: false }
  const refs = sheet.getRange(2, 2, last - 1, 1).getValues()
  for (let i = 0; i < refs.length; i++) {
    if (String(refs[i][0]) !== String(data.ref)) continue
    if (data.status && BOOKING_STATUSES.indexOf(data.status) !== -1) sheet.getRange(i + 2, 3).setValue(data.status)
    if (typeof data.notes === 'string') sheet.getRange(i + 2, 16).setValue(clean(data.notes))
    return { ok: true }
  }
  return { ok: false, error: 'not found' }
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
      .requireValueInList(BOOKING_STATUSES, true)
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
        'Huhitaji kufanya kitu kingine. Ukikubaliwa, utapata barua pepe moja zaidi: namba yako ya kipaji na kiungo cha ukurasa wako kwenye tovuti yetu. Tunaweza pia kuwasiliana nawe WhatsApp – tafadhali amini ujumbe kutoka +255 711 505 927 pekee. Kuomba ni bure – hatutakuomba pesa.',
        'Kila la heri,',
        'Timu ya Blackhood Africa',
      ]
    : [
        'Hi ' + first + ',',
        'Thank you for applying to Blackhood Africa. We have received your application and photos, and our scouting team is reviewing it now.',
        'Your application reference is: ' + ref,
        'There is nothing else you need to do. If you are approved, you will get one more email: your talent code and the link to your own page on our website. We may also contact you on WhatsApp – please only trust messages from +255 711 505 927. Applying is free – we will never ask you for money to apply.',
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
    return true
  } catch (err) {
    console.warn('Approval email failed: ' + err)
    return false
  }
}

// /admin "Remind her": tells a model what her profile still needs before it can go live.
function sendProfileReminder(data) {
  const email = validEmail(data.email)
  if (!email) return { ok: false, error: 'no email' }
  if (MailApp.getRemainingDailyQuota() < 1) return { ok: false, error: 'quota' }
  const first = clean(data.name).split(' ')[0] || ''
  const missing = clean(data.missing)
  const link = SITE_URL + '/account'
  const en = [
    'Hi ' + first + ',',
    'Your Blackhood Africa profile is almost ready, but we can’t publish it yet. Still missing: ' + missing + '.',
    'Please log in at ' + link + ' with your email and talent code, add what’s missing, and tap “Save and send for review”.',
    'Need help? WhatsApp us on +255 711 505 927.',
    'The Blackhood Africa team',
  ]
  const sw = [
    'Habari ' + first + ',',
    'Wasifu wako wa Blackhood Africa unakaribia kukamilika, lakini bado hatuwezi kuuweka hewani. Bado inakosekana: ' + missing + '.',
    'Tafadhali ingia ' + link + ' kwa barua pepe na namba yako ya kipaji, jaza kinachokosekana, kisha bonyeza “Hifadhi na tuma kwa ukaguzi”.',
    'Unahitaji msaada? Tuandikie WhatsApp +255 711 505 927.',
    'Timu ya Blackhood Africa',
  ]
  try {
    MailApp.sendEmail({
      to: email,
      subject: 'Finish your Blackhood profile / Kamilisha wasifu wako',
      body: en.join('\n\n') + '\n\n— — —\n\n' + sw.join('\n\n'),
      htmlBody: en.map(function (l) { return '<p>' + escapeHtml(l) + '</p>' }).join('') + '<hr>' + sw.map(function (l) { return '<p>' + escapeHtml(l) + '</p>' }).join(''),
      name: 'Blackhood Africa',
      replyTo: notifyTo(),
    })
  } catch (err) {
    return { ok: false, error: 'send failed' }
  }
  return { ok: true, email: email }
}

// /admin "Approve & publish" for a website applicant: marks her Sheet row Approved and gives her a talent code.
// No email here: the website sends one "you're live" email with the code instead.
function approveByRef(data) {
  const ref = String(data.ref || '').trim().toUpperCase()
  const email = validEmail(data.email).toLowerCase()
  if (!/^BHA-\d{6}-\d{4}$/.test(ref) || !email) return { ok: false, error: 'bad ref' }
  const sheet = getSheet()
  const last = sheet.getLastRow()
  if (last < 2) return { ok: false, error: 'not found' }
  const rows = sheet.getRange(2, 1, last - 1, COL.code).getValues()
  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][1]).toUpperCase() !== ref) continue
    if (String(rows[i][COL.email - 1]).trim().toLowerCase() !== email) continue
    const row = i + 2
    let code = String(rows[i][COL.code - 1]).toUpperCase()
    if (!/^BHA-T-\d{4}$/.test(code)) {
      code = nextTalentCode()
      sheet.getRange(row, COL.code).setValue(code)
      sheet.getRange(row, COL.approvedOn).setValue(new Date())
    }
    sheet.getRange(row, COL.status).setValue('Approved')
    return { ok: true, code: code }
  }
  return { ok: false, error: 'not found' }
}

// /admin "Resend talent code email": finds the approved row by talent code and sends the approval email again.
function resendApproval(data) {
  const code = String(data.code || '').trim().toUpperCase()
  if (!/^BHA-T-\d{4}$/.test(code)) return { ok: false, error: 'bad code' }
  const sheet = getSheet()
  const last = sheet.getLastRow()
  if (last < 2) return { ok: false, error: 'not found' }
  const rows = sheet.getRange(2, 1, last - 1, COL.code).getValues()
  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][COL.code - 1]).toUpperCase() !== code) continue
    const status = String(rows[i][COL.status - 1])
    if (status !== 'Approved' && status !== 'Signed') return { ok: false, error: 'not approved' }
    const email = validEmail(rows[i][COL.email - 1])
    if (!email) return { ok: false, error: 'no email' }
    if (MailApp.getRemainingDailyQuota() < 1) return { ok: false, error: 'quota', email: email }
    const sent = sendApprovalEmail({ name: String(rows[i][COL.name - 1]), email: email, lang: String(rows[i][COL.lang - 1]) }, code)
    return { ok: sent, error: sent ? '' : 'send failed', email: email, name: String(rows[i][COL.name - 1]), left: MailApp.getRemainingDailyQuota() }
  }
  return { ok: false, error: 'not found' }
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
// Accepts the talent code (BHA-T-0001) or, since models mix them up, the application reference (BHA-261107-0006).
// Returns the talent code so the account is always linked to it.
function handleVerifyEmail(data) {
  const code = String(data.code || '').trim().toUpperCase()
  const email = validEmail(data.email).toLowerCase()
  const isTalent = /^BHA-T-\d{4}$/.test(code)
  const isRef = /^BHA-\d{6}-\d{4}$/.test(code)
  if ((!isTalent && !isRef) || !email) return { ok: true, valid: false }
  const sheet = getSheet()
  const last = sheet.getLastRow()
  if (last < 2) return { ok: true, valid: false }
  const rows = sheet.getRange(2, 1, last - 1, COL.code).getValues()
  for (let i = 0; i < rows.length; i++) {
    const match = isTalent ? String(rows[i][COL.code - 1]).toUpperCase() === code : String(rows[i][1]).toUpperCase() === code
    if (!match) continue
    const status = String(rows[i][COL.status - 1])
    const active = status === 'Approved' || status === 'Signed'
    const sameEmail = String(rows[i][COL.email - 1]).trim().toLowerCase() === email
    // Application numbers aren't always unique, so for those the email must match too.
    if (isRef && !sameEmail) continue
    const talentCode = String(rows[i][COL.code - 1]).toUpperCase()
    const ok = active && sameEmail && /^BHA-T-\d{4}$/.test(talentCode)
    return { ok: true, valid: ok, name: ok ? String(rows[i][COL.name - 1]) : '', talentCode: ok ? talentCode : '', reason: !active ? 'not approved' : !sameEmail ? 'email' : '' }
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
  if (MailApp.getRemainingDailyQuota() < 1) return { ok: false, error: 'quota' }
  try {
    MailApp.sendEmail({ to: email, subject: subject, body: lines.join('\n\n'), htmlBody: html, name: 'Blackhood Africa' })
  } catch (err) {
    return { ok: false, error: String(err).indexOf('many times') !== -1 ? 'quota' : 'send failed' }
  }
  return { ok: true }
}

// Sent the first time the team approves a model's online profile. Both languages, since we don't store a preference.
function sendProfileLiveEmail(data) {
  const email = validEmail(data.email)
  const slug = String(data.slug || '').replace(/[^a-z0-9-]/g, '')
  if (!email || !slug) return { ok: false }
  const first = clean(data.name).split(' ')[0] || ''
  const code = /^BHA-T-\d{4}$/.test(String(data.code || '')) ? String(data.code) : ''
  const page = SITE_URL + '/talent/' + slug
  const en = [
    'Dear ' + first + ',',
    "It gives me great pleasure to tell you that your Blackhood Africa profile is now live on our website. From today, brands can see your photos and details and book you directly.",
    page,
    code ? 'Your talent code is ' + code + '. Keep it safe: brands and parents can check it on our website, and you use it if you ever log in.' : '',
    'Share this link proudly on your Instagram and TikTok bio. You can update your photos or details any time at ' + SITE_URL + '/account, and our team will review changes before they go live.',
    'Your Blackhood comp card is ready to download at ' + SITE_URL + '/compcard',
    "If you ever need support, call or WhatsApp us on +255 711 505 927. We are proud to have you with us, and I can't wait to see where your career goes.",
    'Warm regards,\nEng. Noel Henjewele\nFounder & CEO, Blackhood Africa',
  ]
  const sw = [
    'Mpendwa ' + first + ',',
    'Nina furaha kubwa kukujulisha kuwa wasifu wako wa Blackhood Africa sasa uko hewani kwenye tovuti yetu. Kuanzia leo, makampuni yanaweza kuona picha na taarifa zako na kukuajiri moja kwa moja.',
    page,
    code ? 'Namba yako ya kipaji ni ' + code + '. Ihifadhi: makampuni na wazazi wanaweza kuithibitisha kwenye tovuti yetu, na unaitumia ukiingia.' : '',
    'Weka kiungo hiki kwa fahari kwenye bio yako ya Instagram na TikTok. Unaweza kubadilisha picha au taarifa wakati wowote kupitia ' + SITE_URL + '/account, na timu yetu itakagua mabadiliko kabla hayajaonekana.',
    'Comp card yako ya Blackhood iko tayari kupakua: ' + SITE_URL + '/compcard',
    'Ukihitaji msaada wowote, tupigie au tuandikie WhatsApp +255 711 505 927. Tunajivunia kuwa nawe, na natarajia kuona safari yako ikifika mbali.',
    'Kwa heshima,\nEng. Noel Henjewele\nMwanzilishi na Mkurugenzi Mtendaji, Blackhood Africa',
  ]
  const toHtml = function (lines) {
    return lines
      .filter(Boolean)
      .map(function (l, i) {
        return i === 2 ? '<p><a href="' + l + '" style="font-size:18px;font-weight:bold;color:#b8935a">' + l + '</a></p>' : '<p>' + escapeHtml(l).replace(/\n/g, '<br>') + '</p>'
      })
      .join('')
  }
  MailApp.sendEmail({
    to: email,
    subject: 'Your Blackhood profile is live / Wasifu wako uko hewani',
    replyTo: notifyTo(),
    body: en.filter(Boolean).join('\n\n') + '\n\n— — —\n\n' + sw.filter(Boolean).join('\n\n'),
    htmlBody:
      '<p><img src="' + SITE_URL + '/brand/logo-black.png" alt="Blackhood Africa" height="48" style="height:48px;width:auto"></p>' +
      toHtml(en) + '<hr>' + toHtml(sw),
    name: 'Noel Henjewele, Blackhood Africa',
  })
  return { ok: true }
}

function installTrigger() {
  const handlers = ScriptApp.getProjectTriggers().map(function (t) { return t.getHandlerFunction() })
  if (handlers.indexOf('onStatusEdit') === -1) ScriptApp.newTrigger('onStatusEdit').forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create()
  if (handlers.indexOf('sendApplicationDigest') === -1) ScriptApp.newTrigger('sendApplicationDigest').timeBased().everyHours(1).create()
  PropertiesService.getScriptProperties().setProperty('TRIGGERS_V2', 'yes')
  const props = PropertiesService.getScriptProperties()
  if (!props.getProperty('LAST_DIGEST')) props.setProperty('LAST_DIGEST', String(Date.now()))
}

// Hourly: one email to the team listing every application received since the last summary.
// Sends nothing when there are no new applications.
function sendApplicationDigest() {
  const to = notifyTo()
  if (!to) return
  const props = PropertiesService.getScriptProperties()
  const since = Number(props.getProperty('LAST_DIGEST') || 0)
  const now = Date.now()
  const sheet = getSheet()
  const last = sheet.getLastRow()
  if (last < 2) return props.setProperty('LAST_DIGEST', String(now))
  const rows = sheet.getRange(2, 1, last - 1, 20).getValues().filter(function (r) {
    return r[0] instanceof Date && r[0].getTime() > since && r[0].getTime() <= now
  })
  if (!rows.length) return props.setProperty('LAST_DIGEST', String(now))

  const line = function (r) {
    const minor = Number(r[4]) < 18
    return {
      text: r[1] + ' · ' + r[3] + ' · ' + r[4] + (minor ? ' (under 18)' : '') + ' · ' + r[6] + ' cm · ' + r[7] + ' · ' + r[11] + ' · WhatsApp ' + r[8],
      folder: String(r[19] || ''),
      minor: minor,
    }
  }
  const items = rows.map(line)
  const html =
    '<p><b>' + items.length + ' new application' + (items.length === 1 ? '' : 's') + '</b> on the website.</p><ol>' +
    items.map(function (i) {
      return '<li style="margin-bottom:6px">' + escapeHtml(i.text) + (i.folder ? ' · <a href="' + i.folder + '">photos</a>' : '') + '</li>'
    }).join('') +
    '</ol><p><a href="' + SpreadsheetApp.getActive().getUrl() + '">Open the applications sheet</a></p>'
  try {
    MailApp.sendEmail({
      to: to,
      subject: items.length + ' new application' + (items.length === 1 ? '' : 's') + ' (Blackhood website)',
      body: items.map(function (i, n) { return (n + 1) + '. ' + i.text + (i.folder ? '\n   Photos: ' + i.folder : '') }).join('\n'),
      htmlBody: html,
      name: 'Blackhood Website',
    })
    props.setProperty('LAST_DIGEST', String(now))
  } catch (err) {
    console.warn('Digest failed, will retry next hour: ' + err)
  }
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
