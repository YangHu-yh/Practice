/**
 * Worship schedule reminders.
 * Runs as tcacf.ut@gmail.com via Google Apps Script (script.google.com).
 * Reads the schedule sheet (never writes to it), emails reminders, syncs
 * Google Calendar events (with 3pm popup notifications), and detects
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
  INSTRUMENT_HEADER: 'Instrument',    // optional column
  VOCAL_HEADER: 'Second vocal',       // optional column
  SONGS_HEADER: 'Songs',              // optional column

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

  DAILY_HOUR: 15, // hour (0-23) the daily email check runs — 15 = 3pm

  // Calendar sync: creates an all-day event per service on this account's
  // default calendar, invites the leader, with 3pm popup notifications
  // N days before (1 = the evening before, since all-day events start at
  // midnight and a same-day 3pm popup isn't possible).
  CALENDAR: {
    ENABLED: true,
    EVENT_TITLE: '🎵 Worship Leading — {name}',
    POPUP_DAYS_BEFORE: [7, 3, 1],
    NOTIFY_HOUR: 15 // 3pm
  },

  // When reminders go out (days before the service)
  DAYS: { TEAM: 6, SONGS: 3, DAY_OF: 0 },

  // Placeholders: {name} {date} {instrument} {vocal}
  MESSAGES: {
    TEAM_BOTH_MISSING: {
      subject: 'Worship on {date} 🎶 — instrument & second vocal check-in',
      body: 'Hi {name},\n\nHope your week is going well! Just a friendly heads-up that you\'ll be leading worship on {date} — thank you so much for serving! 🙏\n\nIt looks like the instrumentalist and second vocal helper aren\'t on the schedule yet. When you get a chance, could you find and confirm them?\n\nBlessings,\nTCACF Auto Reminder' },
    TEAM_INSTRUMENT_MISSING: {
      subject: 'Worship on {date} 🎶 — still need an instrumentalist',
      body: 'Hi {name},\n\nHope your week is going well! You\'ll be leading worship on {date} — thank you for serving! 🙏\n\nYour second vocal ({vocal}) is set, but it looks like the instrumentalist isn\'t on the schedule yet. Could you find and confirm someone when you get a chance?\n\nBlessings,\nTCACF Auto Reminder' },
    TEAM_VOCAL_MISSING: {
      subject: 'Worship on {date} 🎶 — still need a second vocal',
      body: 'Hi {name},\n\nHope your week is going well! You\'ll be leading worship on {date} — thank you for serving! 🙏\n\nYour instrumentalist ({instrument}) is set, but it looks like the second vocal helper isn\'t on the schedule yet. Could you find and confirm someone when you get a chance?\n\nBlessings,\nTCACF Auto Reminder' },
    TEAM_ALL_SET: {
      subject: 'Worship on {date} 🎶 — quick availability check',
      body: 'Hi {name},\n\nYou\'ll be leading worship on {date} — thank you for serving! 🙏\n\nYour team is on the schedule: instrumentalist {instrument} and second vocal {vocal}. Could you just double-check that they\'re both still available?\n\nBlessings,\nTCACF Auto Reminder' },
    SONGS_MISSING: {
      subject: 'Worship on {date} 🎶 — song list check-in',
      body: 'Hi {name},\n\nJust a gentle reminder that worship on {date} is a few days away, and the song list isn\'t on the schedule yet. Could you confirm the songs you\'re planning to use? That way everyone has time to practice together. 😊\n\nThank you for leading us!\n\nBlessings,\nTCACF Auto Reminder' },
    DAY_OF: {
      subject: 'Today\'s the day — worship on {date} 🎵',
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

/** Send mail with an HTML body so Gmail doesn't hard-wrap lines. */
function sendMail(to, subject, body) {
  MailApp.sendEmail(to, subject, body, { htmlBody: body.replace(/\n/g, '<br>') });
}

/** Run ONCE manually to install triggers. */
function setup() {
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('dailyCheck').timeBased().everyDays(1).atHour(CONFIG.DAILY_HOUR).create();
  ScriptApp.newTrigger('onSheetChange').forSpreadsheet(CONFIG.SPREADSHEET_ID).onChange().create();
  dailyCheck(); // also refreshes the snapshot + calendar now
}

/** Pick the right message for this row/day; null = nothing to send. */
function pickMessage(row, diff) {
  var M = CONFIG.MESSAGES;
  if (diff === CONFIG.DAYS.TEAM) {
    if (!row.instrument && !row.vocal) return M.TEAM_BOTH_MISSING;
    if (!row.instrument) return M.TEAM_INSTRUMENT_MISSING;
    if (!row.vocal) return M.TEAM_VOCAL_MISSING;
    return M.TEAM_ALL_SET;
  }
  if (diff === CONFIG.DAYS.SONGS) return row.songs ? null : M.SONGS_MISSING;
  if (diff === CONFIG.DAYS.DAY_OF) return M.DAY_OF;
  return null;
}

function fillTemplate(text, row, dateStr) {
  return text.replace(/\{name\}/g, row.leader)
             .replace(/\{date\}/g, dateStr)
             .replace(/\{instrument\}/g, row.instrument)
             .replace(/\{vocal\}/g, row.vocal);
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
        sendMail(CONFIG.VACANCY.NOTIFY.join(','),
          'No worship leader yet for ' + vDateStr + ' 🙏',
          'Hi team,\n\nThere is no worship leader decided for ' + vDateStr +
          ' yet (2 weeks away). Could you try contacting or asking around to find someone?\n\nThank you!\nTCACF Auto Reminder');
      }
      return;
    }
    var r = pickMessage(row, diff);
    if (!r) return;
    var email = resolveEmail(row.leader);
    var dateStr = Utilities.formatDate(row.date, Session.getScriptTimeZone(), 'EEE, MMM d, yyyy');
    if (!email) {
      sendMail(CONFIG.COORDINATOR_EMAIL, 'Worship reminder: no email for "' + row.leader + '"',
        row.leader + ' leads on ' + dateStr + ' but matches no one in the LEADERS list.');
      return;
    }
    sendMail(email, fillTemplate(r.subject, row, dateStr), fillTemplate(r.body, row, dateStr));
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
    sendMail(to.join(','), 'Worship schedule changed (' + c.date + ')', msg);
  });

  props.setProperty('snapshot', JSON.stringify(now));
}

/**
 * Read the sheet -> [{date, leader, instrument, vocal, songs}]. Read-only.
 * Instrument/vocal/songs columns are optional; missing columns read as ''.
 */
function readSchedule() {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = CONFIG.SHEET_NAME ? ss.getSheetByName(CONFIG.SHEET_NAME) : ss.getSheets()[0];
  var values = sheet.getDataRange().getValues();

  var headerRow = -1, dateCol = -1, leaderCol = -1, instCol = -1, vocalCol = -1, songsCol = -1;
  for (var i = 0; i < values.length && headerRow < 0; i++) {
    for (var j = 0; j < values[i].length; j++) {
      var cell = String(values[i][j]).trim().toLowerCase();
      if (cell === CONFIG.DATE_HEADER.toLowerCase()) dateCol = j;
      if (cell === CONFIG.LEADER_HEADER.toLowerCase()) leaderCol = j;
      if (cell === CONFIG.INSTRUMENT_HEADER.toLowerCase()) instCol = j;
      if (cell === CONFIG.VOCAL_HEADER.toLowerCase()) vocalCol = j;
      if (cell === CONFIG.SONGS_HEADER.toLowerCase()) songsCol = j;
    }
    if (dateCol >= 0 && leaderCol >= 0) headerRow = i;
    else { dateCol = -1; leaderCol = -1; instCol = -1; vocalCol = -1; songsCol = -1; }
  }
  if (headerRow < 0) throw new Error('Could not find headers "' + CONFIG.DATE_HEADER + '" and "' + CONFIG.LEADER_HEADER + '"');

  var rows = [];
  for (var k = headerRow + 1; k < values.length; k++) {
    var d = values[k][dateCol];
    if (!(d instanceof Date)) d = new Date(d);
    if (isNaN(d.getTime())) continue; // keep blank-leader rows for vacancy alerts
    rows.push({
      date: d,
      leader: String(values[k][leaderCol]).trim(),
      instrument: instCol >= 0 ? String(values[k][instCol]).trim() : '',
      vocal: vocalCol >= 0 ? String(values[k][vocalCol]).trim() : '',
      songs: songsCol >= 0 ? String(values[k][songsCol]).trim() : ''
    });
  }
  return rows;
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Manual test: sends every message variant to Yang only. */
function testYang() {
  var email = 'yang.hu496@gmail.com';
  var dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'EEE, MMM d, yyyy');
  var fakeRow = { leader: 'Yang', instrument: 'Nick (guitar)', vocal: 'Emily', songs: '' };
  Object.keys(CONFIG.MESSAGES).forEach(function (kind) {
    var r = CONFIG.MESSAGES[kind];
    sendMail(email,
      '[TEST ' + kind + '] ' + fillTemplate(r.subject, fakeRow, dateStr),
      fillTemplate(r.body, fakeRow, dateStr));
  });
}
