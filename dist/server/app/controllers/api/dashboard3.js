'use strict';

var async = require('async');
var Incident = require('../../models/Incident');
var MyProcess = require('../../models/MyProcess');
var User = require('../../models/User');
var service = require('../../services/dashboard3');
var alimi = require('../../util/alimi');
var CONFIG = require('../../../config/config.json');
var moment = require('moment');
var logger = require('log4js').getLogger('app');
var path = require('path');

module.exports = {


    /**
     * 차트3
     * 년도별 요청자/담당자 수 조회
     * 상위업무 중 요청건수 가장 많은 것 상위 5개 만족도 현황 가져오기
     */
    chart3: (req, res, next) => {
        try {
            
            //console.log("==================================================");
            //console.log("Dashboard chart3 : ");
            //console.log("==================================================");

            var svc = service.chart3(req);

            Incident.aggregate(svc.aggregatorOpts)
                .exec(function (err, chartData) {

                    if (!err) {

                        //console.log("=================================");
                        //console.log("chart3 : " , JSON.stringify(chartData));
                        //console.log("=================================");

                        res.json(chartData);
                        
                    }
                })
                
        } catch (err) {
            logger.error("chart3 error : ", err);

            return res.json({
                success: false,
                message: err
            });
        }
    },


    /**
     * 
     */
    chart3_1: (req, res, next) => {
        try {
            
            //console.log("==================================================");
            //console.log("Dashboard chart3 : ");
            //console.log("==================================================");

            var svc = service.chart3_1(req);

            Incident.aggregate(svc.aggregatorOpts)
                .exec(function (err, chartData) {

                    if (!err) {

                        //console.log("=================================");
                        //console.log("chart3 : " , JSON.stringify(chartData));
                        //console.log("=================================");

                        res.json(chartData);
                        
                    }
                })
                
        } catch (err) {
            logger.error("chart3_1 error : ", err);

            return res.json({
                success: false,
                message: err
            });
        }
    },


    /**
     * 
     */
    chart3_2: (req, res, next) => {
        try {
            
            //console.log("==================================================");
            //console.log("Dashboard chart3 : ");
            //console.log("==================================================");

            var svc = service.chart3_2(req);

            Incident.aggregate(svc.aggregatorOpts)
                .exec(function (err, chartData) {

                    if (!err) {

                        //console.log("=================================");
                        //console.log("chart3 : " , JSON.stringify(chartData));
                        //console.log("=================================");

                        res.json(chartData);
                        
                    }
                })
                
        } catch (err) {
            logger.error("chart3_2 error : ", err);

            return res.json({
                success: false,
                message: err
            });
        }
    },

}
