'use strict';

var async = require('async');

var Company = require('../../models/Company');
var Incident = require('../../models/Incident');
var LowerProcess = require('../../models/LowerProcess');
var User = require('../../models/User');
var service = require('../../services/lowerProcess');
var CONFIG = require('../../../config/config.json');
var logger = require('log4js').getLogger('app');
var moment = require('moment');

module.exports = {
 
    /**
     * 하위업무 가져오기
     */
    list: (req, res, next) => {

        var search = service.createSearch(req);

        var page = 1;
        var perPage = 15;

        console.log("==========================================getLowerProcess=======================================");
        console.log("req.query.page : ", req.query.page);
        console.log("req.query.perPage : ", req.query.perPage);
        console.log("req.query.searchText : ", req.query.searchText);
        console.log("================================================================================================");

        if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
        if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);


        async.waterfall([function (callback) {
            LowerProcess.find(search.findLowerProcess, function (err, lowerProcess) {
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
            LowerProcess.count(search.findLowerProcess, function (err, totalCnt) {
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
            LowerProcess.find(search.findLowerProcess, function (err, lowerProcess) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    //higherProcess에 페이징 처리를 위한 전체 갯수전달
                    var rtnData = {};
                    rtnData.lowerProcess = lowerProcess;
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
     * 하위업무 수정
    */
    update: (req, res, next) => {
        //console.log("update=====");
        LowerProcess.findOneAndUpdate({
            _id: req.body.lowerProcess.id
        }, req.body.lowerProcess, function (err, lowerProcess) {
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
    * 하위업무 삭제 
    */
    delete: (req, res, next) => {
        try {
            async.waterfall([function (callback) {

            var upLower = {};
            var m = moment();
            var date = m.format("YYYY-MM-DD HH:mm:ss");

            upLower.deleted_at = date;
            upLower.delete_flag = 'Y';

            callback(null, upLower);

            //console.log("upQna : ", upQna);

        }], function (err, upLower) {
                LowerProcess.findOneAndRemove({
                _id: req.body._id
                }, upLower, function (err, lowerProcess) {
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
            logger.error("upLower deleted err : ", err);
            return res.json({
                success: false,
                message: err
            });
        }
    },

    /**
    * 하위업무 등록
    */
    insert: (req, res) => {

        try{
            async.waterfall([function (callback) {

            var newlower = req.body.lowerProcess;
            
            newlower.register_company_cd = req.session.company_cd;
            newlower.register_company_nm = req.session.company_nm;
            newlower.register_nm = req.session.user_nm;
            newlower.register_id = req.session.email;

            LowerProcess.create(newlower, function (err, savedlower) {
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