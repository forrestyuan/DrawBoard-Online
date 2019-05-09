const path = require('path')
const express = require('express');
const app = express();
const routes = require('./server/router');
app.use(express.static('dist'));
app.use('/',routes);

// Serve the files on port 3000.
const port = process.env.port || 3001;
app.listen(port, function () {
  console.log('Example app listening on port 3000!\n');
});