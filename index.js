const serverless = require('serverless-http');
const express = require('express');
const app = express();
app.use(express.json({limit: "50mb"})); // parse request body as JSON
const chromium = require('chrome-aws-lambda');
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function createPdf(body_html, header_html, footer_html, res) {
  console.log("createPdf called.");
  let browser = null;
  // /Users/topher/Sites/annick/worldviews/node_modules/puppeteer/.local-chromium/mac-950341/chrome-mac/Chromium.app/Contents/MacOS/Chromium
  let chromium_path = process.env.CHROMIUM_PATH || await chromium.executablePath;

  try {
    browser = await chromium.puppeteer.launch({
      headless: true,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: chromium_path,
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
    // See http://expressjs.com/en/4x/api.html#res.json
    res.status(200).send(base64);
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).send(err);
  }
}

// POST /generate-pdf with a JSON object having 3 fields:
// - body_html
// - header_html
// - footer_html
app.post('/generate-pdf', async function (req, res) {
  const json = req.body;
  console.log("The body json:", json);
  // const url = body.get('url');
  await createPdf(
    json.body_html,
    json.header_html,
    json.footer_html,
    res
  );
});

// For local development. Ignored on the production lambda.
port = 4001
app.listen(port, function(){
  console.log("Now listening on port "+port);
});

module.exports.handler = serverless(app);
