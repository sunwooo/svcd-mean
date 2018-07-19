﻿'use strict';

var MyProcess = require('../models/MyProcess');
var MyProcessController = require('../controllers/myProcess');
var async = require('async');
var logger = require('log4js').getLogger('app');

module.exports = {

    getMessage: () => {
        return 'Search Page';
    },

    createSearch: (req) => {
        try {
            var findIncident = {},
                findUser = null,
                highlight = {};
            var AndQueries = [];
            var OrQueries = [];

            if (req.query.searchType && req.query.searchText) {
                var searchTypes = req.query.searchType.toLowerCase().split(",");
                if (searchTypes.indexOf("title") >= 0) {
                    OrQueries.push({
                        title: {
                            $regex: new RegExp(req.query.searchText, "i")
                        }
                    });
                    logger.debug('OrQueries : ' + JSON.stringify(OrQueries));
                    highlight.title = req.query.searchText;
                } else if (searchTypes.indexOf("content") >= 0) {
                    OrQueries.push({
                        content: {
                            $regex: new RegExp(req.query.searchText, "i")
                        }
                    });
                    logger.debug('OrQueries : ' + OrQueries);
                    highlight.content = req.query.searchText;
                } else if (searchTypes.indexOf("title,content") >= 0) {
                    OrQueries.push({
                        title: {
                            $regex: new RegExp(req.query.searchText, "i")
                        },
                        content: {
                            $regex: new RegExp(req.query.searchText, "i")
                        }
                    });
                    logger.debug('OrQueries : ' + OrQueries);
                    highlight.content = req.query.searchText;
                }

                if (OrQueries.length > 0) {
                    findIncident.$or = OrQueries
                }
            }

            var higher_cd = req.query.higher_cd == null ? "*" : req.query.higher_cd;
            var lower_cd = req.query.lower_cd == null ? "*" : req.query.lower_cd;
            var status_cd = req.query.status_cd == null ? "*" : req.query.status_cd;
            var reg_date_from = req.query.reg_date_from;
            var reg_date_to = req.query.reg_date_to;

            //진행상태가 존재하면
            if (status_cd != '*') {
                AndQueries.push({
                    status_cd: req.query.status_cd
                });
            }

            //처리된 내용검색 gbn 구분 추가
            //gbn=complete 시, status=3,4만 가져오기
            if (req.query.gbn == "complete") {
                AndQueries.push({
                    $or: [{
                        "status_cd": "3"
                    }, {
                        "status_cd": "4"
                    }]
                });
            }
            //추가 끝

            //상위업무가 존재하면
            if (higher_cd != '*') {
                AndQueries.push({
                    higher_cd: req.query.higher_cd
                });
            }

            //하위업무가 존재하면
            if (lower_cd != '*') {
                AndQueries.push({
                    lower_cd: req.query.lower_cd
                });
            }

            //검색기간 조건 추가
            if (reg_date_from && reg_date_to) {
                AndQueries.push({
                    register_date: {
                        "$gt": reg_date_from,
                        "$lt": reg_date_to
                    }
                });
            }

            async.waterfall([function (callback) {


                MyProcessController.getMyHigherProcess(req, function (myHigherProcess) {
                    logger.debug("================incident service=================");
                    logger.debug("manager");
                    logger.debug("myHigherProcess length : ", myHigherProcess.length);
                    logger.debug("getMyHigherProcess length : ", myHigherProcess);
                    logger.debug("=================================================");

                    callback(myHigherProcess);
                });

            }], function (myHigherProcess) {

                logger.debug("================incident service=================");
                logger.debug("manager myHigherProcess ", myHigherProcess);
                logger.debug("=================================================");


                //나의 업무처리현황
                if (req.query.user == "manager") {

                    var mhp = [];
                    mhp.push('H024');


                    AndQueries.push({
                        higher_cd: {
                            //$in: mhp
                            $in: ["H004", "H006", "H012", "H024", "H001"]
                        }
                    });

                    //업무 담당자(user_flag = 4)이면
                } else if (req.query.user == "managerall") {

                    logger.debug("================incident service=================");
                    logger.debug("managerall");
                    logger.debug("=================================================");

                    //본인 것만 조회 
                } else {

                    logger.debug("================incident service=================");
                    logger.debug("managerall");
                    logger.debug("=================================================");

                    AndQueries.push({
                        request_id: req.session.email
                    });
                }

                if (AndQueries.length > 0) {
                    findIncident.$and = AndQueries
                }

                logger.debug('findIncident : ' + JSON.stringify(findIncident));
                logger.debug('req.query.higher_cd : ' + req.query.higher_cd);
                logger.debug('req.query.lower_cd : ' + req.query.lower_cd);
                logger.debug('req.query.searchType : ' + req.query.searchType);
                logger.debug('req.query.searchText : ' + req.query.searchText);
                logger.debug('req.query.reg_date_from : ' + req.query.reg_date_from);
                logger.debug('req.query.reg_date_to : ' + req.query.reg_date_to);

                //console.log('findIncident : ' + JSON.stringify(findIncident));

                return {
                    searchType: req.query.searchType,
                    searchText: req.query.searchText,
                    higher_cd: req.query.higher_cd,
                    lower_cd: req.query.lower_cd,
                    findIncident: findIncident,
                    highlight: highlight
                };
            });
        } catch (e) {

            logger.debug("=================================================");
            logger.error("incident service err : ",e);
            logger.debug("=================================================");
            
        } finally {}
    }
};