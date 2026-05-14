/**
 * CURIUM WALKTHROUGH REQUEST HANDLER
 *
 * Receives POST requests from the walkthrough request form on curium.sg,
 * appends each submission to the active Google Sheet, and emails
 * contact@curium.sg with the details.
 *
 * --------------------------------------------------------------------
 * SETUP — ONE TIME, ~10 MINUTES
 * --------------------------------------------------------------------
 *
 * 1. Go to https://sheets.new (or create a new Google Sheet manually).
 *    Name it something like "Curium — Walkthrough Requests".
 *
 * 2. In row 1, add these column headers (one per cell, left to right):
 *      Timestamp | Name | Email | Company | Role | Message | Source
 *
 * 3. In the menu bar of that sheet: Extensions → Apps Script.
 *    This opens a new tab with a script editor.
 *
 * 4. Delete any boilerplate code in the editor and paste the entire
 *    contents of this file in its place.
 *
 * 5. Click the disk icon to save. Name the project anything (e.g.
 *    "Curium Walkthrough Handler").
 *
 * 6. Click Deploy → New deployment.
 *    - Click the gear icon next to "Select type" and choose "Web app".
 *    - Description: "Walkthrough form handler v1"
 *    - Execute as: Me (your-email@curium.sg)
 *    - Who has access: Anyone
 *    - Click Deploy.
 *
 * 7. Google will ask for permissions (to read/write the sheet and to
 *    send mail from your account). Click "Authorize access" and grant.
 *    You may need to click "Advanced → Go to (project name) (unsafe)"
 *    — this is normal for a personal Apps Script project.
 *
 * 8. After deployment Google shows a Web app URL like:
 *      https://script.google.com/macros/s/AKfycb.../exec
 *    Copy this URL. This is your form endpoint.
 *
 * 9. Open index.html. Find this string:
 *      REPLACE_WITH_GOOGLE_APPS_SCRIPT_URL
 *    Replace it with the URL from step 8.
 *
 * 10. Upload index.html to the curium.sg host. Test by submitting the
 *     form yourself. A new row should appear in the sheet within seconds,
 *     and an email should arrive at contact@curium.sg.
 *
 * --------------------------------------------------------------------
 * IF YOU LATER NEED TO CHANGE THIS SCRIPT
 * --------------------------------------------------------------------
 * After any edit, click Deploy → Manage deployments → pencil icon →
 * change "Version" to "New version" → Deploy. The URL stays the same.
 *
 * --------------------------------------------------------------------
 */

const NOTIFY_EMAIL = 'contact@curium.sg';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    const timestamp = new Date();
    const name    = (data.name    || '').toString().slice(0, 200);
    const email   = (data.email   || '').toString().slice(0, 200);
    const company = (data.company || '').toString().slice(0, 200);
    const role    = (data.role    || '').toString().slice(0, 200);
    const message = (data.message || '').toString().slice(0, 4000);
    const source  = (data.source  || 'curium.sg').toString().slice(0, 100);

    // Append to sheet
    sheet.appendRow([timestamp, name, email, company, role, message, source]);

    // Send notification email
    const subject = `New walkthrough request from ${name} (${company})`;
    const body =
      `New walkthrough request submitted via curium.sg:\n\n` +
      `Name:     ${name}\n` +
      `Email:    ${email}\n` +
      `Company:  ${company}\n` +
      `Role:     ${role || '(not provided)'}\n\n` +
      `Context:\n${message || '(none provided)'}\n\n` +
      `--\n` +
      `Submitted: ${timestamp.toISOString()}\n` +
      `Source:    ${source}\n`;

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: body,
      replyTo: email || NOTIFY_EMAIL,
      name: 'Curium Website'
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Log error so it appears in Apps Script execution log
    console.error('Walkthrough form error:', err);

    // Still email a notification so we don't silently miss leads
    try {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: '[Curium site] Form submission error',
        body: 'A form submission failed to process:\n\n' +
              (e && e.postData ? e.postData.contents : '(no postData)') +
              '\n\nError: ' + err.toString()
      });
    } catch (_) {}

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: visiting the URL in a browser hits doGet — return a friendly message
function doGet() {
  return ContentService
    .createTextOutput('Curium walkthrough endpoint — live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
