'use strict';

var mongoose = require('mongoose');
var async = require('async');
var Incident = require('../../models/Incident');
var HigherProcess = require('../../models/HigherProcess');
var LowerProcess = require('../../models/LowerProcess');
var ProcessStatus = require('../../models/ProcessStatus');
var ProcessGubun = require('../../models/ProcessGubun');
var Company = require('../../models/Company');
var MyProcess = require('../../models/MyProcess');
var CompanyProcess = require('../../models/CompanyProcess');
var logger = require('log4js').getLogger('app');

module.exports = {

  /**
   * 상위업무 조회
   */
  higherProcess: (req, res, next) => {

    //console.log("=====================");
    //console.log("req.query : ", req.query);
    //console.log("=====================");

    var scope = req.query.scope;

    try {
      var condition = {};

      if (scope == "*") {

        condition.user_flag = {
          $ne: '0'
        };

        HigherProcess.find(condition, function (err, higherProcess) {
          if (err) {
            return res.json(null);
          } else {
            res.json(higherProcess);
          }
        }).sort('sort_lvl');

      } else if (scope == "user") {

        condition.company_cd = req.session.company_cd; //회사코드
        condition.email = req.session.email; //이메일

        var aggregatorOpts = [{
          $match: condition
        }, {
          $group: { //그룹
            _id: {
              higher_cd: "$higher_cd",
              higher_nm: "$higher_nm"
            }
          }
        }];

        MyProcess.aggregate(aggregatorOpts).exec(function (err, myProcess) {
          if (err) {
            res.json({
              success: false,
              message: err
            });
          } else {

            var rtnArr = [];
            myProcess.forEach((mp) => {
              var tmp = {};
              tmp.higher_nm = mp._id.higher_nm;
              tmp.higher_cd = mp._id.higher_cd;
              rtnArr.push(tmp);
            });

            res.json(rtnArr);
          }
        });


      } else if (scope == "company") {

        if (req.query.company_cd != null) {
          condition.company_cd = req.query.company_cd;
        }

        var aggregatorOpts = [{
          $match: condition
        }, {
          $group: { //그룹
            _id: {
              higher_cd: "$higher_cd",
              higher_nm: "$higher_nm"
            }
          }
        }];

        CompanyProcess.aggregate(aggregatorOpts).exec(function (err, myProcess) {
          if (err) {
            res.json({
              success: false,
              message: err
            });
          } else {

            var rtnArr = [];
            myProcess.forEach((mp) => {
              var tmp = {};
              tmp.higher_nm = mp._id.higher_nm;
              tmp.higher_cd = mp._id.higher_cd;
              rtnArr.push(tmp);
            });

            res.json(rtnArr);
          }
        });

      }
    } catch (err) {
      logger.error("common control myProcess error : ", err);
      return res.json({
        success: false,
        message: err
      });
    } finally {}
  },


  /**
   * 하위업무조회
   */
  lowerProcess: (req, res, next) => {
    try {
      var condition = {};

      if (req.query.higher_cd != null && req.query.higher_cd != '') {
        condition.higher_cd = req.query.higher_cd;
      }

      async.waterfall([function (callback) {
        //상위코드용 업무처리 개수 조회
        LowerProcess.count(condition, function (err, count) {
          if (err) return res.json({
            success: false,
            message: err
          });
          callback(null, count);
        });
      }], function (err, count) {
        //var higher_cd = req.query.higher_cd;
        //if (count == 0) higher_cd = '000'; //상위코드용 업무처리가 없으면 공통으로 조회

        condition.user_flag = {
          $ne: '0'
        };

        LowerProcess.find(condition, function (err, lowerprocess) {
          if (err) {
            return res.json({
              success: false,
              message: err
            });
          } else {
            res.json(lowerprocess);
          }
        }).sort('lower_nm');
      });
    } catch (err) {
      logger.error("common control lowerProcess error : ", err);
      return res.json({
        success: false,
        message: err
      });
    }
  },


  /**
   * 본인 업무조회
   */
  myProcess: (req, res, next) => {
    try {
      var condition = {};

      condition.email = req.session.email;

      MyProcess.find(condition).sort('higher_cd').sort('lower_nm').exec(function (err, lowerprocess) {
        if (!err) {
          res.json(lowerprocess);
        }
      });

    } catch (err) {
      logger.error("common control myProcess error : ", err);
      return res.json({
        success: false,
        message: err
      });
    }
  },




  /**
   * 회사조회
   */
  companyList: (req, res, next) => {
    try {

      var condition = {};

      if (req.session.user_flag == "5") {
        condition.company_cd = req.session.company_cd;
      }

      Company.find(condition, function (err, companyJsonData) {
          if (err) {
            return res.json({
              success: false,
              message: err
            });
          } else {
            res.json(companyJsonData);
          };

        })
        .sort({
          group_flag: -1,
          company_nm: 1
        });

    } catch (e) {
      logger.error("common control companyList error : ", e);
    } finally {}
  },


  /**
   * 진행상태 조회
   */
  processStatus: (req, res, next) => {

    //console.log("=====================");
    //console.log("condition : ", condition);
    //console.log("=====================");

    try {
      var condition = {};

      ProcessStatus.find(condition, function (err, processStatus) {
        if (err) {
          return res.json(null);
        } else {
          res.json(processStatus);
        }
      }).sort('sort_lvl');
    } catch (e) {
      console.log(e);
    } finally {}
  },


  /**
   * 처리구분 조회
   */
  processGubun: (req, res, next) => {

    try {
      async.waterfall([function (callback) {
        //상위코드용 업무처리 개수 조회
        ProcessGubun.count({
          "higher_cd": req.query.higher_cd,
          "use_yn": "사용"
        }, function (err, count) {
          if (err) return res.json({
            success: false,
            message: err
          });
          callback(null, count)
        });
      }], function (err, count) {
        var higher_cd = req.query.higher_cd;
        if (count == 0) higher_cd = '000'; //상위코드용 업무처리가 없으면 공통으로 조회
        ProcessGubun.find({
          "higher_cd": higher_cd,
          "use_yn": "사용"
        }, function (err, processGubun) {
          if (err) {
            return res.json({
              success: false,
              message: err
            });
          } else {
            res.json(processGubun);
          }
        }).sort('-process_nm');
      });
    } catch (err) {
      logger.error("common control processGubun error : ", err);
      return res.json({
        success: false,
        message: err
      });
    }
  },

  /**
   * 문의요청 등록된 년도 조회
   */
  registerYyyy: (req, res, next) => {
    try {
      Incident.find({}).distinct('register_yyyy', function (err, registerYyyy) {
        if (err) {
          return res.json({
            success: false,
            message: err
          });
        } else {
          res.json(registerYyyy.sort().reverse());
        }
      });
    } catch (err) {} finally {}
  },

  /**
   * 대시보드 팝업 리스트 조회
   */
  DashboardList: (req, res, next) => {

    //조건 처리
    var condition = {};
    if (req.query.company_cd != null && req.query.company_cd != '*') {
      condition.request_company_cd = req.query.company_cd;
    }
    if (req.query.yyyy != null) {
      condition.register_yyyy = req.query.yyyy;
    }
    if (req.query.mm != null && req.query.mm != '*') {
      condition.register_mm = req.query.mm;
    }
    if (req.query.higher_cd != null && req.query.higher_cd != '*') {
      condition.higher_cd = req.query.higher_cd;
    }

    //console.log("=================================================");
    //console.log("req.query.page : ", req.query);
    //console.log("req.query.page : ", req.query.page);
    //console.log("search : ", JSON.stringify(search));
    //console.log("=================================================");

    var page = 1;
    var perPage = 15;

    if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
    if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);

    try {
      async.waterfall([function (callback) {


          //console.log("================================================================");
          //console.log("===================> search.findIncident : ", search.findIncident);
          //console.log("================================================================");

          Incident.count(condition, function (err, totalCnt) {
            if (err) {
              logger.error("incident : ", err);

              return res.json({
                success: false,
                message: err
              });
            } else {
              callback(null, totalCnt);
            }
          });
        }
      ], function (err, totalCnt) {

        //console.log("=================================================");
        //console.log("search.findIncident : ",JSON.stringify(search.findIncident));
        //console.log("=================================================");

        Incident.find(condition, function (err, incident) {

            //console.log("=================================================");
            //console.log("totalCnt : ",totalCnt);
            //console.log("(page - 1) * perPage : ",(page - 1) * perPage);
            //console.log("perPage : ",perPage);
            //console.log("incident : ",incident);
            //console.log("=================================================");

            if (err) {
              return res.json({
                success: false,
                message: err
              });
            } else {

              //incident에 페이징 처리를 위한 전체 갯수전달
              var rtnData = {};
              rtnData.incident = incident;
              rtnData.totalCnt = totalCnt;
              res.json(rtnData);

            }
          })
          .sort('-register_date')
          .skip((page - 1) * perPage)
          .limit(perPage);
      });
    } catch (err) {
      console.log("err : ", err);
    } finally {}

  },
};
