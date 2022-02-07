# WVTest PDF generator

This Heroku microservice generates PDFs using Puppeteer, for use in the WVTest app.
Initially this was to be an AWS Lambda, but I found setup & config surprisingly complex.


## Dev setup

- Clone the repository
- `cd` into the project folder
- `npm install`
- `node app.js` to start the dev server
- `curl http://localhost:3000/ping` to test that the server is responsive.
- To test rendering a PDF, use wvtest's `test_puppeteer.exs` script. Or craft your own curl POST request with the html body, header, and footer specified in the JSON payload. (Be sure to also set Content-Type: application/json.)


## Production

TODO
