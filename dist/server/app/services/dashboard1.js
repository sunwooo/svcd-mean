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
        
        logger.debug("==========================================statistic service=========================================");
        logger.debug("condifion : ", condition);
        logger.debug("====================================================================================================");

        var aggregatorOpts = [
            {
                $match: condition
            }
            , {
                $group: { //요청 회사별 집계
                    _id: {
                        request_company_nm: "$request_company_nm",
                        process_nm: "$process_nm",
                        register_yyyy: "$register_yyyy",
                        register_mm: "$register_mm"
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
            , { "$sort": {  "count" : -1 } }
            , { "$limit": 3 }
            , {
                $group: { 
                    _id: {
                        request_company_nm: "$_id.request_company_nm",
                        process_nm: "$process_nm",
                        register_yyyy: "$register_yyyy",
                        register_mm: "$register_mm"
                    },
                    grp: {
                        $push: {
                            process_nm: "$_id.process_nm",
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


            //,{ "$sort": { "_id.register_mm" : 1, "_id.higher_cd" : 1, "_id.lower_cd" : 1 } }
            //,{ "$sort": { "_id.higher_cd" : 1, "_id.lower_cd" : 1 } }
            //,{ "$sort": { "valuationSum" : 1 } }

        ]

        console.log("==========================================================");
        console.log('requestCompany_count  >>>>>>> ', JSON.stringify(aggregatorOpts));
        console.log("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    }
};