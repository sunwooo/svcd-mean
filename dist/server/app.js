'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var session = require('express-session');
var flash = require('connect-flash');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var compression = require('compression');
var log4js = require('log4js');
var mongoose = require('mongoose');
var cors = require('cors');
var logger = log4js.getLogger('app');
var routes = require('./app/routes');

var CONFIG = require('./config/config.json');

var app = express();
app.locals.pretty = true;
app.set('case sensitive routes', true);
require('./config/mongoose');



//var nodemailer = require('nodemailer');
//var smtpPool = require('nodemailer-smtp-pool');

/**
 * runtime environment
 */
//app.settings.env = 'development';
app.settings.env = 'production';

/**
 * replace this with the log4js connect-logger
 * app.use(logger('dev'));
 */
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
app.use(flash());
app.use(cookieParser());
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended: true}));
//app.use(session({secret: CONFIG.cryptoKey, resave: false, saveUninitialized: true}));
app.use(session({secret: CONFIG.cryptoKey, resave: false, saveUninitialized: true, cookie:{maxAge:3600000}}));
//app.use(cors({origin:[process.env.angularUrl],
//app.use(cors({origin:CONFIG.corsOrigin,credentials:true}));   

//app.use(function (req, res, next) {
//    res.setHeader('Access-Control-Allow-Origin', '*');
//    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
//    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,content-type, Accept');
//    res.setHeader('Access-Control-Allow-Credentials', true);
//    next();
//  });

app.use(methodOverride('_method'));

/**
 * Compression config: https://www.npmjs.com/package/compression
 */
app.use(compression());


/**
 * static resources
 */
app.use(favicon(path.join(__dirname, 'app/public/favicon.ico')));
app.use(require('serve-static')(path.join(__dirname, 'app/public')));
app.use(require('serve-static')(path.join(__dirname, 'upload-file')));
//console.log("===>",__dirname);
//app.use(require('serve-static')(path.join(__dirname, 'app/util')));

/**
 * view engine setup
 */
//app.set('views', path.join(__dirname, 'app/views'));
//app.set('utils', path.join(__dirname, 'app/util'));
//app.set('view engine', 'jade');

/**
 * http-to-https
 */
//var redirectToHTTPS = require('express-http-to-https')
//app.use(redirectToHTTPS(['localhost:3000'], ['/test']));

/**
 * mailer
 */
//app.use(nodemailer);
//app.use(smtpPool);

/**
 * routes
 */
//routes.default(app);
//app.use(routes);
app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/api', routes);

/**
 * database
 */
require('./config/mongoose');

module.exports = app;

/**
 * listen up
 */
/*
app.listen(CONFIG.port, function(){
  //and... we're live
  //console.log('Server is running on port ' + CONFIG.port);
  logger.debug('Server is running on port ' + CONFIG.port);
});
*/
