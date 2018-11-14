'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

    createSearch: (req) => {

        var findUsermanage = {},
            highlight = {};
        var AndQueries = [];
        var OrQueries = [];
        var company_cd = req.query.company_cd == null ? "*" : req.query.company_cd;
        var access_yn = "";

        try {
            if (req.query.searchType && req.query.searchText) {
                var searchTypes = req.query.searchType.toLowerCase().split(",");
                if (searchTypes.indexOf("company_nm") >= 0) {
                    OrQueries.push({
                        company_nm: { $regex: new RegExp(req.query.searchText, "i") }
                    });
                    //logger.debug('OrQueries : ' + JSON.stringify(OrQueries));
                    highlight.company_nm = req.query.searchText;
                }
                if (searchTypes.indexOf("employee_nm") >= 0) {
                    OrQueries.push({
                        employee_nm: { $regex: new RegExp(req.query.searchText, "i") }
                    });
                    //logger.debug('OrQueries : ' + OrQueries);
                    highlight.employee_nm = req.query.searchText;
                }
                if (OrQueries.length > 0) {
                    findUsermanage.$or = OrQueries
                }
            }

            if (company_cd != '*') {
                AndQueries.push({
                    company_cd: req.query.company_cd
                });
            }

            if (access_yn != '*') {
                AndQueries.push({
                    access_yn: "N"
                });
            }

            //AndQuery 추가
            if (AndQueries.length > 0) {
                findUsermanage.$and = AndQueries
            }

            /*
            logger.debug('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            logger.debug('access_yn           ' + access_yn);
            logger.debug('searchType          ' + req.query.searchType);
            logger.debug('searchText          ' + req.query.searchText);
            logger.debug('company_cd          ' + req.query.company_cd);
            logger.debug('findUsermanage      ' + JSON.stringify(findUsermanage));
            logger.debug('highlight           ' + JSON.stringify(highlight));
            logger.debug('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            */
            
            return {
                access_yn: access_yn,
                searchType: req.query.searchType,
                searchText: req.query.searchText,
                company_cd: req.query.company_cd,
                findUsermanage: findUsermanage,
                highlight: highlight
            };
        } catch (e) {
            logger.debug("oftenqna service error : ", e);
        }
    }
};
