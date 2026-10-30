/**
 * Blackhood Africa: application receiver.
 * Paste this into Extensions → Apps Script of the "Blackhood Applications" Google Sheet.
 * It receives applications from the website, saves photos to Google Drive and adds one row per applicant.
 *
 * Setup: Project Settings → Script properties → add SHARED_SECRET (the same value as APPLY_SECRET in Vercel).
 */

const SHEET_NAME = 'Applications'
const DRIVE_FOLDER_NAME = 'Blackhood Applications – Photos'

const HEADERS = [
  'Received', 'Reference', 'Status', 'Full name', 'Age', 'Gender', 'Height (cm)', 'City / area',
  'Phone (WhatsApp)', 'Email', 'Instagram / TikTok', 'Interested in', 'Experience',
  'Guardian name', 'Guardian phone', 'Language', 'Headshot', 'Full length', 'Side profile', 'Photo folder', 'Notes',
]

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const secret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET')
    if (!secret || data.secret !== secret) return json({ ok: false, error: 'unauthorized' })

    const lock = LockService.getScriptLock()
    lock.waitLock(20000)
    try {
      const sheet = getSheet()
      const ref = 'BHA-' + Utilities.formatDate(new Date(), 'Africa/Dar_es_Salaam', 'yyMMdd') + '-' +
        String(sheet.getLastRow()).padStart(4, '0')

      const folder = getFolder().createFolder(ref + ' – ' + clean(data.name))
      const links = ['headshot', 'full', 'side'].map(function (key) {
        const photo = data.photos && data.photos[key]
        if (!photo) return ''
        const blob = Utilities.newBlob(Utilities.base64Decode(photo), 'image/jpeg', key + '.jpg')
        return folder.createFile(blob).getUrl()
      })

      sheet.appendRow([
        new Date(), ref, 'New', clean(data.name), data.age, clean(data.gender), data.height, clean(data.city),
        "'" + clean(data.phone), clean(data.email), clean(data.social), clean(data.interest), clean(data.experience),
        clean(data.guardianName), data.guardianPhone ? "'" + clean(data.guardianPhone) : '', clean(data.lang),
        links[0], links[1], links[2], folder.getUrl(), '',
      ])

      sendConfirmation(data, ref)
      notifyTeam(data, ref, sheet, folder.getUrl())
      return json({ ok: true, ref: ref })
    } finally {
      lock.releaseLock()
    }
  } catch (err) {
    return json({ ok: false, error: String(err) })
  }
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
  const to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL') || Session.getEffectiveUser().getEmail()
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
  getFolder()
  console.log('Emails left today: ' + MailApp.getRemainingDailyQuota())
}
