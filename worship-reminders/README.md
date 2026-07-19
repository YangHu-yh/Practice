# Worship Schedule Reminders

Apps Script that emails worship leaders from the schedule spreadsheet:
day-of reminder, 7-days-before (confirm instrument & second vocal),
3-days-before (confirm songs), plus alerts when the schedule is edited.
Read-only — never modifies the sheet.

## Setup (one time, ~10 min)

1. Log in to Google as **tcacf.ut@gmail.com**.
2. Convert the schedule: open the .xlsx in Google Sheets → **File → Save as Google Sheets**. Copy the **new** file's ID from its URL. Have everyone use the new file from now on.
3. Go to [script.google.com](https://script.google.com) → New project → paste `Code.gs`.
4. Edit the `CONFIG` block:
   - `SPREADSHEET_ID`: the new native-sheet ID
   - `DATE_HEADER` / `LEADER_HEADER`: exact header text in the sheet
   - `EMAILS`: name → email for every leader
5. Run `setup()` once from the editor; approve the permission prompts.

Done. It runs daily at 8am and instantly on any sheet edit.

## Notes

- Names in the sheet must match `EMAILS` keys exactly; mismatches email the coordinator instead of failing silently.
- To test: temporarily add a row dated 7/3/0 days from today and run `dailyCheck()` manually.
- This repo copy is just backup/version control; the live code runs in Apps Script.
