'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

    /**
     * 요청회사별 건수
     * requestCompany_count
    */
    requestCompany_count: (req) => {

        var condition = {};
        var OrQueries = [];

        if (req.query.series != null) {
            condition.register_yyyy = req.query.series;
        }
        if (req.query.name != null && req.query.name != '*') {
            condition.register_mm = req.query.name;
        }

        //[접수대기] 건 제외
        /*
        OrQueries.push({
            $or: [
                status_cd: "2"
            }, 
            {
                status_cd: "3"
            }, 
            {
                status_cd: "4"
            }]
        });
        */

        //condition.$or = OrQueries;
        
        /*
        var aggregatorOpts = [
            {
                $match: condition
            },
            {
                $group:{ 
                         _id: {request_company_nm : "$request_company_nm"},
                         process_nm: {$addToSet: "$process_nm"},
                        }
            },
            { 
                $sort: { "_id.request_company_nm" : 1 } 
            },
            { 
                $project: {
                          "_id.request_company_nm" : 1,
                          name: "$process_nm",
                          req: { $size: "$process_nm" },
                          }
            }
        */


       var aggregatorOpts = [
            {
                $match: condition
            }
            , {
                $group: { //요청 회사별 집계
                    _id: {
                        request_company_nm: "$request_company_nm",
                        higher_nm: "$higher_nm"
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
            , { "$sort": {  "count" : -1 } }
            , {
                $group: { 
                    _id: {
                        request_company_nm: "$_id.request_company_nm"
                    },
                    grp: {
                        $push: {
                            higher_nm: "$_id.higher_nm",
                            count: "$count"
                        },
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

            ,{ "$sort": {  "countSum" : -1 } }
            ,{ "$limit": 10 }
        ]

        console.log("==========================================================");
        console.log('requestCompany_count  >>>>>>> ', JSON.stringify(aggregatorOpts));
        console.log("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    }
};