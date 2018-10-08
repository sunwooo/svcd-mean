'use strict';

var async = require('async');
var Incident = require('../../models/Incident');
var MyProcess = require('../../models/MyProcess');
var service = require('../../services/dashboard1')
var alimi = require('../../util/alimi');
var CONFIG = require('../../../config/config.json');
var moment = require('moment');
var logger = require('log4js').getLogger('app');
var path = require('path');


module.exports = {

  /**
   * 월별 문의 건수
   */
  chart1: (req, res, next) => {

    try {
      async.waterfall([function (callback) {

        var today = new Date();
        var thisYear = today.getFullYear();
        var preYear = thisYear - 4;
        var condition = {};

        if (req.session.user_flag == 3 || req.session.user_flag == 4) {

          //나의업무지정 상위업무 처리 위한 조건
          var condition2 = {};
          condition2.email = req.session.email;
          MyProcess.find(condition2).distinct('higher_cd').exec(function (err, myHigherProcess) {

            if (condition.$and == null) {
              condition.$and = [{
                "higher_cd": {
                  "$in": myHigherProcess
                }
              }];
            } else {
              condition.$and.push({
                "higher_cd": {
                  "$in": myHigherProcess
                }
              });
            }

            if (condition.$and == null) {
              condition.$and = [{
                register_yyyy: {
                  $gte: preYear.toString(),
                  $lte: thisYear.toString()
                }
              }];
            } else {
              condition.$and.push({
                register_yyyy: {
                  $gte: preYear.toString(),
                  $lte: thisYear.toString()
                }
              });
            }
            callback(null, condition);
          });

        } else {
          if (req.session.user_flag == 1) { //전체관리자
            //} else if (req.session.user_flag == 3) {  //업무관리
            //    condition.manager_dept_cd = req.session.dept_cd;
          } else if (req.session.user_flag == 5) { //고객사관리자
            condition.request_company_cd = req.session.company_cd;
          } else if (req.session.user_flag == 9) { //일반사용자
            condition.request_id = req.session.email;
          }

          if (condition.$and == null) {
            condition.$and = [{
              register_yyyy: {
                $gte: preYear.toString(),
                $lte: thisYear.toString()
              }
            }];
          } else {
            condition.$and.push({
              register_yyyy: {
                $gte: preYear.toString(),
                $lte: thisYear.toString()
              }
            });
          }
          callback(null, condition);
        }

      }], function (err, condition) {
        if (!err) {
          var aggregatorOpts = [{
              $match: condition
            }, {
              $group: { //그룹
                _id: {
                  register_yyyy: "$register_yyyy",
                  register_mm: "$register_mm"
                },
                count: {
                  $sum: 1
                }
              }
            },
            {
              $group: { //그룹
                _id: "$_id.register_yyyy",
                name: {
                  $first: "$_id.register_yyyy"
                },
                series: {
                  $push: {
                    name: "$_id.register_mm",
                    value: "$count"
                  }
                }
              }
            },
            {
              $project: {
                "name": 1,
                "series": 1
              }
            },
            {
              $sort: {
                "name": -1,
              }
            },
          ];

          Incident.aggregate(aggregatorOpts).exec(function (err, incident) {
            if (!err) {
              res.json(incident);
            }
          });
        }
      });
    } catch (e) {} finally {}
  },

  chart1_1: (req, res, next) => {

    try {
      var svc = service.requestCompany_count(req);

      //console.log("chart1_1 svc : ", JSON.stringify(svc));

      Incident.aggregate(svc.aggregatorOpts)
        .exec(function (err, incident) {

          if (err) {

            //console.log("==================================================");
            //console.log(" Dashboard.aggregate error ", err);
            //console.log("==================================================");

            return res.json({
              success: false,
              message: err
            });

          } else {

            res.json(incident);

            //console.log("incident : ", JSON.stringify(incident));

          }
        });

    } catch (err) {
      return res.json({
        success: false,
        message: err
      });
    }
  },

  /**
   * 상위업무별 문의 건수
   */
  chart1_2: (req, res, next) => {

    try {
      var svc = service.company_reqcnt(req);

      Incident.aggregate(svc.aggregatorOpts).exec(function (err, incident) {

        if (err) {
          return res.json({
            success: false,
            message: err
          });
        } else {
          res.json(incident);
        }
      });

    } catch (e) {
      return res.json({
        success: false,
        message: e
      });
    }
  },

  /**
   * 상위업무별 문의 건수
   */
  chart1_3: (req, res, next) => {

    try {
      var svc = service.process_cnt(req);

      /*

      Incident.aggregate(svc.aggregatorOpts).exec(function (err, incident) {

        if (err) {
          return res.json({
            success: false,
            message: err
          });
        } else {
          res.json(incident);
        }
      });
      */

    } catch (e) {
      return res.json({
        success: false,
        message: e
      });
    }
  },

   /**
   * 진행상태 건수
   */
  chart1_4: (req, res, next) => {

    try {
        var svc = service.chat1_4(req);
  
        Incident.aggregate(svc.aggregatorOpts).exec(function (err, incident) {
  
          if (!err) {

            //console.log("==================================================");
            //console.log(" incident chart2_4: ",JSON.stringify(incident));
            //console.log("==================================================");

            res.json(incident);
          }
        });
  
      } catch (e) {
        return res.json({
          success: false,
          message: e
        });
      }
  },


};
