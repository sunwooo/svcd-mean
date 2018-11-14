'use strict';

var async = require('async');
var Incident = require('../../models/Incident');
var MyProcess = require('../../models/MyProcess');
var User = require('../../models/User');
var service = require('../../services/dashboard2');
var alimi = require('../../util/alimi');
var CONFIG = require('../../../config/config.json');
var moment = require('moment');
var logger = require('log4js').getLogger('app');
var path = require('path');

module.exports = {

  /**
   * 차트2
   * 상위별 통계 데이타 조회
   * 상위업무 중 요청건수 가장 많은 것 상위 5개 만족도 현황 가져오기
   */
  chart2: (req, res, next) => {
    try {

      //logger.debug("==================================================");
      //logger.debug(" Dashboard chart2 : ");
      //logger.debug("==================================================");


      var svc = service.higher_valuation(req);

      Incident.aggregate(svc.aggregatorOpts)
        .exec(function (err, incident) {

          if (err) {

            //logger.debug("==================================================");
            //logger.debug(" Dashboard.aggregate error ", err);
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
                data.valAvg = (data.valuationSum / totalCnt).toFixed(2);
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

            res.json(incident);

            //logger.debug("incident AAA : ", JSON.stringify(incident));
          }
        })

    } catch (err) {
      logger.error("chart2 error : ", err);

      return res.json({
        success: false,
        message: err
      });
    }
  },

  /**
   * 차트2_1
   * 업무별 통계 데이타 조회
   * 상위업무별 만족도 현황 가져오기
   */
  chart2_1: (req, res, next) => {
    try {

      //logger.debug("==================================================");
      //logger.debug(" Dashboard chart2_1: ");
      //logger.debug("==================================================");


      var svc = service.task_valuation(req);

      Incident.aggregate(svc.aggregatorOpts)
        .exec(function (err, incident) {

          if (err) {

            //logger.debug("==================================================");
            //logger.debug(" Dashboard.aggregate error ", err);
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
                data.valAvg = (data.valuationSum / totalCnt).toFixed(2);
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

            res.json(incident);

            //logger.debug("incident BBB : ", JSON.stringify(incident));
          }
        })


    } catch (err) {
      logger.error("chart2_1 error : ", err);

      return res.json({
        success: false,
        message: err
      });
    }
  },

  /**
   * 차트2_2
   * 회사별 통계 데이타 조회
   * 회사별 만족도 현황 가져오기 (상위10)
   */
  chart2_2: (req, res, next) => {
    try {

      //logger.debug("==================================================");
      //logger.debug(" Dashboard chart2_2: ");
      //logger.debug("==================================================");


      var svc = service.com_valuation1(req);

      Incident.aggregate(svc.aggregatorOpts)
        .exec(function (err, incident) {

          if (err) {

            //logger.debug("==================================================");
            //logger.debug(" Dashboard.aggregate error ", err);
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
                data.valAvg = (data.valuationSum / totalCnt).toFixed(2);
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

            res.json(incident);

            //logger.debug("incident CCC : ", JSON.stringify(incident));
          }
        })


    } catch (err) {
      logger.error("chart2_2 error : ", err);

      return res.json({
        success: false,
        message: err
      });
    }
  },

  /**
   * 차트2_3
   * 회사별 통계 데이타 조회
   * 회사별 만족도 현황 가져오기 (하위10)
   */
  chart2_3: (req, res, next) => {
    try {

      //logger.debug("==================================================");
      //logger.debug(" Dashboard chart2_3: ");
      //logger.debug("==================================================");


      var svc = service.com_valuation2(req);

      Incident.aggregate(svc.aggregatorOpts)
        .exec(function (err, incident) {

          if (err) {

            //logger.debug("==================================================");
            //logger.debug(" Dashboard.aggregate error ", err);
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
                data.valAvg = (data.valuationSum / totalCnt).toFixed(2);
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

            res.json(incident);

            //logger.debug("incident DDD : ", JSON.stringify(incident));
          }
        })


    } catch (err) {
      logger.error("chart2_2 error : ", err);

      return res.json({
        success: false,
        message: err
      });
    }
  },


    /**
     * 차트2_4
     * 조건별 만족도 조회
     */
    chart2_4: (req, res, next) => {
        try {

            //logger.debug("==================================================");
            //logger.debug(" Dashboard chart2_4: ");
            //logger.debug("==================================================");

            var svc = service.valuationCnt(req);

            Incident.aggregate(svc.aggregatorOpts).exec(function (err, incident) {
                if (!err) {

                    //logger.debug("==================================================");
                    //logger.debug(" incident chart2_4: ",JSON.stringify(incident));
                    //logger.debug("==================================================");

                    res.json(incident);
                }
            });

        } catch (err) {
            logger.error("chart2_4 error : ", err);

            return res.json({
                success: false,
                message: err
            });
        }
    },

}
