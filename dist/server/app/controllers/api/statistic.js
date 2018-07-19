'use strict';

var async = require('async');
var Incident = require('../../models/Incident');
var service = require('../../services/statistic');
var CONFIG = require('../../../config/config.json');
var logger = require('log4js').getLogger('app');

module.exports = {

  /**
   * 회사별 상위업무 통계
   */
  comHigher: (req, res, next) => {

    var svc = service.com_higher(req);

    console.log("putValuation ======================================================");
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.query : ", req.query);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.params : ", req.params);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.body : ", req.body);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  svc.aggregatorOpts : ", JSON.stringify(svc.aggregatorOpts));
    console.log("==================================================================");

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

            //logger.debug("==================================================");
            //logger.debug("data.totalCnt : ", data.totalCnt);
            //logger.debug("data.stCnt1 : ", data.stCnt1);
            //logger.debug("data.stCnt2 : ", data.stCnt2);
            //logger.debug("data.stCnt3 : ", data.stCnt3);
            //logger.debug("data.stCnt4 : ", data.stCnt4);
            //logger.debug("data.solRatio : ", data.solRatio);
            //logger.debug("data.valuationSum : ", data.valuationSum);
            //logger.debug("data.valAvg : ", data.valAvg);
            //logger.debug("==================================================");

          });
          //logger.debug("=====>>>>" + JSON.stringify(incident));
          res.json(incident);
        }
      })

  },

  statusCdCnt: (req, res, next) => {
    try {
      async.waterfall([function (callback) {


        var today = new Date();
        var thisYear = today.getFullYear();

        console.log("==================================================");
        console.log("req.session.user_flag : ", req.session.user_flag);
        console.log("==================================================");

        var condition = {};
        var OrQueries = [];
        var AndQueries = [];

        if (req.session.user_flag == 3 || req.session.user_flag == 4) {

          //나의업무지정 상위업무 처리 위한 조건
          var condition2 = {};
          condition2.email = req.session.email;
          MyProcess.find(condition2).distinct('higher_cd').exec(function (err, myHigherProcess) {

            //logger.debug("==================================================");
            //logger.debug("myHigherProcess : ", myHigherProcess);
            //logger.debug("==================================================");
            if (condition.$and == null) {

              condition.$and = [{
                "higher_cd": {
                  "$in": myHigherProcess
                }
              }];

              //logger.debug("=============================================");
              //logger.debug("condition.$and is null : ", JSON.stringify(condition));
              //logger.debug("=============================================");

            } else {

              condition.$and.push({
                "higher_cd": {
                  "$in": myHigherProcess
                }
              });

              //logger.debug("=============================================");
              //logger.debug("condition.$and is not null : ", JSON.stringify(condition));
              //logger.debug("=============================================");
            }

            if (condition.$and == null) {

              condition.$and = [{
                "status_cd": {
                  "$in": ["1", "2", "3", "4"]
                }
              }];

              //logger.debug("=============================================");
              //logger.debug("condition.$and is null : ", JSON.stringify(condition));
              //logger.debug("=============================================");

            } else {

              condition.$and.push({
                "status_cd": {
                  "$in": ["1", "2", "3", "4"]
                }
              });

              //logger.debug("=============================================");
              //logger.debug("condition.$and is not null : ", JSON.stringify(condition));
              //logger.debug("=============================================");

            }


            if (condition.$and == null) {

              condition.$and = [{
                "register_yyyy": thisYear.toString()
              }];
              //logger.debug("=============================================");
              //logger.debug("condition.$and is null : ", JSON.stringify(condition));
              //logger.debug("=============================================");

            } else {

              condition.$and.push({
                "register_yyyy": thisYear.toString()
              });

              //logger.debug("=============================================");
              //logger.debug("condition.$and is not null : ", JSON.stringify(condition));
              //logger.debug("=============================================");

            }

            //condition.register_date = { $gte: startDate, $lte: endDate } //30일 기간으로 수정
            //condition.register_yyyy = thisYear.toString();

            //logger.debug("=============================================");
            //logger.debug("thisYear : ", thisYear.toString());
            //logger.debug("=============================================");

            //logger.debug("=============================================");
            //logger.debug("condition : ", condition);
            //logger.debug("JSON.stringify(condition) : ", JSON.stringify(condition));
            //logger.debug("=============================================");

            callback(condition);

          });

        } else {

          if (req.session.user_flag == 1) { //전체관리자

          } else if (req.session.user_flag == 5) { //고객사관리자

            //logger.debug("==================================================");
            //logger.debug("req.session.user_flag : ", req.session.user_flag);
            //logger.debug("==================================================");

            condition.request_company_cd = req.session.company_cd;

            //logger.debug("==================================================");
            //logger.debug("condition.request_company_cd : ", condition.request_company_cd);
            //logger.debug("==================================================");

          } else if (req.session.user_flag == 9) { //일반사용자

            //logger.debug("==================================================");
            //logger.debug("req.session.user_flag : ", req.session.user_flag);
            //logger.debug("==================================================");

            condition.request_id = req.session.email;

            //logger.debug("==================================================");
            //logger.debug("condition.request_id : ", condition.request_id);
            //logger.debug("==================================================");

          }

          if (condition.$and == null) {

            condition.$and = [{
              "status_cd": {
                "$in": ["1", "2", "3", "4"]
              }
            }];

            //logger.debug("=============================================");
            //logger.debug("condition.$and is null : ", JSON.stringify(condition));
            //logger.debug("=============================================");

          } else {

            condition.$and.push({
              "status_cd": {
                "$in": ["1", "2", "3", "4"]
              }
            });

            //logger.debug("=============================================");
            //logger.debug("condition.$and is not null : ", JSON.stringify(condition));
            //logger.debug("=============================================");

          }


          if (condition.$and == null) {

            condition.$and = [{
              "register_yyyy": thisYear.toString()
            }];
            //logger.debug("=============================================");
            //logger.debug("condition.$and is null : ", JSON.stringify(condition));
            //logger.debug("=============================================");

          } else {

            condition.$and.push({
              "register_yyyy": thisYear.toString()
            });

            //logger.debug("=============================================");
            //logger.debug("condition.$and is not null : ", JSON.stringify(condition));
            //logger.debug("=============================================");

          }

          //condition.register_date = { $gte: startDate, $lte: endDate } //30일 기간으로 수정
          //condition.register_yyyy = thisYear.toString();

          //logger.debug("=============================================");
          //logger.debug("thisYear : ", thisYear.toString());
          //logger.debug("=============================================");

          //var cdt = {"$and":[{"status_cd":{"$in":["1","2","3","4"]}},{"register_yyyy":"2018"},{"higher_cd":{"$in":["H001"]}}]};
          //var cdt = {"$and":[{"status_cd":{"$in":["1","2","3","4"]}},{"register_yyyy":"2018"},{"higher_cd":{"$in":["H001"]}}]};
          //var cdt = {"$and":[{"status_cd":{"$in":["1","2","3","4"]}},{"register_yyyy":"2018"},{"higher_cd":{"$in":["H001"]}}]};

          //logger.debug("=============================================");
          //logger.debug("cdt : ", cdt);
          //logger.debug("JSON.stringify(cdt) : ", JSON.stringify(cdt));
          //logger.debug("condition : ", condition);
          //logger.debug("JSON.stringify(condition) : ", JSON.stringify(condition));
          //logger.debug("=============================================");

          callback(condition);
        }

      }], function (condition) {

        //logger.debug("=============================================");
        //logger.debug("condition 1111: ", condition);
        //logger.debug("JSON.stringify(condition) 1111 : ", JSON.stringify(condition));
        //logger.debug("=============================================");


        var aggregatorOpts = [{
            $match: condition
          }, {
            $group: { //그룹칼럼
              _id: {
                //register_yyyy: "$register_yyyy",
                status_cd: "$status_cd"
                //higher_cd: "$higher_cd"
                //status_cd: { $ifNull: [ '$status_cd', [{ count: 0 }] ] }
              },
              count: {
                $sum: 1
                //$sum : { $ifNull: [ $sum, 0 ] }
                //$sum :{ $ifNull: [ "$count", 1] }
              }

            }
          }

          //, {
          //    total: { 
          //        $sum: "$count"
          //    } 
          //}

          , {
            $sort: {
              status_cd: -1
            }
          }
        ]

        Incident.aggregate(aggregatorOpts).exec(function (err, incident) {

          //Incident.count({status_cd: '4', manager_company_cd : "ISU_ST", manager_email : "14002"}, function (err, incident) {

          //logger.debug("==================================================");
          //logger.debug(" aggregatorOpts : ", JSON.stringify(aggregatorOpts));
          //logger.debug(" incident : ", JSON.stringify(incident));
          //logger.debug("==================================================");

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

}
