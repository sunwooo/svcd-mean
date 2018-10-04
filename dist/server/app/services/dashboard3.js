'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

    /**
     * 년도별 요청자/담당자 수
     * higher_valuation
    */
    chart3: (req) => {

        console.log("==========================================statistic service=========================================");
        console.log("chart3 condifion : ");
        console.log("====================================================================================================");

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

        //삭제가 안된것만 조회
        condition.delete_flag = {$ne: 'Y'};

        console.log("==========================================statistic service=========================================");
        console.log("chart3 condifion : ", condition);
        console.log("====================================================================================================");

        var aggregatorOpts = [
            {
                $match: condition
            },
            {
                $group: { //업무별 상태별 집계
                    _id: {
                        register_yyyy: "$register_yyyy",
                        request_id: "$request_id"
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            //{ $unwind: '$grp' }
            //,{ "$sort": { "valuationSum" : -1, "_id.register_yyyy" : 1}}
            // $each: [ { id: 3, score: 8 }, { id: 4, score: 7 }, { id: 5, score: 6 } ],
            //$sort: { score: 1 }
            { "$sort": {  "countSum" : -1  } },
            { "$limit": 5 }


            //,{ "$sort": { "_id.register_mm" : 1, "_id.higher_cd" : 1, "_id.lower_cd" : 1 } }
            //,{ "$sort": { "_id.higher_cd" : 1, "_id.lower_cd" : 1 } }
            //,{ "$sort": { "valuationSum" : 1 } }

        ]

        console.log("==========================================================");
        console.log("chart3 JSON.stringify(aggregatorOpts) >>>>>>> ", JSON.stringify(aggregatorOpts));
        console.log("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    }
};