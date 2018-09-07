'use strict';

var async = require('async');
var HigherProcess = require('../../models/HigherProcess');
var LowerProcess = require('../../models/LowerProcess');
var CompanyProcess = require('../../models/CompanyProcess');
var logger = require('log4js').getLogger('app');

module.exports = {

    /**
     * 회사 업무 체계 조회
     */
    companyProcessTree: (req, res, next) => {

        try {

            async.waterfall([function (callback) {
                
                var condition = {};
                condition.company_cd = req.query.company_cd;

                CompanyProcess.find(condition, function (err, companyProcess) { 
                    if (!err) {
                        callback(null, companyProcess);
                    }
                });
            
            }], function (err, companyProcess) {

                var condition = {};
                condition.user_flag = { $ne: '0' };

                HigherProcess.find(condition, function (err, HigherProcess) {

                    if (!err) {
                        var rtnArr = [];
                        HigherProcess.forEach( hp => {
                            var higher = {};
                            higher.text = hp.higher_nm;
                            var val = {};
                
                            val.company_cd = req.query.company_cd;
                            val.higher_nm = hp.higher_nm;
                            val.higher_cd = hp.higher_cd;
                            higher.value = val;
                            higher.checked = false;
                            companyProcess.forEach(cp => {
                                if (hp.higher_cd == cp.higher_cd) {
                                    //체크 처리
                                    higher.checked = true;
                                } 
                            });
                            
                            rtnArr.push(higher);
                       });
                       res.json(rtnArr);
                    }
                }).sort('sort_lvl');
            });
        } catch (err) {
            logger.error("common control companyProcess error : ", err);
            return res.json({
            success: false,
            message: err
            });

        } finally {

        }
    },

    /**
     * 나의 업무 수정
     */
    update: (req, res, next) => {
        try{

            var condition = {}; //조건
            condition.company_cd    = req.body.company_cd; //회사코드
            CompanyProcess.deleteMany(condition, function( err, writeOpResult ){

                if (!err){
                    if(req.body.companyProcess.length > 0){
                        var newCompanyProcessModel = req.body.companyProcess;
                        CompanyProcess.create(newCompanyProcessModel, function (err, writeOpResult) {
                            if (err) {
                                res.json({
                                    success: false,
                                    message: err
                                }); 
                            } else {
                                res.json({
                                    success: true,
                                    message: "저장되었습니다."
                                }); 
                            }
                        });
                    }else{
                        res.json({
                            success: true,
                            message: "저장되었습니다."
                        }); 
                    }
                }
            });
        }catch(e){
            logger.log("companyProcess controllers update : ", e);
        }finally{}
    },

}
