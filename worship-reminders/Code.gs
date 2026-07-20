/**
 * Worship schedule reminders.
 * Runs as tcacf.ut@gmail.com via Google Apps Script (script.google.com).
 * Reads the schedule sheet (never writes to it), emails reminders, syncs
 * Google Calendar events (with 6pm popup notifications), and detects
 * schedule changes.
 *
 * Setup: paste this into a new standalone Apps Script project, edit CONFIG,
 * then run setup() once (authorize when prompted).
 */

// ======================= CONFIG — edit this block =======================
var CONFIG = {
  SPREADSHEET_ID: '16H-shnXxKaMlDAlORiVssMwhAXgIB7VeLbYEay_oDus',
  SHEET_NAME: '2026',        // '' = first sheet; or e.g. '2026'
  DATE_HEADER: 'Date',       // header text of the date column
  LEADER_HEADER: 'Leader',   // header text of the worship-leader column

  // One entry per leader: their email + every way their name may be
  // written in the sheet. Matching ignores case, spaces, and '#'.
  LEADERS: [
    { email: 'pennybigping@gmail.com', names: ['張惠平', '惠平', 'Hui-ping', 'Penny'] },
    { email: 'phchennick@gmail.com',   names: ['Nick Chen', 'Nick', '#NickChen'] },
    { email: 'yang.hu496@gmail.com',   names: ['Yang', 'Yang Hu', '胡杨', 'Yang胡杨'] },
    { email: 'emilybai@utexas.edu',    names: ['Emily', 'Emily Bai'] },
    { email: 'ruian1106@gmail.com',    names: ['Ryan', 'Ryan Chang'] },
    { email: 'james31423a@gmail.com',  names: ['鄭謹譯', '謹譯', 'Chin-Yi', 'James'] },
    { email: 'CLSCROGGINS@gmail.com',  names: ['Clinton', 'Clinton-Scroggins', 'Clinton Scroggins'] }
  ],

  COORDINATOR_EMAIL: 'tcacf.ut@gmail.com', // gets change alerts + unknown-name warnings

  // If a date has no leader this many days ahead, alert these people.
  VACANCY: {
    DAYS_BEFORE: 14,
    NOTIFY: ['phchennick@gmail.com', 'pennybigping@gmail.com', 'yang.hu496@gmail.com']
  },

  DAILY_HOUR: 18, // hour (0-23) the daily email check runs — 18 = 6pm

  // Calendar sync: creates an all-day event per service on this account's
  // default calendar, invites the leader, with 6pm popup notifications
  // N days before (1 = the evening before, since all-day events start at
  // midnight and a same-day 6pm popup isn't possible).
  CALENDAR: {
    ENABLED: true,
    EVENT_TITLE: '🎵 Worship Leading — {name}',
    POPUP_DAYS_BEFORE: [7, 3, 1],
    NOTIFY_HOUR: 18 // 6pm
  },

  // Days-before -> message. 0 = day of service.
  REMINDERS: {
    7: { subject: 'Worship on {date} 🎶 — instrument & vocal check-in',
         body: 'Hi {name},\n\nHope your week is going well! Just a friendly heads-up that you\'ll be leading worship on {date} — thank you so much for serving! 🙏\n\nWhen you get a chance this week, could you confirm your instrumentalist and second vocal helper?\n\nBlessings,\nTCACF Auto Reminder' },
    3: { subject: 'Worship on {date} 🎶 — song list check-in',
         body: 'Hi {name},\n\nJust a gentle reminder that worship on {date} is a few days away. Could you confirm the songs you\'re planning to use? That way everyone has time to practice together. 😊\n\nThank you for leading us!\n\nBlessings,\nTCACF Auto Reminder' },
    0: { subject: 'Today\'s the day — worship on {date} 🎵',
         body: 'Hi {name},\n\nToday\'s the day! You\'re leading worship today, {date}. We\'re so grateful for you — see you there! 🙌\n\nBlessings,\nTCACF Auto Reminder' }
  }
};
// ========================================================================

/** Resolve a name from the sheet to an email; null if unknown. */
function resolveEmail(name) {
  var norm = normalizeName(name);
  for (var i = 0; i < CONFIG.LEADERS.length; i++) {
    var l = CONFIG.LEADERS[i];
    for (var j = 0; j < l.names.length; j++) {
      if (normalizeName(l.names[j]) === norm) return l.email;
    }
  }
  return null;
}

function normalizeName(s) {
  return String(s).toLowerCase().replace(/[\s#\-_,.]/g, '');
}

/** Run ONCE manually to install triggers. */
function setup() {
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('dailyCheck').timeBased().everyDays(1).atHour(CONFIG.DAILY_HOUR).create();
  ScriptApp.newTrigger('onSheetChange').forSpreadsheet(CONFIG.SPREADSHEET_ID).onChange().create();
  dailyCheck(); // also refreshes the snapshot + calendar now
}

/** Daily: send due reminders, sync calendar, check for schedule changes. */
function dailyCheck() {
  var schedule = readSchedule();
  var today = startOfDay(new Date());
  schedule.forEach(function (row) {
    var diff = Math.round((startOfDay(row.date) - today) / 86400000);
    if (!row.leader) { // no leader assigned yet
      if (diff === CONFIG.VACANCY.DAYS_BEFORE) {
        var vDateStr = Utilities.formatDate(row.date, Session.getScriptTimeZone(), 'EEE, MMM d, yyyy');
        MailApp.sendEmail(CONFIG.VACANCY.NOTIFY.join(','),
          'No worship leader yet for ' + vDateStr + ' 🙏',
          'Hi team,\n\nThere is no worship leader decided for ' + vDateStr +
          ' yet (2 weeks away). Could you try contacting or asking around to find someone?\n\nThank you!\nTCACF Auto Reminder');
      }
      return;
    }
    var r = CONFIG.REMINDERS[diff];
    if (!r) return;
    var email = resolveEmail(row.leader);
    var dateStr = Utilities.formatDate(row.date, Session.getScriptTimeZone(), 'EEE, MMM d, yyyy');
    if (!email) {
      MailApp.sendEmail(CONFIG.COORDINATOR_EMAIL, 'Worship reminder: no email for "' + row.leader + '"',
        row.leader + ' leads on ' + dateStr + ' but matches no one in the LEADERS list.');
      return;
    }
    MailApp.sendEmail(email,
      r.subject.replace('{date}', dateStr),
      r.body.replace(/\{name\}/g, row.leader).replace(/\{date\}/g, dateStr));
  });
  detectChanges(schedule);
  syncCalendar(schedule);
}

/** Fires within seconds of any edit to the spreadsheet. */
function onSheetChange() {
  var schedule = readSchedule();
  detectChanges(schedule);
  syncCalendar(schedule);
}

/**
 * Create/update one all-day calendar event per future service on this
 * account's default calendar, inviting the leader. Popup notifications at
 * NOTIFY_HOUR on the configured days before. Event IDs are remembered in
 * script properties; if a leader changes, the old event is deleted and a
 * fresh one (with a fresh invite) is created.
 */
function syncCalendar(schedule) {
  if (!CONFIG.CALENDAR.ENABLED) return;
  var cal = CalendarApp.getDefaultCalendar();
  var props = PropertiesService.getScriptProperties();
  var stored = JSON.parse(props.getProperty('calEvents') || '{}');
  var today = startOfDay(new Date());

  schedule.forEach(function (row) {
    if (startOfDay(row.date) < today || !row.leader) return;
    var key = Utilities.formatDate(row.date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    var prev = stored[key];
    if (prev && prev.leader === row.leader) return; // already synced

    if (prev) { // leader changed -> remove old event
      try { var old = cal.getEventById(prev.id); if (old) old.deleteEvent(); } catch (e) {}
    }

    var email = resolveEmail(row.leader);
    var ev = cal.createAllDayEvent(
      CONFIG.CALENDAR.EVENT_TITLE.replace('{name}', row.leader),
      row.date,
      { description: row.leader + ' is leading worship. 🎶\n(Created by TCACF Auto Reminder)',
        guests: email || '', sendInvites: !!email });
    ev.removeAllReminders();
    CONFIG.CALENDAR.POPUP_DAYS_BEFORE.forEach(function (d) {
      // all-day events start at midnight; d days before at NOTIFY_HOUR
      ev.addPopupReminder(d * 1440 - CONFIG.CALENDAR.NOTIFY_HOUR * 60);
    });
    stored[key] = { id: ev.getId(), leader: row.leader };
  });

  props.setProperty('calEvents', JSON.stringify(stored));
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
    // filling a blank slot isn't a "change"; a swap or removal is
    if (startOfDay(row.date) >= today && old.hasOwnProperty(key) && old[key] && old[key] !== row.leader) {
      changes.push({ date: key, from: old[key], to: row.leader || '(no leader yet)' });
    }
  });

  changes.forEach(function (c) {
    var msg = 'Schedule change for ' + c.date + ': ' + c.from + ' -> ' + c.to;
    var to = [CONFIG.COORDINATOR_EMAIL];
    var toEmail = resolveEmail(c.to), fromEmail = resolveEmail(c.from);
    if (toEmail) to.push(toEmail);
    if (fromEmail) to.push(fromEmail);
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
    if (isNaN(d.getTime())) continue; // keep blank-leader rows for vacancy alerts
    rows.push({ date: d, leader: leader });
  }
  return rows;
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Manual test: sends all three reminder templates to Yang only. */
function testYang() {
  var email = 'yang.hu496@gmail.com';
  var dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'EEE, MMM d, yyyy');
  [7, 3, 0].forEach(function (d) {
    var r = CONFIG.REMINDERS[d];
    MailApp.sendEmail(email,
      '[TEST] ' + r.subject.replace('{date}', dateStr),
      r.body.replace(/\{name\}/g, 'Yang').replace(/\{date\}/g, dateStr));
  });
}
