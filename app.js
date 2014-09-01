var express = require('express'),
  config = require('./config/config');

var app = express();

require('./config/express')(app, config);

var server = app.listen(config.port);

require('./config/ws')(server);

