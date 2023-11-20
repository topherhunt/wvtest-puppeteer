# WVTest PDF generator

This Heroku microservice generates PDFs using Puppeteer, for use in the WVTest app.
Previously I tried setting up an AWS Lambda to render PDFs, but the dependencies and devops are surprisingly complex to set up.


## Dev setup

- Clone the repository
- `cd` into the project folder
- `npm install`
- `node app.js` to start the dev server
- `curl http://localhost:3000/ping` to test that the server is responsive.
- To test rendering a PDF, use wvtest's `test_puppeteer.exs` script. Or craft your own curl POST request with the html body, header, and footer specified in the JSON payload. (Be sure to also set Content-Type: application/json.)


## Deployment

  * Deployed on Scalingo at https://wvtest-puppeteer.osc-fr1.scalingo.io. Relies on `.buildpacks` and `Aptfile` to install correctly.
  * To deploy changes: `git push scalingo master`.
