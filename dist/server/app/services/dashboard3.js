'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

    /**
     * 년도별 요청자/담당자 수
     * higher_valuation
    */
    chart3: (req) => {

        //console.log("==========================================statistic service=========================================");
        //console.log("chart3 req.query : ", req.query);
        //console.log("====================================================================================================");

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
                $group:{ 
                         _id:{register_yyyy: "$register_yyyy"},
                         requset_id: {$addToSet: "$request_id"},
                         manager_email: {$addToSet: "$manager_email"}
                        }
            },
            { $sort: {  "_id.register_yyyy" : 1  } 
            },
            { $project : {
                          "_id.register_yyyy" : 1,
                          req: { $size: "$requset_id" },
                          mng: { $size: "$manager_email" }
                         }
            },
            { $limit: 5
            },
        ];

        //console.log("==========================================================");
        //console.log("chart3 JSON.stringify(aggregatorOpts) >>>>>>> ", JSON.stringify(aggregatorOpts));
        //console.log("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    },

    /**
     * 
     */
    chart3_1: (req) => {

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

        //console.log("==========================================statistic service=========================================");
        //console.log("chart3_1 condifion : ", condition);
        //console.log("====================================================================================================");

        var aggregatorOpts = [
            {
                $match: condition
            },
            {
                $group:{ 
                         _id:{register_yyyy: "$register_yyyy"},
                         requset_id: {$addToSet: "$request_id"},
                         manager_email: {$addToSet: "$manager_email"}
                        }
            },
            { $sort: {  "_id.register_yyyy" : 1  } 
            },
            { $project : {
                          "_id.register_yyyy" : 1,
                          req: { $size: "$requset_id" },
                          mng: { $size: "$manager_email" }
                         }
            },
            { $limit: 5
            },
        ];

        //console.log("==========================================================");
        //console.log("chart3_1 JSON.stringify(aggregatorOpts) >>>>>>> ", JSON.stringify(aggregatorOpts));
        //console.log("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    },


    /**
     * 업무별 요청자/담당자 수
     */
    chart3_2: (req) => {

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

        //console.log("==========================================statistic service=========================================");
        //console.log("chart3_2 condifion : ", condition);
        //console.log("====================================================================================================");

        var aggregatorOpts = [
            {
                $match: condition
            },
            {
                $group:{ 
                         _id:{higher_nm: "$higher_nm"},
                         requset_id: {$addToSet: "$request_id"},
                         manager_email: {$addToSet: "$manager_email"}
                        }
            },
            { $sort: {  "_id.higher_nm" : 1  } 
            },
            { $project : {
                          "_id.higher_nm" : 1,
                          req: { $size: "$requset_id" },
                          mng: { $size: "$manager_email" }
                         }
            }
        ];

        //console.log("==========================================================");
        //console.log("chart3_2 JSON.stringify(aggregatorOpts) >>>>>>> ", JSON.stringify(aggregatorOpts));
        //console.log("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    }
};