/**
 * NIWASA Interior - Google Sheet consultation endpoint
 *
 * Browser flow:
 *   static/js/pages/contact.js calls this Web App with:
 *   ?callback=someFunction&payload={encoded JSON}
 *
 * This JSONP flow lets the static website receive a real ok/error response
 * without blind success.
 */

var SPREADSHEET_ID = "PASTE_SPREADSHEET_ID_HERE"; // Required for web-app executions.
var NOTIFICATION_EMAIL = "interiorsniwasa@gmail.com";

function doGet(e) {
  var callback = e && e.parameter ? e.parameter.callback : "";
  var payload = e && e.parameter ? e.parameter.payload : "";
  var safeCallback = "";

  if (!callback || !payload) {
    return ContentService
      .createTextOutput("NIWASA consultation endpoint is live.")
      .setMimeType(ContentService.MimeType.TEXT);
  }

  var response;

  try {
    safeCallback = sanitizeCallback_(callback);
    var data = JSON.parse(payload);
    var result = saveLead_(data);
    response = {
      ok: true,
      saved: true,
      emailSent: result.emailSent,
      emailError: result.emailError
    };
  } catch (err) {
    Logger.log("doGet FAILED: " + err);
    response = { ok: false, error: err.toString() };
  }

  if (!safeCallback) {
    return ContentService
      .createTextOutput("/* Invalid NIWASA callback. " + JSON.stringify(response) + " */")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(safeCallback + "(" + JSON.stringify(response) + ");")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doPost(e) {
  try {
    var data = parsePostData_(e);
    var result = saveLead_(data);

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        saved: true,
        emailSent: result.emailSent,
        emailError: result.emailError
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log("doPost FAILED: " + err);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveLead_(data) {
  validateLead_(data);

  var sheet = getLeadsSheet_();

  var timestamp = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "dd-MMM-yyyy hh:mm a"
  );

  sheet.appendRow([
    timestamp,
    data.name || "",
    data.phone || "",
    data.email || "",
    data.project_type || "",
    data.message || "",
    data.source || "NIWASA Website"
  ]);
  Logger.log("Lead appended to spreadsheet: " + sheet.getParent().getUrl() + " (tab: " + sheet.getName() + ", row: " + sheet.getLastRow() + ")");

  var emailResult = sendNotificationEmail_(timestamp, data);
  Logger.log("Lead saved for: " + (data.name || "unknown"));

  if (!emailResult.sent) {
    Logger.log("Email notification failed: " + emailResult.error);
  }

  return {
    emailSent: emailResult.sent,
    emailError: emailResult.error
  };
}

function getLeadsSheet_() {
  if (/^AKfycb/i.test(String(SPREADSHEET_ID || ""))) {
    throw new Error("SPREADSHEET_ID is an Apps Script deployment ID. Use the Google Sheet file ID from docs.google.com/spreadsheets/d/<ID>/edit.");
  }

  if (!SPREADSHEET_ID || SPREADSHEET_ID === "PASTE_SPREADSHEET_ID_HERE") {
    throw new Error("Set SPREADSHEET_ID to the target Google Sheet ID before deploying the web app.");
  }

  // A deployed web app has no active spreadsheet context; always open the target explicitly.
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  var sheet = ss.getSheetByName("Leads");

  if (!sheet) {
    sheet = ss.insertSheet("Leads");
    sheet.appendRow(["Date", "Name", "Phone", "Email", "Project Type", "Message", "Source"]);
  }

  return sheet;
}

function sendNotificationEmail_(timestamp, data) {
  try {
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: "New Consultation Request - NIWASA Interior",
      htmlBody:
        "<h2>New Consultation Request</h2>" +
        "<b>Date:</b> " + escapeHtml_(timestamp) + "<br><br>" +
        "<b>Name:</b> " + escapeHtml_(data.name || "-") + "<br>" +
        "<b>Phone:</b> " + escapeHtml_(data.phone || "-") + "<br>" +
        "<b>Email:</b> " + escapeHtml_(data.email || "-") + "<br>" +
        "<b>Project Type:</b> " + escapeHtml_(data.project_type || "-") + "<br><br>" +
        "<b>Message:</b><br>" +
        escapeHtml_(data.message || "-")
    });

    return { sent: true, error: "" };
  } catch (err) {
    return { sent: false, error: err.toString() };
  }
}

function parsePostData_(e) {
  var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "";
  if (raw) {
    return JSON.parse(raw);
  }
  return e && e.parameter ? e.parameter : {};
}

function validateLead_(data) {
  if (!data) throw new Error("No form data received.");
  if (!String(data.name || "").trim()) throw new Error("Name is required.");

  var phone = String(data.phone || "").trim();
  if (!/^[6-9][0-9]{9}$/.test(phone)) {
    throw new Error("Phone must be a 10-digit mobile number starting from 6 to 9.");
  }

  var email = String(data.email || "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Email address is invalid.");
  }
}

function sanitizeCallback_(callback) {
  if (!/^[A-Za-z_$][0-9A-Za-z_$]*(\.[A-Za-z_$][0-9A-Za-z_$]*)*$/.test(callback)) {
    throw new Error("Invalid callback name.");
  }
  return callback;
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function testDoPost() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        name: "Test Lead",
        phone: "9999999999",
        email: "test@example.com",
        project_type: "Full Home Interior",
        message: "This is a manual test submission.",
        source: "Manual Test"
      })
    }
  };

  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
