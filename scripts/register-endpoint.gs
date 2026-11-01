/**
 * The house register, as a destination that costs nothing and belongs to no
 * one but you.
 *
 * `CLIENT_REGISTER_WEBHOOK_URL` can point at anything that accepts a POST.
 * This is the shortest route to having one: a Google Sheet you already own,
 * no new account, no vendor, and the list stays somewhere you can export.
 * Swap it for a real CRM whenever there is a reason to; nothing in the site
 * knows the difference.
 *
 * To deploy:
 *
 *   1. Create a Google Sheet. Extensions, then Apps Script.
 *   2. Replace the file it opens with this one and save.
 *   3. Set SHARED_TOKEN below to a long random string.
 *   4. Deploy, New deployment, type Web app.
 *      Execute as: Me. Who has access: Anyone.
 *   5. Copy the /exec URL it gives you.
 *   6. In Vercel, set for Production:
 *        CLIENT_REGISTER_WEBHOOK_URL = <that /exec URL>?token=<SHARED_TOKEN>
 *      Then redeploy. Next only exposes variables present at build time, so
 *      saving the variable without a redeploy changes nothing.
 *
 * The token travels in the query string rather than a header because an
 * Apps Script web app cannot read request headers at all. The site's
 * `CLIENT_REGISTER_WEBHOOK_TOKEN` sends an Authorization header, which this
 * endpoint would never see, so leave that one unset for this destination.
 *
 * "Who has access: Anyone" means anyone holding the URL can post to it,
 * which is why the token is checked rather than left as decoration.
 */

const SHARED_TOKEN = "replace-me-with-a-long-random-string";

/** The columns written, in order. Add to the end, never the middle. */
const COLUMNS = ["receivedAt", "kind", "email", "name", "region", "note"];

function doPost(e) {
  try {
    const given = (e && e.parameter && e.parameter.token) || "";
    if (given !== SHARED_TOKEN) {
      return reply({ ok: false, error: "unauthorised" });
    }

    const body = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);

    sheet.appendRow(
      COLUMNS.map(function (key) {
        return key === "receivedAt"
          ? body.receivedAt || new Date().toISOString()
          : body[key] || "";
      }),
    );

    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

/**
 * Apps Script always answers 200, so the site's `response.ok` check cannot
 * tell a refusal from a success. That is survivable here: a rejected post
 * means the token is wrong, which is a setup mistake you will see in the
 * sheet staying empty rather than something a visitor can cause.
 */
function reply(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
