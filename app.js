const express = require('express');
const app = express();
const puppeteer = require("puppeteer");
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const now = () => (new Date()).toISOString();
const log = (msg) => console.log(""+now()+" "+msg);
const port = process.env.PORT || 3000;

// ExpressJS middleware
app.use(express.json({limit: "50mb"})); // add support for parisng JSON request body

async function render_pdf(body_html, header_html, footer_html, res) {
  log("render_pdf started. Input lengths: body="+body_html.length+", header="+header_html.length+", footer="+footer_html.length+".");

  try {
    let browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
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

    log("render_pdf done, sending response.");
    res.status(200).send(base64);
  } catch (err) {
    log("ERROR: render_pdf failed: "+err);
    res.status(500).send(err);
  }
}

app.get("/ping", async function (req, res) {
  log("■ method="+req.method+" path="+req.path+"");
  res.json({ok: true, now: now(), message: "Live long and prosper."});
});

app.post('/generate-pdf', async function (req, res) {
  log("■ method="+req.method+" path="+req.path+"");
  const body = req.body.body_html,
        header = req.body.header_html,
        footer = req.body.footer_html;

  if (body && header && footer) {
    await render_pdf(body, header, footer, res);
  } else {
    log("ERROR: body_html, header_html, or footer_html is missing. Render aborted.");
    res.status(422).json({error: "body_html, header_html, and footer_html are all required"});
  }
});

app.listen(port, function(){
  log("Server is running and listening on port "+port+".");
});
