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

    //logger.debug("comHigher ======================================================");
    //logger.debug("req : ", req);
    //logger.debug("req.query : ", req.query);
    //logger.debug("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.params : ", req.params);
    //logger.debug("req.body : ", req.body);
    //logger.debug("xxxxxxxxxxxxxxxxxxxxxxxxxxx  svc.aggregatorOpts : ", JSON.stringify(svc.aggregatorOpts));
    //logger.debug("==================================================================");

    //console.log("comHigher ============================================================================");
    //console.log("req : ", req);
    //console.log("req.query : ", req.query);
    //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.params : ", req.params);
    //console.log("req.body : ", req.body);
    //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  svc.aggregatorOpts : ", JSON.stringify(svc.aggregatorOpts));
    //console.log("======================================================================================");

    Incident.aggregate(svc.aggregatorOpts).exec(function (err, incident) {

        if (err) {

            //logger.debug("==================================================");
            //logger.debug(" Incident.aggregate error ", err);
            //logger.debug("==================================================");
  
            return res.json({
              success: false,
              message: err
            });
  
          } else {
  
              //logger.debug("==================================================");
              //logger.debug("incident ", JSON.stringify(incident));
              //logger.debug("==================================================");
  
              incident.forEach(function (data, idx, incident) {
  
                  //logger.debug("==================================================");
                  //logger.debug("data ", JSON.stringify(data));
                  //logger.debug("data.higher.length ", data.higher);
                  //logger.debug("==================================================");
  
                  var companyTotCnt = 0; //회사 전체 개수
                  var companyTotStCnt1 = 0; //회사 신청중 개수
                  var companyTotStCnt2 = 0; //회사 처리중 개수
                  var companyTotStCnt3 = 0; //회사 미평가
                  var companyTotStCnt4 = 0; //회사 완료
                  var companyTotStCnt5 = 0; //회사 협의필요  개수
                  var companyTotStCnt3_4 = 0; //회사 미평가+완료 개수
                  var companyTotValSum = 0; //회사 평가 총점
                  var companyTotAvg = 0; //회사 평균
                  
                  for(var x = 0; x < data.higher.length; x++) {
                      
                      var higher = {};
  
                      var totalCnt = 0; //전체 개수
                      var stCnt1 = 0; //신청중 개수
                      var stCnt2 = 0; //처리중 개수
                      var stCnt3 = 0; //미평가
                      var stCnt4 = 0; //완료
                      var stCnt5 = 0; //협의필요  개수
                      var stCnt3_4 = 0; //미평가+완료 개수
  
                      for (var i = 0; i < data.higher[x].status.length; i++) {
  
                          //전체 개수
                          totalCnt = totalCnt + data.higher[x].status[i].count;
  
                          //신청중 개수
                          if (data.higher[x].status[i].status_cd == '1') {
                              stCnt1 = stCnt1 + data.higher[x].status[i].count;
                          }
  
                          //처리중 개수
                          if (data.higher[x].status[i].status_cd == '2') {
                              stCnt2 = stCnt2 + data.higher[x].status[i].count;
                          }
  
                          //미평가 개수
                          if (data.higher[x].status[i].status_cd == '3') {
                              stCnt3 = stCnt3 + data.higher[x].status[i].count;
                          }
  
                          //완료 개수
                          if (data.higher[x].status[i].status_cd == '4') {
                              stCnt4 = stCnt4 + data.higher[x].status[i].count;
                          }
  
                          //협의필요 
                          if (data.higher[x].status[i].status_cd == '5') {
                              stCnt5 = stCnt5 + data.higher[x].status[i].count;
                          }
  
                          //완료 또는 미평가
                          if (data.higher[x].status[i].status_cd == '3' || data.higher[x].status[i].status_cd == '4') {
                              stCnt3_4 = stCnt3_4 + data.higher[x].status[i].count;
                          }
  
                      }
  
                      higher.higher_nm = data.higher[x].higher_nm;
                      higher.totalCnt = totalCnt;
                      higher.stCnt1 = stCnt1;
                      higher.stCnt2 = stCnt2;
                      higher.stCnt3 = stCnt3;
                      higher.stCnt4 = stCnt4;
                      higher.stCnt5 = stCnt5;
                      higher.stCnt3_4 = stCnt3_4;
                      higher.solRatio = ((stCnt3_4 * 100) / totalCnt).toFixed(2);
                      higher.valuationSum = data.higher[x].valuationSum;
                      //평점
                      if (data.higher[x].valuationSum > 0) {
                          higher.valAvg = (data.higher[x].valuationSum / stCnt4).toFixed(2);
                      } else {
                          higher.valAvg = 0;
                      }
              
                      data.higher[x] = higher;
  
                      companyTotCnt = companyTotCnt + higher.totalCnt; //회사 전체 개수
                      companyTotStCnt1 = companyTotStCnt1 + higher.stCnt1; //회사 신청중 개수
                      companyTotStCnt2 = companyTotStCnt2 + higher.stCnt2; //회사 처리중 개수
                      companyTotStCnt3 = companyTotStCnt3 + higher.stCnt3; //회사 미평가
                      companyTotStCnt4 = companyTotStCnt4 + higher.stCnt4; //회사 완료
                      companyTotStCnt5 = companyTotStCnt5 + higher.stCnt5; //회사 협의필요  개수
                      companyTotStCnt3_4 = companyTotStCnt3_4 + higher.stCnt3_4; //회사 미평가+완료 개수
                      companyTotValSum = companyTotValSum + higher.valuationSum; //회사 평가총점
      
                      if (companyTotValSum > 0) { //회사 평균
                          companyTotAvg = (companyTotValSum / companyTotStCnt4).toFixed(2);
                      } else {
                          companyTotAvg = 0;
                      }
  
                  }
  
                  data.companyTotCnt = companyTotCnt;
                  data.companyTotStCnt1 = companyTotStCnt1;
                  data.companyTotStCnt2 = companyTotStCnt2;
                  data.companyTotStCnt3 = companyTotStCnt3;
                  data.companyTotStCnt4 = companyTotStCnt4;
                  data.companyTotStCnt5 = companyTotStCnt5;
                  data.companyTotStCnt3_4 = companyTotStCnt3_4;
                  data.companyTotValSum = companyTotValSum;
                  data.companyTotRatio = ((companyTotStCnt3_4 * 100) / companyTotCnt).toFixed(2);
                  data.companyTotAvg = companyTotAvg;
                  
  
              });
  
              //logger.debug("==================================================");
              //logger.debug("incident ", JSON.stringify(incident));
              //logger.debug("==================================================");
  
              res.json(incident);
        }
      });

  },

  /**
   * 상위업무별 하위업무 통계
   */
  higherLower: (req, res, next) => {

    var svc = service.higher_lower(req);

    //logger.debug("higher_lower ======================================================");
    //logger.debug("req : ", req);
    //logger.debug("req.query : ", req.query);
    //logger.debug("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.params : ", req.params);
    //logger.debug("req.body : ", req.body);
    //logger.debug("xxxxxxxxxxxxxxxxxxxxxxxxxxx  svc.aggregatorOpts : ", JSON.stringify(svc.aggregatorOpts));
    //logger.debug("==================================================================");

    Incident.aggregate(svc.aggregatorOpts).exec(function (err, incident) {

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
                //logger.debug("data.higher.length ", data.higher);
                //logger.debug("==================================================");

                var higherTotCnt = 0; //상위업무 전체 개수
                var higherTotStCnt1 = 0; //상위업무 신청중 개수
                var higherTotStCnt2 = 0; //상위업무 처리중 개수
                var higherTotStCnt3 = 0; //상위업무 미평가
                var higherTotStCnt4 = 0; //상위업무 완료
                var higherTotStCnt5 = 0; //상위업무 협의필요  개수
                var higherTotStCnt3_4 = 0; //상위업무 미평가+완료 개수
                var higherTotValSum = 0; //상위업무 평가 총점
                var higherTotAvg = 0; //상위업무 평균
                
                for(var x = 0; x < data.higher.length; x++) {
                    
                    var higher = {};

                    var totalCnt = 0; //전체 개수
                    var stCnt1 = 0; //신청중 개수
                    var stCnt2 = 0; //처리중 개수
                    var stCnt3 = 0; //미평가
                    var stCnt4 = 0; //완료
                    var stCnt5 = 0; //협의필요  개수
                    var stCnt3_4 = 0; //미평가+완료 개수

                    for (var i = 0; i < data.higher[x].status.length; i++) {

                        //전체 개수
                        totalCnt = totalCnt + data.higher[x].status[i].count;

                        //신청중 개수
                        if (data.higher[x].status[i].status_cd == '1') {
                            stCnt1 = stCnt1 + data.higher[x].status[i].count;
                        }

                        //처리중 개수
                        if (data.higher[x].status[i].status_cd == '2') {
                            stCnt2 = stCnt2 + data.higher[x].status[i].count;
                        }

                        //미평가 개수
                        if (data.higher[x].status[i].status_cd == '3') {
                            stCnt3 = stCnt3 + data.higher[x].status[i].count;
                        }

                        //완료 개수
                        if (data.higher[x].status[i].status_cd == '4') {
                            stCnt4 = stCnt4 + data.higher[x].status[i].count;
                        }

                        //협의필요 
                        if (data.higher[x].status[i].status_cd == '5') {
                            stCnt5 = stCnt5 + data.higher[x].status[i].count;
                        }

                        //완료 또는 미평가
                        if (data.higher[x].status[i].status_cd == '3' || data.higher[x].status[i].status_cd == '4') {
                            stCnt3_4 = stCnt3_4 + data.higher[x].status[i].count;
                        }

                    }

                    higher.lower_nm = data.higher[x].lower_nm;
                    higher.totalCnt = totalCnt;
                    higher.stCnt1 = stCnt1;
                    higher.stCnt2 = stCnt2;
                    higher.stCnt3 = stCnt3;
                    higher.stCnt4 = stCnt4;
                    higher.stCnt5 = stCnt5;
                    higher.stCnt3_4 = stCnt3_4;
                    higher.solRatio = ((stCnt3_4 * 100) / totalCnt).toFixed(2);
                    higher.valuationSum = data.higher[x].valuationSum;
                    //평점
                    if (data.higher[x].valuationSum > 0) {
                        higher.valAvg = (data.higher[x].valuationSum / stCnt4).toFixed(2);
                    } else {
                        higher.valAvg = 0;
                    }
            
                    data.higher[x] = higher;

                    higherTotCnt = higherTotCnt + higher.totalCnt; //상위업무 전체 개수
                    higherTotStCnt1 = higherTotStCnt1 + higher.stCnt1; //상위업무 신청중 개수
                    higherTotStCnt2 = higherTotStCnt2 + higher.stCnt2; //상위업무 처리중 개수
                    higherTotStCnt3 = higherTotStCnt3 + higher.stCnt3; //상위업무 미평가
                    higherTotStCnt4 = higherTotStCnt4 + higher.stCnt4; //상위업무 완료
                    higherTotStCnt5 = higherTotStCnt5 + higher.stCnt5; //상위업무 협의필요  개수
                    higherTotStCnt3_4 = higherTotStCnt3_4 + higher.stCnt3_4; //상위업무 미평가+완료 개수
                    higherTotValSum = higherTotValSum + higher.valuationSum; //상위업무 평가총점
    
                    if (higherTotValSum > 0) { //상위업무 평균
                        higherTotAvg = (higherTotValSum / higherTotStCnt4).toFixed(2);
                    } else {
                        higherTotAvg = 0;
                    }

                }

                data.higherTotCnt = higherTotCnt;
                data.higherTotStCnt1 = higherTotStCnt1;
                data.higherTotStCnt2 = higherTotStCnt2;
                data.higherTotStCnt3 = higherTotStCnt3;
                data.higherTotStCnt4 = higherTotStCnt4;
                data.higherTotStCnt5 = higherTotStCnt5;
                data.higherTotStCnt3_4 = higherTotStCnt3_4;
                data.higherTotValSum = higherTotValSum;
                data.higherTotRatio = ((higherTotStCnt3_4 * 100) / higherTotCnt).toFixed(2);
                data.higherTotAvg = higherTotAvg;
                

            });

            //logger.debug("==================================================");
            //logger.debug("incident ", JSON.stringify(incident));
            //logger.debug("==================================================");

            res.json(incident);
      }
    });
  },

  /**
   * 회사별 상하위업무별 통계
   */
  comHigherLower: (req, res, next) => {

    var svc = service.com_higher_lower(req);

    //logger.debug("higher_lower ======================================================");
    //logger.debug("req : ", req);
    //logger.debug("req.query : ", req.query);
    //logger.debug("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.params : ", req.params);
    //logger.debug("req.body : ", req.body);
    //logger.debug("xxxxxxxxxxxxxxxxxxxxxxxxxxx  svc.aggregatorOpts : ", JSON.stringify(svc.aggregatorOpts));
    //logger.debug("==================================================================");

    Incident.aggregate(svc.aggregatorOpts).exec(function (err, incident) {

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
                //logger.debug("data.higher.length ", data.higher);
                //logger.debug("==================================================");

                var higherTotCnt = 0; //상위업무 전체 개수
                var higherTotStCnt1 = 0; //상위업무 신청중 개수
                var higherTotStCnt2 = 0; //상위업무 처리중 개수
                var higherTotStCnt3 = 0; //상위업무 미평가
                var higherTotStCnt4 = 0; //상위업무 완료
                var higherTotStCnt5 = 0; //상위업무 협의필요  개수
                var higherTotStCnt3_4 = 0; //상위업무 미평가+완료 개수
                var higherTotValSum = 0; //상위업무 평가 총점
                var higherTotAvg = 0; //상위업무 평균
                
                for(var x = 0; x < data.higher.length; x++) {
                    
                    var higher = {};

                    var totalCnt = 0; //전체 개수
                    var stCnt1 = 0; //신청중 개수
                    var stCnt2 = 0; //처리중 개수
                    var stCnt3 = 0; //미평가
                    var stCnt4 = 0; //완료
                    var stCnt5 = 0; //협의필요  개수
                    var stCnt3_4 = 0; //미평가+완료 개수

                    for (var i = 0; i < data.higher[x].status.length; i++) {

                        //전체 개수
                        totalCnt = totalCnt + data.higher[x].status[i].count;

                        //신청중 개수
                        if (data.higher[x].status[i].status_cd == '1') {
                            stCnt1 = stCnt1 + data.higher[x].status[i].count;
                        }

                        //처리중 개수
                        if (data.higher[x].status[i].status_cd == '2') {
                            stCnt2 = stCnt2 + data.higher[x].status[i].count;
                        }

                        //미평가 개수
                        if (data.higher[x].status[i].status_cd == '3') {
                            stCnt3 = stCnt3 + data.higher[x].status[i].count;
                        }

                        //완료 개수
                        if (data.higher[x].status[i].status_cd == '4') {
                            stCnt4 = stCnt4 + data.higher[x].status[i].count;
                        }

                        //협의필요 
                        if (data.higher[x].status[i].status_cd == '5') {
                            stCnt5 = stCnt5 + data.higher[x].status[i].count;
                        }

                        //완료 또는 미평가
                        if (data.higher[x].status[i].status_cd == '3' || data.higher[x].status[i].status_cd == '4') {
                            stCnt3_4 = stCnt3_4 + data.higher[x].status[i].count;
                        }

                    }

                    higher.lower_nm = data.higher[x].lower_nm;
                    higher.totalCnt = totalCnt;
                    higher.stCnt1 = stCnt1;
                    higher.stCnt2 = stCnt2;
                    higher.stCnt3 = stCnt3;
                    higher.stCnt4 = stCnt4;
                    higher.stCnt5 = stCnt5;
                    higher.stCnt3_4 = stCnt3_4;
                    higher.solRatio = ((stCnt3_4 * 100) / totalCnt).toFixed(2);
                    higher.valuationSum = data.higher[x].valuationSum;
                    //평점
                    if (data.higher[x].valuationSum > 0) {
                        higher.valAvg = (data.higher[x].valuationSum / stCnt4).toFixed(2);
                    } else {
                        higher.valAvg = 0;
                    }
            
                    data.higher[x] = higher;

                    higherTotCnt = higherTotCnt + higher.totalCnt; //상위업무 전체 개수
                    higherTotStCnt1 = higherTotStCnt1 + higher.stCnt1; //상위업무 신청중 개수
                    higherTotStCnt2 = higherTotStCnt2 + higher.stCnt2; //상위업무 처리중 개수
                    higherTotStCnt3 = higherTotStCnt3 + higher.stCnt3; //상위업무 미평가
                    higherTotStCnt4 = higherTotStCnt4 + higher.stCnt4; //상위업무 완료
                    higherTotStCnt5 = higherTotStCnt5 + higher.stCnt5; //상위업무 협의필요  개수
                    higherTotStCnt3_4 = higherTotStCnt3_4 + higher.stCnt3_4; //상위업무 미평가+완료 개수
                    higherTotValSum = higherTotValSum + higher.valuationSum; //상위업무 평가총점
    
                    if (higherTotValSum > 0) { //상위업무 평균
                        higherTotAvg = (higherTotValSum / higherTotStCnt4).toFixed(2);
                    } else {
                        higherTotAvg = 0;
                    }

                }

                data.higherTotCnt = higherTotCnt;
                data.higherTotStCnt1 = higherTotStCnt1;
                data.higherTotStCnt2 = higherTotStCnt2;
                data.higherTotStCnt3 = higherTotStCnt3;
                data.higherTotStCnt4 = higherTotStCnt4;
                data.higherTotStCnt5 = higherTotStCnt5;
                data.higherTotStCnt3_4 = higherTotStCnt3_4;
                data.higherTotValSum = higherTotValSum;
                data.higherTotRatio = ((higherTotStCnt3_4 * 100) / higherTotCnt).toFixed(2);
                data.higherTotAvg = higherTotAvg;
                

            });

            //logger.debug("==================================================");
            //logger.debug("incident ", JSON.stringify(incident));
            //logger.debug("==================================================");

            res.json(incident);
      }
    });
  },

  /**
   * 부서별 업무 통계
   */
  higherLowerDept: (req, res, next) => {

    var svc = service.higher_lower_dept(req);

    console.log("higher_lower_dept ====================================================================");
    console.log("req : ", req);
    console.log("req.query : ", req.query);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.params : ", req.params);
    console.log("req.body : ", req.body);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  svc.aggregatorOpts : ", JSON.stringify(svc.aggregatorOpts));
    console.log("======================================================================================");

    Incident.aggregate(svc.aggregatorOpts).exec(function (err, incident) {

        if (err) {

          //logger.debug("==================================================");
          //logger.debug(" Incident.aggregate error ", err);
          //logger.debug("==================================================");

          return res.json({
            success: false,
            message: err
          });

        } else {

            //logger.debug("==================================================");
            //logger.debug("incident ", JSON.stringify(incident));
            //logger.debug("==================================================");

            incident.forEach(function (data, idx, incident) {

                //logger.debug("==================================================");
                //logger.debug("data ", JSON.stringify(data));
                //logger.debug("data.higher.length ", data.higher);
                //logger.debug("==================================================");

                var deptTotCnt = 0; //부서 전체 개수
                var deptTotStCnt1 = 0; //부서 신청중 개수
                var deptTotStCnt2 = 0; //부서 처리중 개수
                var deptTotStCnt3 = 0; //부서 미평가
                var deptTotStCnt4 = 0; //부서 완료
                var deptTotStCnt5 = 0; //부서 협의필요  개수
                var deptTotStCnt3_4 = 0; //부서 미평가+완료 개수
                var deptTotValSum = 0; //부서 평가 총점
                var deptTotAvg = 0; //부서 평균
                
                for(var x = 0; x < data.higher.length; x++) {
                    
                    var higher = {};

                    var totalCnt = 0; //전체 개수
                    var stCnt1 = 0; //신청중 개수
                    var stCnt2 = 0; //처리중 개수
                    var stCnt3 = 0; //미평가
                    var stCnt4 = 0; //완료
                    var stCnt5 = 0; //협의필요  개수
                    var stCnt3_4 = 0; //미평가+완료 개수


                    for (var i = 0; i < data.higher[x].status.length; i++) {

                        //전체 개수
                        totalCnt = totalCnt + data.higher[x].status[i].count;

                        //신청중 개수
                        if (data.higher[x].status[i].status_cd == '1') {
                            stCnt1 = stCnt1 + data.higher[x].status[i].count;
                        }

                        //처리중 개수
                        if (data.higher[x].status[i].status_cd == '2') {
                            stCnt2 = stCnt2 + data.higher[x].status[i].count;
                        }

                        //미평가 개수
                        if (data.higher[x].status[i].status_cd == '3') {
                            stCnt3 = stCnt3 + data.higher[x].status[i].count;
                        }

                        //완료 개수
                        if (data.higher[x].status[i].status_cd == '4') {
                            stCnt4 = stCnt4 + data.higher[x].status[i].count;
                        }

                        //협의필요 
                        if (data.higher[x].status[i].status_cd == '5') {
                            stCnt5 = stCnt5 + data.higher[x].status[i].count;
                        }

                        //완료 또는 미평가
                        if (data.higher[x].status[i].status_cd == '3' || data.higher[x].status[i].status_cd == '4') {
                            stCnt3_4 = stCnt3_4 + data.higher[x].status[i].count;
                        }

                    }

                    higher.higher_nm = data.higher[x].higher_nm;
                    higher.totalCnt = totalCnt;
                    higher.stCnt1 = stCnt1;
                    higher.stCnt2 = stCnt2;
                    higher.stCnt3 = stCnt3;
                    higher.stCnt4 = stCnt4;
                    higher.stCnt5 = stCnt5;
                    higher.stCnt3_4 = stCnt3_4;
                    higher.solRatio = ((stCnt3_4 * 100) / totalCnt).toFixed(2);
                    higher.valuationSum = data.higher[x].valuationSum;
                    //평점
                    if (data.higher[x].valuationSum > 0) {
                        higher.valAvg = (data.higher[x].valuationSum / stCnt4).toFixed(2);
                    } else {
                        higher.valAvg = 0;
                    }
            
                    data.higher[x] = higher;

                    deptTotCnt = deptTotCnt + higher.totalCnt; //부서 전체 개수
                    deptTotStCnt1 = deptTotStCnt1 + higher.stCnt1; //부서 신청중 개수
                    deptTotStCnt2 = deptTotStCnt2 + higher.stCnt2; //부서 처리중 개수
                    deptTotStCnt3 = deptTotStCnt3 + higher.stCnt3; //부서 미평가
                    deptTotStCnt4 = deptTotStCnt4 + higher.stCnt4; //부서 완료
                    deptTotStCnt5 = deptTotStCnt5 + higher.stCnt5; //부서 협의필요  개수
                    deptTotStCnt3_4 = deptTotStCnt3_4 + higher.stCnt3_4; //부서 미평가+완료 개수
                    deptTotValSum = deptTotValSum + higher.valuationSum; //부서 평가총점
    
                    if (deptTotValSum > 0) { //부서 평균
                        deptTotAvg = (deptTotValSum / deptTotStCnt4).toFixed(2);
                    } else {
                        deptTotAvg = 0;
                    }

                }

                data.deptTotCnt = deptTotCnt;
                data.deptTotStCnt1 = deptTotStCnt1;
                data.deptTotStCnt2 = deptTotStCnt2;
                data.deptTotStCnt3 = deptTotStCnt3;
                data.deptTotStCnt4 = deptTotStCnt4;
                data.deptTotStCnt5 = deptTotStCnt5;
                data.deptTotStCnt3_4 = deptTotStCnt3_4;
                data.deptTotValSum = deptTotValSum;
                data.deptTotRatio = ((deptTotStCnt3_4 * 100) / deptTotCnt).toFixed(2);
                data.deptTotAvg = deptTotAvg;
                

            });

            //logger.debug("==================================================");
            //logger.debug("incident ", JSON.stringify(incident));
            //logger.debug("==================================================");

            res.json(incident);
        }
        });

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


            //psw - 삭제된 incident 건수는 표기하지 않음 - 2020.02.14 "delete_flag":{"$ne":"Y"}
            if (condition.$and == null) {
              condition.$and = [{
                "delete_flag": {"$ne":"Y"}
              }];
            } else {
              condition.$and.push({
                "delete_flag": {"$ne":"Y"}
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

          //psw - 삭제된 incident 건수는 표기하지 않음 - 2020.02.14 "delete_flag":{"$ne":"Y"}
            if (condition.$and == null) {
              condition.$and = [{
                "delete_flag": {"$ne":"Y"}
              }];
            } else {
              condition.$and.push({
                "delete_flag": {"$ne":"Y"}
              });
            }

          callback(condition);
        }

      }], function (condition) {

        //logger.debug("========================================================");
        //logger.debug("=====================statusCdCnt condition : ", JSON.stringify(condition));
        //logger.debug("========================================================");

        console.log("========================================================================");
        console.log("=====================statusCdCnt condition : ", JSON.stringify(condition));
        console.log("========================================================================");

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

    console.log("higherCdCnt=======>");

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
                higher_cd: "$higher_nm"
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
        console.log("aggregatorOpts : "+ JSON.stringify(aggregatorOpts));

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