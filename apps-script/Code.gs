/**
 * After. Harbor quiz → Google Sheet append
 * Sheet: After. Harbor / BloomRx Leads (user-specified)
 * ID: 1Jt7Z7f_Pypyh8km37pv43-j0KdFrp9MKjNESwrPcU58
 * Deploy: Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * Then paste the Web App URL into quiz.html SHEET_WEBAPP_URL
 */
var SHEET_ID = '1Jt7Z7f_Pypyh8km37pv43-j0KdFrp9MKjNESwrPcU58';
var SHEET_NAME = 'Leads';

function ensureSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow([
      'timestamp','full_name','email','phone','state','age_band','goal',
      'insurance_status','bmi_est','glp1_history','contraindications','pace',
      'status','price','answers_json','source_page','brand'
    ]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }
    var sh = ensureSheet_();
    sh.appendRow([
      data.timestamp || new Date().toISOString(),
      data.full_name || data.name || '',
      data.email || '',
      data.phone || '',
      data.state || '',
      data.age_band || '',
      data.goal || '',
      data.insurance_status || '',
      data.bmi_est || '',
      data.glp1_history || '',
      data.contraindications || '',
      data.pace || '',
      data.status || '',
      data.price || '$199/mo membership if prescribed',
      typeof data.answers_json === 'string' ? data.answers_json : JSON.stringify(data.answers || {}),
      data.source_page || 'quiz',
      data.brand || 'After. Harbor'
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  ensureSheet_();
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'After. Harbor leads', sheetId: SHEET_ID }))
    .setMimeType(ContentService.MimeType.JSON);
}

function setup() {
  ensureSheet_();
}
