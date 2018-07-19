'use strict';

var multer = require('multer');
var path = require('path');
var CONFIG = require('../../config/config.json');
var logger = require('log4js').getLogger('app');
var async = require('async');
var fs = require('fs-extra');
require("date-utils");

var dt = new Date();

var storage = multer.diskStorage({
    destination : function (req, file, callback) {      
        async.waterfall([function () {
            var uploadDir = path.join(__dirname, "../../../../"+CONFIG.fileUpload.directory);
            uploadDir = path.join(uploadDir, dt.toFormat('YYYYMMDD'));
            
            fs.ensureDir(uploadDir)
            .then(() => {
                callback(null, uploadDir);
            })
            .catch(err => {
                fs.mkdir(uploadDir);
                callback(null, uploadDir);
            });

        }], function (err, uploadDir) {
            if (err) {
            }
            callback(null, uploadDir);
        });
    },
    filename : function (req, file, callback) {
        var fnm = file.originalname.split('.');   
        callback(null, 'incid-' + Date.now() + '.'+ fnm[fnm.length - 1] );
    }
});

//var upload = multer({ storage: storage });
var upload = multer({ storage: storage }).single('file');
module.exports = upload;
