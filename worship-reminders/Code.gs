/**
 * Worship schedule reminders.
 * Runs as tcacf.ut@gmail.com via Google Apps Script (script.google.com).
 * Reads the schedule sheet (never writes to it), emails reminders, and
 * detects schedule changes.
 *
 * Setup: paste this into a new standalone Apps Script project, edit CONFIG,
 * then run setup() once (authorize when prompted).
 */

// ======================= CONFIG — edit this block =======================
var CONFIG = {
  SPREADSHEET_ID: '1Eg5AgpcZgO-XBwh33hD5VoJEtEB1C7Jw', // update after converting to native Google Sheet (ID changes!)
  SHEET_NAME: '',            // '' = first sheet; or e.g. '2026'
  DATE_HEADER: 'Date',       // header text of the date column
  LEADER_HEADER: 'Leader',   // header text of the worship-leader column

  // Name (exactly as written in the sheet) -> email
  EMAILS: {
    'Example Name': 'example@gmail.com'
  },

  COORDINATOR_EMAIL: 'tcacf.ut@gmail.com', // gets change alerts + unknown-name warnings

  // Days-before -> message. 0 = day of service.
  REMINDERS: {
    7: { subject: 'Worship on {date}: confirm instrument & second vocal',
         body: 'Hi {name},\n\nYou are leading worship on {date}.\nPlease confirm your instrumentalist and second vocal helper this week.\n\nThank you!' },
    3: { subject: 'Worship on {date}: confirm song list',
         body: 'Hi {name},\n\nYou are leading worship on {date}.\nPlease confirm the songs you will use.\n\nThank you!' },
    0: { subject: 'You are leading worship today ({date})',
         body: 'Hi {name},\n\nReminder: you are leading worship today, {date}.\n\nThank you for serving!' }
  }
};
// ========================================================================

/** Run ONCE manually to install triggers. */
function setup() {
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('dailyCheck').timeBased().everyDays(1).atHour(8).create();
  ScriptApp.newTrigger('onSheetChange').forSpreadsheet(CONFIG.SPREADSHEET_ID).onChange().create();
  dailyCheck(); // also refreshes the snapshot now
}

/** Daily: send due reminders, then check for schedule changes. */
function dailyCheck() {
  var schedule = readSchedule();
  var today = startOfDay(new Date());
  schedule.forEach(function (row) {
    var diff = Math.round((startOfDay(row.date) - today) / 86400000);
    var r = CONFIG.REMINDERS[diff];
    if (!r) return;
    var email = CONFIG.EMAILS[row.leader];
    var dateStr = Utilities.formatDate(row.date, Session.getScriptTimeZone(), 'EEE, MMM d, yyyy');
    if (!email) {
      MailApp.sendEmail(CONFIG.COORDINATOR_EMAIL, 'Worship reminder: no email for "' + row.leader + '"',
        row.leader + ' leads on ' + dateStr + ' but is not in the EMAILS list.');
      return;
    }
    MailApp.sendEmail(email,
      r.subject.replace('{date}', dateStr),
      r.body.replace(/\{name\}/g, row.leader).replace(/\{date\}/g, dateStr));
  });
  detectChanges(schedule);
}

/** Fires within seconds of any edit to the spreadsheet. */
function onSheetChange() {
  detectChanges(readSchedule());
}

/** Diff current schedule vs stored snapshot; alert on changes to future dates. */
function detectChanges(schedule) {
  var props = PropertiesService.getScriptProperties();
  var old = JSON.parse(props.getProperty('snapshot') || '{}');
  var now = {};
  var today = startOfDay(new Date());
  var changes = [];

  schedule.forEach(function (row) {
    var key = Utilities.formatDate(row.date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    now[key] = row.leader;
    if (startOfDay(row.date) >= today && old.hasOwnProperty(key) && old[key] !== row.leader) {
      changes.push({ date: key, from: old[key], to: row.leader });
    }
  });

  changes.forEach(function (c) {
    var msg = 'Schedule change for ' + c.date + ': ' + c.from + ' -> ' + c.to;
    var to = [CONFIG.COORDINATOR_EMAIL];
    if (CONFIG.EMAILS[c.to]) to.push(CONFIG.EMAILS[c.to]);
    if (CONFIG.EMAILS[c.from]) to.push(CONFIG.EMAILS[c.from]);
    MailApp.sendEmail(to.join(','), 'Worship schedule changed (' + c.date + ')', msg);
  });

  props.setProperty('snapshot', JSON.stringify(now));
}

/** Read the sheet -> [{date: Date, leader: string}]. Read-only. */
function readSchedule() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = CONFIG.SHEET_NAME ? ss.getSheetByName(CONFIG.SHEET_NAME) : ss.getSheets()[0];
  var values = sheet.getDataRange().getValues();

  var headerRow = -1, dateCol = -1, leaderCol = -1;
  for (var i = 0; i < values.length && headerRow < 0; i++) {
    for (var j = 0; j < values[i].length; j++) {
      var cell = String(values[i][j]).trim().toLowerCase();
      if (cell === CONFIG.DATE_HEADER.toLowerCase()) dateCol = j;
      if (cell === CONFIG.LEADER_HEADER.toLowerCase()) leaderCol = j;
    }
    if (dateCol >= 0 && leaderCol >= 0) headerRow = i;
    else { dateCol = -1; leaderCol = -1; }
  }
  if (headerRow < 0) throw new Error('Could not find headers "' + CONFIG.DATE_HEADER + '" and "' + CONFIG.LEADER_HEADER + '"');

  var rows = [];
  for (var k = headerRow + 1; k < values.length; k++) {
    var d = values[k][dateCol], leader = String(values[k][leaderCol]).trim();
    if (!(d instanceof Date)) d = new Date(d);
    if (!leader || isNaN(d.getTime())) continue;
    rows.push({ date: d, leader: leader });
  }
  return rows;
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
