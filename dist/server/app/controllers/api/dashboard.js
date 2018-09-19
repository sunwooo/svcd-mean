'use strict';

var async = require('async');
var Incident = require('../../models/Incident');
var MyProcess = require('../../models/MyProcess');
var User = require('../../models/User');
var service = require('../../services/incident');
var alimi = require('../../util/alimi');
var CONFIG = require('../../../config/config.json');
var moment = require('moment');
var logger = require('log4js').getLogger('app');
var path = require('path');

module.exports = {

/**
 * 차트3 데이타 조회
 */
chart3: (req, res, next) => {
    try {
        async.waterfall([function (callback) {


        }], function (err, upIncident) {

            return res.json({
                success: true,
                message: "수정되었습니다."
            });
        });
    } catch (err) {
        logger.error("incident control update error : ", err);
        return res.json({
            success: false,
            message: err
        });
    }
},



}
