# Contact Form Setup

The consultation form saves leads to Google Sheets and sends an email notification through Google Apps Script.

## 1. Google Sheet

Create a Google Sheet and add a sheet tab named `Leads`.

Add this header row:

```text
Date | Name | Phone | Email | Project Type | Message | Source
```

Copy the Sheet ID from its URL if you are using a standalone Apps Script:

```text
https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
```

## 2. Apps Script

Open `Extensions > Apps Script` from inside that Sheet and paste the code from:

```text
google-apps-script-contact.gs
```

If the script is not opened from inside the Sheet, paste your Sheet ID into:

```js
var SPREADSHEET_ID = "your-sheet-id-here";
```

Run `testDoPost` once from Apps Script and approve permissions. Confirm:

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

If you edit the script later, redeploy a new version:

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
- Successful execution means the row should be in `Leads`.
- If the website says saved but email needs permission, run `testDoPost` inside Apps Script and approve `MailApp`.
