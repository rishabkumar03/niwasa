# Contact Form Setup

The consultation form saves leads to Google Sheets and sends an email notification through Google Apps Script.

## 1. Google Sheet

Create a Google Sheet and add a sheet tab named `Leads`.

Add this header row:

```text
Date | Name | Phone | Email | Project Type | Message | Source
```

Copy the Sheet ID from the spreadsheet URL. For example, in
`https://docs.google.com/spreadsheets/d/1AbC...XyZ/edit`, the ID is the part between `/d/` and `/edit`.

**Do not use the `AKfy...` value from the Apps Script `/macros/s/.../exec` URL here. That is the deployment ID, not the Sheet ID.** The deployment ID belongs in `static/js/core/site-config.js`; the Sheet ID belongs in `SPREADSHEET_ID` below.

**The ID is required even if the Apps Script is bound to the Sheet.** A deployed web app has no active spreadsheet context, so `getActiveSpreadsheet()` can return `null` there. The script uses `SpreadsheetApp.openById()` to always write to this exact file.
## 2. Apps Script

Open `Extensions > Apps Script` from inside that Sheet and paste the code from:

```text
google-apps-script-contact.gs
```

Paste the Sheet ID into `google-apps-script-contact.gs` before authorization and deployment:

```js
var SPREADSHEET_ID = "your-sheet-id-here";
```

Run `testDoPost` once from Apps Script and approve permissions. Confirm a test row appears in the exact Sheet whose ID you configured, and check the Apps Script execution log. Confirm:

- A test row appears in `Leads`.
- Email notification arrives at `interiorsniwasa@gmail.com`.

If the row appears but email does not arrive, the website is still working. Check Apps Script permissions, daily email quota, spam, and the value of:

```js
var NOTIFICATION_EMAIL = "interiorsniwasa@gmail.com";
```

## 3. Deploy

Deploy as Web App:

```text
Deploy > New deployment > Web app
Execute as: Me
Who has access: Anyone
```

Copy the Web App URL.

Use the public `/macros/s/.../exec` URL only. Do not use a logged-in account URL like `/macros/u/2/s/.../exec`; that can work for you but 404 for other people.

The endpoint validates name and a 10-digit Indian mobile number beginning with 6–9; email is optional. If you edit the script, redeploy a new version:

```text
Deploy > Manage deployments > Edit > Version: New version > Deploy
```

## 4. Website Config

Put the Web App URL in:

```text
static/js/core/site-config.js
```

```js
window.NIWASA_CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
};
```

## How To Debug

Submit the website form, then check Apps Script `Executions`.

- No execution means the URL in `site-config.js` is wrong or not deployed.
- Failed execution means the script permissions, Sheet ID, or sheet tab setup is wrong.
- Successful execution means the row should be in `Leads`. Open that execution and check the log entry `Lead appended to spreadsheet` for the exact spreadsheet URL, tab, and row number. A successful notification email is sent only after `appendRow` succeeds, so if the row seems missing, check that exact spreadsheet and tab, plus active filters/hidden rows and the Google account you are viewing.
- If the website says saved but email needs permission, run `testDoPost` inside Apps Script and approve `MailApp`.
