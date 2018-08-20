'use strict';

var async = require('async');

var Company = require('../../models/Company');
var Incident = require('../../models/Incident');
var User = require('../../models/User');
var OftenQna = require('../../models/OftenQna');
var service = require('../../services/oftenqna');
var CONFIG = require('../../../config/config.json');
var logger = require('log4js').getLogger('app');
var moment = require('moment');

module.exports = {
 
    list: (req, res, next) => {
        var search = service.createSearch(req);

        var page = 1;
        var perPage = 15;

        console.log("==========================================getcompany=======================================");
        console.log("req.query.page : ", req.query.page);
        console.log("req.query.perPage : ", req.query.perPage);
        console.log("req.query.searchText : ", req.query.searchText);
        console.log("================================================================================================");

        if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
        if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);


        async.waterfall([function (callback) {
            OftenQna.find(search.findOftenqna, function (err, oftenqna) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        callback(null);
                    }
                })
                //.sort("-" + search.order_by);
                /*
                .sort({
                    group_flag: -1,
                    company_nm: 1
                })
                .skip((page - 1) * perPage)
                .limit(perPage);
                */

        },
        function (callback) {
            OftenQna.count(search.findOftenqna, function (err, totalCnt) {
                if (err) {
                    logger.error("oftenqna : ", err);

                    return res.json({
                        success: false,
                        message: err
                    });
                } else {

                    //logger.debug("=============================================");
                    //logger.debug("oftenqna : ", totalCnt);
                    //logger.debug("=============================================");

                    callback(null, totalCnt)
                }
            });
        }
        ], function (err, totalCnt) {

            OftenQna.find(search.findOftenqna, function (err, oftenqna) {
                if (err) {

                    //logger.debug("=============================================");
                    //logger.debug("incident : ", err);
                    //logger.debug("=============================================");

                    return res.json({
                        success: false,
                        message: err
                    });
                } else {

                    //incident에 페이징 처리를 위한 전체 갯수전달
                    var rtnData = {};
                    rtnData.oftenqna = oftenqna;
                    rtnData.totalCnt = totalCnt;

                    //logger.debug("=============================================");
                    //logger.debug("rtnData.totalCnt : ", rtnData.totalCnt);
                    //console.log("rtnData : ", JSON.stringify(rtnData));
                    //logger.debug("=============================================");

                    res.json(rtnData);

                }
            })
                //.sort({
                //    group_flag: -1,
                //    company_nm: 1
                //})
                .skip((page - 1) * perPage)
                .limit(perPage);
        });
    
    },

    update: (req, res, next) => {
        //console.log("update=====");
        OftenQna.findOneAndUpdate({
            _id: req.body.oftenqna.id
        }, req.body.oftenqna, function (err, oftenqna) {
            if (err) {
                return res.json({
                    success: false,
                    message: err
                });
            } else {
                return res.json({
                    success: true,
                    message: "update successed"
                });
            }
        });
    },
}

