'use strict';

var async = require('async');
var Incident = require('../../models/Incident');
var MyProcess = require('../../models/MyProcess');
var User = require('../../models/User');
var service = require('../../services/statistic');
var alimi = require('../../util/alimi');
var CONFIG = require('../../../config/config.json');
var moment = require('moment');
var logger = require('log4js').getLogger('app');
var path = require('path');

module.exports = {

/**
 * 차트2
 * 상위별 하위업무 통계 데이타 조회
 * 상위업무 중 요청건수 가장 많은 것 상위 5개 만족도 현황 가져오기
 */
chart2: (req, res, next) => {
    try {
        
        console.log("==================================================");
        console.log(" Dashboard chart2 : ");
        console.log("==================================================");


        var svc = service.higher_valuation(req);

        Incident.aggregate(svc.aggregatorOpts)
            .exec(function (err, incident) {

                if (err) {

                    console.log("==================================================");
                    console.log(" Dashboard.aggregate error ", err);
                    console.log("==================================================");

                    return res.json({
                        success: false,
                        message: err
                    });

                } else {

                    incident.forEach(function (data, idx, incident) {

                        console.log("==================================================");
                        console.log("data ", JSON.stringify(data));
                        console.log("data.grp.length ", data.grp.length);
                        console.log("==================================================");


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

                        console.log("==================================================");
                        console.log("data.totalCnt : ", data.totalCnt);
                        //console.log("data.stCnt1 : ", data.stCnt1);
                        //console.log("data.stCnt2 : ", data.stCnt2);
                        //console.log("data.stCnt3 : ", data.stCnt3);
                        //console.log("data.stCnt4 : ", data.stCnt4);
                        //console.log("data.solRatio : ", data.solRatio);
                        console.log("data.valuationSum : ", data.valuationSum);
                        console.log("data.valAvg : ", data.valAvg);
                        console.log("==================================================");

                    })

                    res.json(incident);
                    
                    console.log("incident AAA : ", JSON.stringify(incident));
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

}
