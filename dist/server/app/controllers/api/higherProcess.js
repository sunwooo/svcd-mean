'use strict';

var async = require('async');

var Company = require('../../models/Company');
var Incident = require('../../models/Incident');
var HigherProcess = require('../../models/HigherProcess');
var User = require('../../models/User');
var service = require('../../services/higherProcess');
var CONFIG = require('../../../config/config.json');
var logger = require('log4js').getLogger('app');
var moment = require('moment');

module.exports = {
 
    list: (req, res, next) => {

        var search = service.createSearch(req);

        var page = 1;
        var perPage = 15;

        //logger.debug("==========================================getHigherProcess=======================================");
        //logger.debug("req.query.page : ", req.query.page);
        //logger.debug("req.query.perPage : ", req.query.perPage);
        //logger.debug("req.query.searchText : ", req.query.searchText);
        //logger.debug("================================================================================================");

        if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
        if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);


        async.waterfall([function (callback) {
            HigherProcess.find(search.findHigherProcess, function (err, higherProcess) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        callback(null);
                    }
                })
        },
        function (callback) {
            HigherProcess.count(search.findHigherProcess, function (err, totalCnt) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    callback(null, totalCnt)
                }
            });
        }
        ], function (err, totalCnt) {
            HigherProcess.find(search.findHigherProcess, function (err, higherProcess) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    //higherProcess에 페이징 처리를 위한 전체 갯수전달
                    var rtnData = {};
                    rtnData.higherProcess = higherProcess;
                    rtnData.totalCnt = totalCnt;
                    rtnData.totalPage = Math.ceil(totalCnt/perPage);

                    res.json(rtnData);
                }
            })
                .sort({
                    higher_cd : 1
                })
                .skip((page - 1) * perPage)
                .limit(perPage);
        });
    },

    /**
     * 상위업무 수정
    */
    update: (req, res, next) => {
        //logger.debug("update=====");
        HigherProcess.findOneAndUpdate({
            _id: req.body.higherProcess.id
        }, req.body.higherProcess, function (err, higherProcess) {
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

    /**
    * 상위업무 삭제 
    */
    delete: (req, res, next) => {
        try {
            async.waterfall([function (callback) {

            var upHigher = {};
            var m = moment();
            var date = m.format("YYYY-MM-DD HH:mm:ss");

            upHigher.deleted_at = date;
            upHigher.delete_flag = 'Y';

            callback(null, upHigher);

            //logger.debug("upQna : ", upQna);

        }], function (err, upHigher) {
                HigherProcess.findOneAndRemove({
                _id: req.body._id
                }, upHigher, function (err, higherProcess) {
                if (err) {
                    return res.json({
                    success: false,
                    message: err
                    });
                } else {
                    return res.json({
                    success: true,
                    message: "delete successed"
                    });
                }
                });
            });

        } catch (err) {
            logger.error("upHigher deleted err : ", err);
            return res.json({
                success: false,
                message: err
            });
        }
    },

    /**
    * 상위업무 등록
    */
    insert: (req, res) => {

        try{
            async.waterfall([function (callback) {

            var newhigher = req.body.higherProcess;
            
            newhigher.register_company_cd = req.session.company_cd;
            newhigher.register_company_nm = req.session.company_nm;
            newhigher.register_nm = req.session.user_nm;
            newhigher.register_id = req.session.email;

            HigherProcess.create(newhigher, function (err, savedhigher) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                }
              
                callback(null);
                
                });
            }], function (err) {
            return res.json({
                    success: true,
                    message: err
                });
            });

        } catch (err) {
            return res.json({
                success: false,
                message: err
            });
        }
    },
}