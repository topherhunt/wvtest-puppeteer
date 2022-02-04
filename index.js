const serverless = require('serverless-http');
const express = require('express');
const app = express();
const chromium = require('chrome-aws-lambda');

async function createPdf(body_html, header_html, footer_html, res) {
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      headless: true,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
    });

    const page = await browser.newPage();
    await page.setContent(body_html);
    await sleep(200); // Wait for charts to finish rendering

    // Docs: https://github.com/puppeteer/puppeteer/blob/v13.1.3/docs/api.md#pagepdfoptions
    const pdfStream = await page.pdf({
      // format: "a4",
      // printBackground: true,
      margin: {top: "50px", bottom: "50px", left: "10px", right: "10px"},
      displayHeaderFooter: true, // TODO: Do we need this?
      headerTemplate: header_html,
      footerTemplate: footer_html
    });
    const base64 = pdfStream.toString('base64');
    await browser.close();
    res.send({statusCode: 200, pdfData: base64});
  } catch (err) {
    res.send({statusCode: 500, userMessage: err});
  }
}

// POST /generate-pdf with a JSON object having 3 fields:
// - body_html
// - header_html
// - footer_html
app.post('/generate-pdf', async function (req, res) {
  const body = JSON.parse(req.body.toString());
  // const url = body.get('url');
  await createPdf(
    body.get("body_html"),
    body.get("header_html"),
    body.get("footer_html"),
    res
  );
});

module.exports.handler = serverless(app);
