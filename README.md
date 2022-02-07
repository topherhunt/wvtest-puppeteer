# WVTest PDF generator service using AWS Lambda & Puppeteer

Created by following this tutorial: https://medium.com/swlh/how-to-create-pdf-in-lambda-using-puppeteer-6355348b8a82

Deployed using https://serverless.com/.

Useful references:

- https://www.serverless.com/framework/docs/
- https://www.serverless.com/framework/docs/providers/aws/guide/credentials/


## Dev setup

- Clone the repository
- `cd` into the project folder
- `npm install`
- If `serverless` isn't already in your PATH, you may need to `alias serverless='node_modules/serverless/bin/serverless.js'`.
- Give your AWS credentials to Serverless - see steps here: https://www.serverless.com/framework/docs/providers/aws/guide/credentials/
- `serverless deploy` - deploy changes
- `serverless info` - view details on deployed service & endpoints


### Local testing

- Start the dev server: `CHROMIUM_PATH=/path/to/your/node_modules/puppeteer/.local-chromium/mac-950341/chrome-mac/Chromium.app/Contents/MacOS/Chromium node index.js`
- Make a request to the endpoint: `curl -X POST http://localhost:4001/generate-pdf ...` (Be sure to provide the body_html, header_html, and footer_html as escaped strings in JSON payload; and be sure to set header Content-Type: application/json.)
