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

      return json({ ok: true, ref: ref })
    } finally {
      lock.releaseLock()
    }
  } catch (err) {
    return json({ ok: false, error: String(err) })
  }
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

// Run once from the editor to create the sheet/folder and approve permissions.
function setup() {
  getSheet()
  getFolder()
}
