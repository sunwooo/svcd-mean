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
        //if (req.query.yyyy != null) {
        //    condition.register_yyyy = req.query.yyyy;
        //}
        //if (req.query.mm != null && req.query.mm != '*') {
        //    condition.register_mm = req.query.mm;
        //}
        if (req.query.higher_cd != null && req.query.higher_cd != '*') {
            condition.higher_cd = req.query.higher_cd;
        }

        //삭제가 안된것만 조회
        condition.delete_flag = {$ne: 'Y'};

        //console.log("==========================================statistic service=========================================");
        //console.log("chart3 condifion : ", condition);
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
        //console.log("chart3 JSON.stringify(aggregatorOpts) >>>>>>> ", JSON.stringify(aggregatorOpts));
        //console.log("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    },

    /**
     * 년도별 요청자 상위5
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
                         _id:{request_id: "$request_id",
                              request_nm: "$request_nm"
                             },
                         count: {
                            $sum: 1
                          }
                        }
            },
            { $sort: {  "count" : -1  } 
            },
            { $project : {
                          "_id.request_id" : 1,
                          "_id.request_nm" : 1,
                          "count": 1
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
     * 년도별 접수자 상위5 
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
                         _id:{manager_email: "$manager_email",
                              manager_nm: "$manager_nm"
                             },
                         count: {
                            $sum: 1
                          }
                        }
            },
            { $sort: {  "count" : -1  } 
            },
            { $project : {
                          "_id.manager_email" : 1,
                          "_id.manager_nm" : 1,
                          "count": 1
                         }
            },
            { $limit: 5
            },
        ];

        //console.log("==========================================================");
        //console.log("chart3_2 JSON.stringify(aggregatorOpts) >>>>>>> ", JSON.stringify(aggregatorOpts));
        //console.log("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    },    


    /**
     * 년도별 만족도 상위5 
     */
    chart3_3: (req) => {

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

        //처리완료만 처리
        condition.status_cd = '4';

        //삭제가 안된것만 조회
        condition.delete_flag = {$ne: 'Y'};

        //console.log("==========================================statistic service=========================================");
        //console.log("chart3_3 condifion : ", condition);
        //console.log("====================================================================================================");

        var aggregatorOpts = [
            {
                $match: condition
            },
            {
                $group:{ 
                         _id:{request_id: "$request_id",
                              request_nm: "$request_nm"
                             },
                        avg: { 
                                $avg: "$valuation" 
                            },
                        count: { 
                                $sum: 1 
                             }
                        }
            },
            {
                $match: {"count":{"$gt":3}}
            },
            { $sort: {  "avg" : -1, "count" : -1  } 
            },
            { $project : {
                          "_id.request_id" : 1,
                          "_id.request_nm" : 1,
                          "count" : 1,
                          "avg" : 1
                         }
            },
            { $limit: 5
            },
        ];

        //console.log("==========================================================");
        //console.log("chart3_3 JSON.stringify(aggregatorOpts) >>>>>>> ", JSON.stringify(aggregatorOpts));
        //console.log("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    },    


    /**
     * 년도별 만족도 하위5 
     */
    chart3_4: (req) => {

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

        //처리완료만 처리
        condition.status_cd = '4';

        //삭제가 안된것만 조회
        condition.delete_flag = {$ne: 'Y'};

        //console.log("==========================================statistic service=========================================");
        //console.log("chart3_4 condifion : ", condition);
        //console.log("====================================================================================================");

        var aggregatorOpts = [
            {
                $match: condition
            },
            {
                $group:{ 
                         _id:{request_id: "$request_id",
                              request_nm: "$request_nm"
                             },
                        avg: { 
                                $avg: "$valuation" 
                            },
                        count: { 
                                $sum: 1 
                            }
                        }
            },
            {
                $match: {"count":{"$gt":3}}
            },
            { $sort: {  "avg" : 1, "count" : -1 } 
            },
            { $project : {
                          "_id.request_id" : 1,
                          "_id.request_nm" : 1,
                          "count" : 1,
                          "avg" : 1
                         }
            },
            { $limit: 5
            },
        ];

        //console.log("==========================================================");
        //console.log("chart3_4 JSON.stringify(aggregatorOpts) >>>>>>> ", JSON.stringify(aggregatorOpts));
        //console.log("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    },    


    /**
     * 업무별 요청자/담당자 수
     */
    chart3_5: (req) => {

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
        //console.log("chart3_5 JSON.stringify(aggregatorOpts) >>>>>>> ", JSON.stringify(aggregatorOpts));
        //console.log("==========================================================");

        return {
            aggregatorOpts: aggregatorOpts
        };
    }
};