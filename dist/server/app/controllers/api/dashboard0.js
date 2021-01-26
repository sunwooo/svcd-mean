'use strict';

var async = require('async');
var Incident = require('../../models/Incident');
var MyProcess = require('../../models/MyProcess');
var incidentService = require('../../services/incident');
var service = require('../../services/statistic');
var CONFIG = require('../../../config/config.json');
var logger = require('log4js').getLogger('app');

module.exports = {


    /**
     * 년도별 월별 업무별 건수
     */
    chart0_1: (req, res, next) => {

        try {

        var today = new Date();
        var thisYear = today.getFullYear();

        var condition = {};

        if (req.query.mm != null && req.query.mm != '*') {
            condition.register_mm = req.query.mm;
        }
        if (req.query.higher_cd != null && req.query.higher_cd != '*') {
            condition.higher_cd = req.query.higher_cd;
        }
        if (req.query.company_cd != null && req.query.company_cd != '*') {
            condition.request_company_cd = req.query.company_cd;
        }
        if (req.query.yyyy != null && req.query.company_cd != '*') {
            condition.register_yyyy = req.query.yyyy;
        } else {
            condition.register_yyyy = thisYear.toString();
        }

        if (req.query.request_id != null && req.query.request_id != '*') {
            condition.request_id = req.query.request_id;
        }
        if (req.query.manager_email != null && req.query.manager_email != '*') {
            condition.manager_email = req.query.manager_email;
        }

        /* 210126_김선재 : 일반사용자 화면 조회조건 수정 */
        var search = incidentService.createSearch(req);

        var aggregatorOpts = [{
            // $match: condition
            $match: search.findIncident
            }, {
            $group: { //그룹칼럼
                _id: {
                higher_nm: "$higher_nm"
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


        Incident.aggregate(aggregatorOpts).exec(function (err, incident) {

            if (err) {
            return res.json({
                success: false,
                message: err
            });
            }
            res.json(incident);
        });

        } catch (e) {} finally {}
    },


    /**
     * 년도별 월별 업무별 만족도
     */
    chart0_2: (req, res, next) => {

        try {

        var today = new Date();
        var thisYear = today.getFullYear();

        var condition = {};

        if (req.query.mm != null && req.query.mm != '*') {
            condition.register_mm = req.query.mm;
        }
        if (req.query.higher_cd != null && req.query.higher_cd != '*') {
            condition.higher_cd = req.query.higher_cd;
        }
        if (req.query.company_cd != null && req.query.company_cd != '*') {
            condition.request_company_cd = req.query.company_cd;
        }
        if (req.query.yyyy != null && req.query.company_cd != '*') {
            condition.register_yyyy = req.query.yyyy;
        } else {
            condition.register_yyyy = thisYear.toString();
        }


        if (req.query.request_id != null && req.query.request_id != '*') {
            condition.request_id = req.query.request_id;
        }
        if (req.query.manager_email != null && req.query.manager_email != '*') {
            condition.manager_email = req.query.manager_email;
        }

        condition.status_cd = "4";

        /* 210126_김선재 : 일반사용자 화면 조회조건 수정 */
        var search = incidentService.createSearch(req);
        search.findIncident.$and.push({"status_cd":"4"});

        var aggregatorOpts = [{
            // $match: condition
            $match: search.findIncident
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

        } catch (e) {} finally {}
    },

    /**
     * 평가 만족도(요청자/담당자)
     */
    chart0_3: (req, res, next) => {

        try {

        var today = new Date();
        var thisYear = today.getFullYear();

        var condition = {};

        if (req.query.mm != null && req.query.mm != '*') {
            condition.register_mm = req.query.mm;
        }
        if (req.query.higher_cd != null && req.query.higher_cd != '*') {
            condition.higher_cd = req.query.higher_cd;
        }
        if (req.query.company_cd != null && req.query.company_cd != '*') {
            condition.request_company_cd = req.query.company_cd;
        }
        if (req.query.yyyy != null && req.query.company_cd != '*') {
            condition.register_yyyy = req.query.yyyy;
        } else {
            condition.register_yyyy = thisYear.toString();
        }


        if (req.query.request_id != null && req.query.request_id != '*') {
            condition.request_id = req.query.request_id;
        }
        if (req.query.manager_email != null && req.query.manager_email != '*') {
            condition.manager_email = req.query.manager_email;
        }

        
        //처리완료만 처리
        condition.status_cd = '4';

        /* 210126_김선재 : 일반사용자 화면 조회조건 수정 */
        var search = incidentService.createSearch(req);
        search.findIncident.$and.push({"status_cd":"4"});

        var aggregatorOpts = [{
                // $match: condition
                $match: search.findIncident
            }, {
            $group: { //그룹칼럼
                _id: null,
                avg: {
                    $avg: "$valuation"
                    }
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

        } catch (e) {} finally {}
    },


}