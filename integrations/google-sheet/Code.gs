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

const HEADERS = [
  'Received', 'Reference', 'Status', 'Full name', 'Age', 'Gender', 'Height (cm)', 'City / area',
  'Phone (WhatsApp)', 'Email', 'Instagram / TikTok', 'Interested in', 'Experience',
  'Guardian name', 'Guardian phone', 'Language', 'Headshot', 'Full length', 'Side profile', 'Photo folder', 'Notes',
]

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
      return json(data.type === 'booking' ? handleBooking(data) : handleApplication(data))
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
    // Status dropdown for tracking each applicant
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['New', 'Contacted', 'Invited to casting', 'Academy', 'Signed', 'Not now'], true)
      .build()
    sheet.getRange('C2:C').setDataValidation(rule)
  }
  return sheet
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
  getSheet()
  getBookingsSheet()
  getFolder()
  console.log('Emails left today: ' + MailApp.getRemainingDailyQuota())
}
