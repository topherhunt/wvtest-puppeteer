const serverless = require('serverless-http');
const express = require('express');
const app = express();
const chromium = require('chrome-aws-lambda');
const htmlGenerator = require('./reportTemplate');

async function createPdf(url, res) {
  //options for pdf
  const options = {
    format: 'A4',
    printBackground: true,
    margin: {
      bottom: 70,
      top: 0,
      left: 0,
      right: 0,
    }
  };

  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      headless: true,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
    });
    // launch a new page
    const page = await browser.newPage();
    // navigate to the specified url
    await page.goto(event.url);
    // generate a pdf stream of the page with options
    const pdfStream = await page.pdf(options);
    // convert stream to b64
    const b64 = pdfStream.toString('base64');
    await browser.close();
    res.send({ statusCode: 200, pdfData: b64 });
  } catch (err) {
    res.send({ statusCode: 500, userMessage: err });
  }
}

app.post('/generate-pdf', async function (req, res) {
  const body = JSON.parse(req.body.toString());
  const url = body.get('url');
  await createPdf(url, res);
});

module.exports.handler = serverless(app);
