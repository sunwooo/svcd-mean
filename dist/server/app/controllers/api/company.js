'use strict';

var async = require('async');

var Company = require('../../models/Company');
var Incident = require('../../models/Incident');
var User = require('../../models/User');
var service = require('../../services/company');
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
            Company.find(search.findCompany, function (err, company) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        /*
                        logger.debug("==========================================getcompany=======================================");
                        logger.debug("company : ", company);
                        logger.debug("================================================================================================");
                        */

                        //callback(null, company);
                        callback(null);
                    }
                })
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
            Company.count(search.findCompany, function (err, totalCnt) {
                if (err) {
                    logger.error("incident : ", err);

                    return res.json({
                        success: false,
                        message: err
                    });
                } else {

                    //logger.debug("=============================================");
                    //logger.debug("incidentCnt : ", totalCnt);
                    //logger.debug("=============================================");

                    callback(null, totalCnt)
                }
            });
        }
        ], function (err, totalCnt) {

            Company.find(search.findCompany, function (err, company) {
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
                    rtnData.company = company;
                    rtnData.totalCnt = totalCnt;

                    //logger.debug("=============================================");
                    //logger.debug("rtnData.totalCnt : ", rtnData.totalCnt);
                    //console.log("rtnData : ", JSON.stringify(rtnData));
                    //logger.debug("=============================================");

                    res.json(rtnData);

                }
            })
                .sort({
                    group_flag: -1,
                    company_nm: 1
                })
                .skip((page - 1) * perPage)
                .limit(perPage);
        });
    
    },

    /**
     * 회사정보 수정
    */
    update: (req, res, next) => {
        try{
            
            req.body.company.date_from = req.body.company.date_from.substring(0,10);
            req.body.company.date_to = req.body.company.date_to.substring(0,10);

            async.waterfall([function (callback) {
                Company.findOneAndUpdate({
                    _id: req.body.company.id
                }, req.body.company, function (err, company) {

                    console.log("===============================================================================");
                    console.log("company update.....req.body.company ",  req.body.company);
                    console.log("company update.....req.body.company.date_from ",  req.body.company.date_from);
                    console.log("===============================================================================");
                    
                    if (!err) {
                        callback(null);
                    }
                });
            }, function (callback){
                var condition = {};
                var setQuery = {};
                var option = {};
                condition.request_company_cd = req.body.company.company_cd;
                setQuery.$set = { "request_company_nm" : req.body.company.company_nm };
                option.multi = true;
                //incident 회사명 수정
                Incident.update(condition, setQuery, option, function(err, tasks){                        
                    if(!err){
                        callback(null);
                    }
                });
            }], function(){
                var condition = {};
                var setQuery = {};
                var option = {};
                condition.company_cd = req.body.company.company_cd;
                setQuery.$set = { "company_nm" : req.body.company.company_nm };
                option.multi = true;
                //사용자 회사명 수정
                User.update(condition, setQuery, option, function(err, tasks){                        
                    if(!err){
                        return res.json({
                            success: true,
                            message: "update successed"
                        });
                    }
                });
            });
        }catch(e){

            logger.error("=================================");
            logger.error("company update error : ",e);
            logger.error("=================================");

        }finally{}
    }
}

