'use strict';

var async = require('async');
var Incident = require('../../models/Incident');
var MyProcess = require('../../models/MyProcess');
var service = require('../../services/statistic');
var CONFIG = require('../../../config/config.json');
var logger = require('log4js').getLogger('app');

module.exports = {

  /**
   * 회사별 상위업무 통계
   */
  comHigher: (req, res, next) => {

    var svc = service.com_higher(req);

    //console.log("putValuation ======================================================");
    //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.query : ", req.query);
    //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.params : ", req.params);
    //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.body : ", req.body);
    //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  svc.aggregatorOpts : ", JSON.stringify(svc.aggregatorOpts));
    //console.log("==================================================================");

    Incident.aggregate(svc.aggregatorOpts)
      .exec(function (err, incident) {

        if (err) {

          //logger.debug("==================================================");
          //logger.debug(" Incident.aggregate error ", err);
          //logger.debug("==================================================");

          return res.json({
            success: false,
            message: err
          });

        } else {

          incident.forEach(function (data, idx, incident) {

            //logger.debug("==================================================");
            //logger.debug("data ", JSON.stringify(data));
            //logger.debug("data.grp.length ", data.grp.length);
            //logger.debug("==================================================");


            var totalCnt = 0; //전체 개수
            var stCnt1 = 0; //신청중 개수
            var stCnt2 = 0; //처리중 개수
            var stCnt3 = 0; //미평가
            var stCnt4 = 0; //완료
            var stCnt5 = 0; //협의필요  개수
            var stCnt3_4 = 0; //미평가+완료 개수


            for (var i = 0; i < data.grp.length; i++) {
              //전체 개수
              totalCnt = totalCnt + data.grp[i].count;

              //신청중 개수
              if (data.grp[i].status_cd == '1') {
                stCnt1 = stCnt1 + data.grp[i].count;
              }

              //처리중 개수
              if (data.grp[i].status_cd == '2') {
                stCnt2 = stCnt2 + data.grp[i].count;
              }

              //미평가 개수
              if (data.grp[i].status_cd == '3') {
                stCnt3 = stCnt3 + data.grp[i].count;
              }

              //완료 개수
              if (data.grp[i].status_cd == '4') {
                stCnt4 = stCnt4 + data.grp[i].count;
              }

              //협의필요 
              if (data.grp[i].status_cd == '5') {
                stCnt5 = stCnt5 + data.grp[i].count;
              }

              //완료 또는 미평가
              if (data.grp[i].status_cd == '3' || data.grp[i].status_cd == '4') {
                stCnt3_4 = stCnt3_4 + data.grp[i].count;
              }

            }

            data.totalCnt = totalCnt;
            data.stCnt1 = stCnt1;
            data.stCnt2 = stCnt2;
            data.stCnt3 = stCnt3;
            data.stCnt4 = stCnt4;
            data.stCnt5 = stCnt5;
            data.stCnt3_4 = stCnt3_4;
            data.solRatio = ((stCnt3_4 * 100) / totalCnt).toFixed(2);

            //평점
            if (data.valuationSum > 0) {
              data.valAvg = (data.valuationSum / stCnt4).toFixed(2);
            } else {
              data.valAvg = 0;
            }
          });
          res.json(incident);
        }
      })

  },

  /**
   * 진행상태별 건수
   */
  statusCdCnt: (req, res, next) => {
    try {
      async.waterfall([function (callback) {

        var today = new Date();
        var thisYear = today.getFullYear();

        var condition = {};
        var OrQueries = [];
        var AndQueries = [];

        if (req.session.user_flag == 3 || req.session.user_flag == 4) {

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
                "status_cd": {
                  "$in": ["1", "2", "3", "4"]
                }
              }];
            } else {
              condition.$and.push({
                "status_cd": {
                  "$in": ["1", "2", "3", "4"]
                }
              });
            }

            if (condition.$and == null) {
              condition.$and = [{
                "register_yyyy": thisYear.toString()
              }];
            } else {
              condition.$and.push({
                "register_yyyy": thisYear.toString()
              });
            }
            callback(condition);
          });

        } else {

          if (req.session.user_flag == 1) { //전체관리자

          } else if (req.session.user_flag == 5) { //고객사관리자
            condition.request_company_cd = req.session.company_cd;
          } else if (req.session.user_flag == 9) { //일반사용자
            condition.request_id = req.session.email;
          }

          if (condition.$and == null) {
            condition.$and = [{
              "status_cd": {
                "$in": ["1", "2", "3", "4"]
              }
            }];
          } else {
            condition.$and.push({
              "status_cd": {
                "$in": ["1", "2", "3", "4"]
              }
            });
          }

          if (condition.$and == null) {
            condition.$and = [{
              "register_yyyy": thisYear.toString()
            }];
          } else {
            condition.$and.push({
              "register_yyyy": thisYear.toString()
            });
          }
          callback(condition);
        }

      }], function (condition) {

        //console.log("========================================================");
        //console.log("=====================statusCdCnt condition : ", JSON.stringify(condition));
        //console.log("========================================================");

        var aggregatorOpts = [{
            $match: condition
          }, {
            $group: { //그룹칼럼
              _id: {
                status_cd: "$status_cd"
              },
              count: {
                $sum: 1
              }

            }
          },
          {
            $sort: {
              status_cd: -1
            }
          }
        ];

        Incident.aggregate(aggregatorOpts).exec(function (err, incident) {

          if (err) {
            return res.json({
              success: false,
              message: err
            });
          }

          res.json(incident);
        });

      });

    } catch (e) {

      logger.error("======================================");
      logger.error("cntload error : ", e);
      logger.error("======================================");

    } finally {}
  },

  /**
   * 월별 문의 건수
   */
  monthlyCnt: (req, res, next) => {

    try {
      async.waterfall([function (callback) {

        var today = new Date();
        var thisYear = today.getFullYear();
        var preYear = thisYear - 1;
        var condition = {};
        var OrQueries = [];
        var AndQueries = [];

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
        };

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

  /**
   * 만족도 현황
   */
  valuationCnt: (req, res, next) => {

    try {
      async.waterfall([function (callback) {

        var today = new Date();
        var thisYear = today.getFullYear();

        var condition = {};
        var OrQueries = [];
        var AndQueries = [];

        if (req.session.user_flag == 3 || req.session.user_flag == 4) {

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
                "status_cd": "4"
              }];
            } else {
              condition.$and.push({
                "status_cd": "4"
              });
            }

            if (condition.$and == null) {
              condition.$and = [{
                "register_yyyy": thisYear.toString()
              }];
            } else {
              condition.$and.push({
                "register_yyyy": thisYear.toString()
              });
            }
            callback(condition);
          });

        } else {

          if (req.session.user_flag == 1) { //전체관리자

          } else if (req.session.user_flag == 5) { //고객사관리자
            condition.request_company_cd = req.session.company_cd;
          } else if (req.session.user_flag == 9) { //일반사용자
            condition.request_id = req.session.email;
          }

          if (condition.$and == null) {
            condition.$and = [{
              "status_cd": "4"
            }];

          } else {
            condition.$and.push({
              "status_cd": "4"
            });
          }

          if (condition.$and == null) {
            condition.$and = [{
              "register_yyyy": thisYear.toString()
            }];
          } else {
            condition.$and.push({
              "register_yyyy": thisYear.toString()
            });
          }
          callback(condition);
        }

      }], function (condition) {
        var aggregatorOpts = [{
            $match: condition
          }, {
            $group: { //그룹칼럼
              _id: {
                valuation: "$valuation"
              },
              name: {
                $first: "$valuation"
              },
              value: {
                $sum: 1
              }
            }
          },
          {
            $project: {
              "value": 1,
              "valuation": "$_id.valuation",
              "name": {
                $switch: {
                  branches: [{
                      case: {
                        $eq: ["$name", 1]
                      },
                      then: "매우불만족"
                    },
                    {
                      case: {
                        $eq: ["$name", 2]
                      },
                      then: "불만족"
                    },
                    {
                      case: {
                        $eq: ["$name", 3]
                      },
                      then: "보통"
                    },
                    {
                      case: {
                        $eq: ["$name", 4]
                      },
                      then: "만족"
                    },
                    {
                      case: {
                        $eq: ["$name", 5]
                      },
                      then: "매우만족"
                    },
                    {
                      case: {
                        $eq: ["$name", null]
                      },
                      then: "기타"
                    }
                  ],
                  default: "기타"
                }
              }
            }
          },
          {
            $sort: {
              valuation: -1
            }
          }
        ];

        Incident.aggregate(aggregatorOpts).exec(function (err, incident) {

          if (err) {
            return res.json({
              success: false,
              message: err
            });
          }
          res.json(incident);
        });

      });

    } catch (e) {} finally {}
  },


  /**
   * 상위업무별 문의 건수
   */
  higherCdCnt: (req, res, next) => {

    try {
      async.waterfall([function (callback) {

        var today = new Date();
        var thisYear = today.getFullYear();

        var condition = {};
        var OrQueries = [];
        var AndQueries = [];


        if (condition.$and == null) {
          condition.$and = [{
            "register_yyyy": thisYear.toString()
          }];
        } else {
          condition.$and.push({
            "register_yyyy": thisYear.toString()
          });
        }
        callback(condition);

      }], function (condition) {
        var aggregatorOpts = [{
            $match: condition
          }, {
            $group: { //그룹칼럼
              _id: {
                higher_nm: "$higher_nm"
              },
              name: {
                $first: "$higher_nm"
              },
              value: {
                $sum: 1
              }
            }
          },
          {
            $sort: {
              value: 1
            }
          }
        ];


        Incident.aggregate(aggregatorOpts).exec(function (err, incident) {

          if (err) {
            return res.json({
              success: false,
              message: err
            });
          }
          res.json(incident);
        });

      });

    } catch (e) {} finally {}
  },
}