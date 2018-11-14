'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

    /**
     * 상위업무별 만족도 통계 옵션 및 그룹
     * higher_valuation
    */
    higher_valuation: (req) => {

        var condition = {};
        var OrQueries = [];

        if (req.query.company_cd != null && req.query.company_cd != '*') {
            condition.request_company_cd = req.query.company_cd;
        }
        if (req.query.higher_cd != null && req.query.higher_cd != '*') {
            condition.higher_cd = req.query.higher_cd;
        }
        /*
        if (req.query.yyyy != null) {
            condition.register_yyyy = req.query.yyyy;
        }
        */
        if (req.query.mm != null && req.query.mm != '*') {
            condition.register_mm = req.query.mm;
        }

        //완료건만 조회
        condition.status_cd = "4";

        //[접수대기] 건 제외
        /*
        OrQueries.push({
            $or: [
                {
                status_cd: "2"
            }, {
                status_cd: "3"
            }, 
            {
                status_cd: "4"
            }]
        });

        condition.$or = OrQueries;
        */
        
        //logger.debug("==========================================statistic service=========================================");
        //logger.debug("condifion : ", condition);
        //logger.debug("====================================================================================================");

        var aggregatorOpts = [
            {
                $match: condition
            },
            {
                $group: { //업무별 상태별 집계
                    _id: {
                        higher_cd: "$higher_cd",
                        higher_nm: "$higher_nm",
                        //lower_cd: "$lower_cd",
                        //lower_nm: "$lower_nm",
                        //status_cd: "$status_cd",
                        //status_nm: "$status_nm",
                        register_yyyy: "$register_yyyy",
                        //register_mm: "$register_mm"
                    },
                    count: {
                        $sum: 1
                    },
                    avgValuation: { 
                        $avg: "$valuation" 
                    },
                    valuationSum: {
                        $sum: "$valuation"
                    }
                }
            }
            ,{ "$sort": {  "_id.register_yyyy" : 1  } }
            , {
                $group: { //상태별 집계
                    _id: {
                        higher_cd: "$_id.higher_cd",
                        higher_nm: "$_id.higher_nm",
                        register_yyyy: "$register_yyyy",
                        //lower_cd: "$_id.lower_cd",
                        //lower_nm: "$_id.lower_nm"
                    },
                    grp: {
                        $push: {
                            register_yyyy: "$_id.register_yyyy",
                            count: "$count",
                            avg:"$avgValuation",
                        },
                    },
                    
                    valuationSum: {
                        $sum: "$valuationSum"
                    },
                    countSum: {
                        $sum: "$count"
                    }
                }
            }
            //,{ $unwind: '$register_yyyy' }
            //,{ "$sort": { "valuationSum" : -1, "_id.register_yyyy" : 1}}
            // $each: [ { id: 3, score: 8 }, { id: 4, score: 7 }, { id: 5, score: 6 } ],
            //$sort: { score: 1 }

            ,{ "$sort": {  "countSum" : -1  } }
            ,{ "$limit": 5 }


        ]

        //logger.debug("==========================================================");
        //logger.debug('higher_valuation  >>>>>>> ', JSON.stringify(aggregatorOpts));
        //logger.debug("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    },

    /**
     * 업무별 만족도 통계 옵션 및 그룹
     * task_valuation
    */
    task_valuation: (req) => {

        var condition = {};
        var OrQueries = [];

        if (req.query.company_cd != null && req.query.company_cd != '*') {
            condition.request_company_cd = req.query.company_cd;
        }
        if (req.query.higher_cd != null && req.query.higher_cd != '*') {
            condition.higher_cd = req.query.higher_cd;
        }
        if (req.query.yyyy != null) {
            condition.register_yyyy = req.query.yyyy;
        }
        /*
        if (req.query.mm != null && req.query.mm != '*') {
            condition.register_mm = req.query.mm;
        }
        */


        //완료건만 조회
        condition.status_cd = "4";

        //[접수대기] 건 제외
        /*
        OrQueries.push({
            $or: [
                {
                status_cd: "2"
            }, {
                status_cd: "3"
            }, 
            {
                status_cd: "4"
            }]
        });

        condition.$or = OrQueries;
        */
        
        //logger.debug("==========================================statistic service=========================================");
        //logger.debug("condifion : ", condition);
        //logger.debug("====================================================================================================");

        var aggregatorOpts = [
            {
                $match: condition
            },
            {
                $group: { //업무별 상태별 집계
                    _id: {
                        higher_cd: "$higher_cd",
                        higher_nm: "$higher_nm",
                        register_yyyy: "$register_yyyy",
                       
                    },
                    //count: {
                    //    $sum: 1
                    //},
                    avgValuation: { 
                        $avg: "$valuation" 
                    },
                    //valuationSum: {
                    //    $sum: "$valuation"
                    //}
                }
            }
            ,{ "$sort": {  "_id.register_yyyy" : -1  } }
            , {
                $group: { //상태별 집계
                    _id: {
                        higher_cd: "$_id.higher_cd",
                        higher_nm: "$_id.higher_nm",
                        register_yyyy: "$register_yyyy",
                      
                    },
                    grp: {
                        $push: {
                            register_yyyy: "$_id.register_yyyy",
                            count: "$count",
                            avg:"$avgValuation",
                        },
                    },
                    //valuationSum: {
                    //    $sum: "$valuationSum"
                    //},
                    //countSum: {
                    //    $sum: "$count"
                    //}
                }
            }
            //,{ $unwind: '$register_yyyy' }
            //,{ "$sort": { "valuationSum" : -1, "_id.register_yyyy" : 1}}
            // $each: [ { id: 3, score: 8 }, { id: 4, score: 7 }, { id: 5, score: 6 } ],
            //$sort: { score: 1 }

            ,{ "$sort": {  "grp.avg" : -1  , "grp.count" : -1 ,  "_id.higher_cd" : 1 } }
            //,{ "$limit": 5 }

        ]

        //logger.debug("==========================================================");
        //logger.debug('task_valuation  >>>>>>> ', JSON.stringify(aggregatorOpts));
        //logger.debug("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    },

    /**
     * 회사별 만족도 통계 옵션 및 그룹
     * com_valuation1 (상위10개사)
    */
    com_valuation1: (req) => {

        var condition = {};
        var OrQueries = [];

        //if (req.query.company_cd != null && req.query.company_cd != '*') {
        //    condition.request_company_cd = req.query.company_cd;
        //}
        if (req.query.higher_cd != null && req.query.higher_cd != '*') {
            condition.higher_cd = req.query.higher_cd;
        }
        
        if (req.query.yyyy != null) {
            condition.register_yyyy = req.query.yyyy;
        }
        
        if (req.query.mm != null && req.query.mm != '*') {
            condition.register_mm = req.query.mm;
        }
        
        //완료건만 조회
        condition.status_cd = "4";

        //[접수대기] 건 제외
        /*
        OrQueries.push({
            $or: [
                {
                status_cd: "2"
            }, {
                status_cd: "3"
            },        
            {
                status_cd: "4"
            }]
        });

        condition.$or = OrQueries;
        */
        
        //logger.debug("==========================================statistic service=========================================");
        //logger.debug("condifion : ", JSON.stringify(condition));
        //logger.debug("====================================================================================================");

        var aggregatorOpts = [
            {
                $match: condition
            },
            {
                $group: { //업무별 상태별 집계
                    _id: {
                        company_cd: "$request_company_cd",
                        company_nm: "$request_company_nm",
                        register_yyyy: "$register_yyyy",
                       
                    },
                    count: {
                        $sum: 1
                    },
                    avgValuation: { 
                        $avg: "$valuation" 
                    },
                    //valuationSum: {
                    //    $sum: "$valuation"
                    //}
                }
            }
            ,{ "$sort": {  "_id.register_yyyy" : -1  } }
            , {
                $group: { //상태별 집계
                    _id: {
                        company_cd: "$_id.company_cd",
                        company_nm: "$_id.company_nm",
                        register_yyyy: "$register_yyyy",
                      
                    },
                    grp: {
                        $push: {
                            register_yyyy: "$_id.register_yyyy",
                            //company_nm: "$_id.company_nm",
                            count: "$count",
                            avg:"$avgValuation",
                        },
                    },
                    //valuationSum: {
                    //    $sum: "$valuationSum"
                    //},
                    //countSum: {
                    //    $sum: "$count"
                    //}
                }
            }
            //,{ $unwind: '$register_yyyy' }
            //,{ "$sort": { "valuationSum" : -1, "_id.register_yyyy" : 1}}
            // $each: [ { id: 3, score: 8 }, { id: 4, score: 7 }, { id: 5, score: 6 } ],
            //$sort: { score: 1 }

            ,{ "$sort": {  "grp.avg" : -1 , "grp.count" : -1 , "_id.company_cd" : 1  } }
            ,{ "$limit": 10 }

        ]

        //logger.debug("==========================================================");
        //logger.debug('com_valuation1  >>>>>>> ', JSON.stringify(aggregatorOpts));
        //logger.debug("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    },

    /**
     * 회사별 만족도 통계 옵션 및 그룹
     * com_valuation2 (하위10개사)
    */
    com_valuation2: (req) => {

        var condition = {};
        var OrQueries = [];

        //if (req.query.company_cd != null && req.query.company_cd != '*') {
        //    condition.request_company_cd = req.query.company_cd;
        //}
        if (req.query.higher_cd != null && req.query.higher_cd != '*') {
            condition.higher_cd = req.query.higher_cd;
        }
        
        if (req.query.yyyy != null) {
            condition.register_yyyy = req.query.yyyy;
        }
        
        
        if (req.query.mm != null && req.query.mm != '*') {
            condition.register_mm = req.query.mm;
        }
        
        //완료건만 조회
        condition.status_cd = "4";

        //[접수대기] 건 제외
        /*
        OrQueries.push({
            $or: [{
                status_cd: "4"
            }]
        });
        
        condition.$or = OrQueries;
        */


        //logger.debug("==========================================statistic service=========================================");
        //logger.debug("condifion : ", JSON.stringify(condition));
        //logger.debug("====================================================================================================");

        var aggregatorOpts = [
            {
                $match: condition
            },
            {
                $group: { //업무별 상태별 집계
                    _id: {
                        company_cd: "$request_company_cd",
                        company_nm: "$request_company_nm",
                        register_yyyy: "$register_yyyy",
                       
                    },
                    count: {
                        $sum: 1
                    },
                    avgValuation: { 
                        $avg: "$valuation" 
                    },
                    //valuationSum: {
                    //    $sum: "$valuation"
                    //}
                }
            }
            ,{ "$sort": {  "_id.register_yyyy" : -1  } }
            , {
                $group: { //상태별 집계
                    _id: {
                        company_cd: "$_id.company_cd",
                        company_nm: "$_id.company_nm",
                        register_yyyy: "$register_yyyy",
                      
                    },
                    grp: {
                        $push: {
                            register_yyyy: "$_id.register_yyyy",
                            //company_nm: "$_id.company_nm",
                            count: "$count",
                            avg:"$avgValuation",
                        },
                    },
                    //valuationSum: {
                    //    $sum: "$valuationSum"
                    //},
                    //countSum: {
                    //    $sum: "$count"
                    //}
                }
            }
            //,{ $unwind: '$register_yyyy' }
            //,{ "$sort": { "valuationSum" : -1, "_id.register_yyyy" : 1}}
            // $each: [ { id: 3, score: 8 }, { id: 4, score: 7 }, { id: 5, score: 6 } ],
            //$sort: { score: 1 }

            ,{ "$sort": {  "grp.avg" : 1 , "grp.count" : -1 , "_id.company_cd" : 1 } }
            ,{ "$limit": 10 }

        ]

        //logger.debug("==========================================================");
        //logger.debug('com_valuation2  >>>>>>> ', JSON.stringify(aggregatorOpts));
        //logger.debug("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    },

    /**
     * 조건별 만족도 현황
     */
    valuationCnt: (req) => {

        var condition = {};
        var OrQueries = [];

        if (req.query.company_cd != null && req.query.company_cd != '*') {
            condition.request_company_cd = req.query.company_cd;
        }
        if (req.query.higher_cd != null && req.query.higher_cd != '*') {
            condition.higher_cd = req.query.higher_cd;
        }
        if (req.query.yyyy != null) {
            condition.register_yyyy = req.query.yyyy;
        }
        if (req.query.mm != null && req.query.mm != '*') {
            condition.register_mm = req.query.mm;
        }

        //완료건만 조회
        condition.status_cd = "4";
       
        //logger.debug("==========================================dashboard2=========================================");
        //logger.debug("condifion : ", condition);
        //logger.debug("====================================================================================================");

        var aggregatorOpts = [
            {
                $match: condition
            },
            {$group: { //그룹칼럼
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

        //logger.debug("==========================================================");
        //logger.debug('valuationCnt  >>>>>>> ', JSON.stringify(aggregatorOpts));
        //logger.debug("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    }

};