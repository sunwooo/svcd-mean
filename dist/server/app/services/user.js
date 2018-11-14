'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

  createSearch: (req) => {
    //logger.debug("usermanage createSearch start !");
    //logger.debug('searchText          ' + req.query.searchText);

    var findUsermanage = {},
      highlight = {};
    var AndQueries = [];
    var OrQueries = [];
    var company_cd = req.query.company_cd == null ? "*" : req.query.company_cd;
    var using_yn = req.query.using_yn == null ? "*" : req.query.using_yn;

    try {
      if (req.query.searchType && req.query.searchText) {
        var searchTypes = req.query.searchType.toLowerCase().split(",");
        if (searchTypes.indexOf("company_nm") >= 0) {
          OrQueries.push({
            company_nm: {
              $regex: new RegExp(req.query.searchText, "i")
            }
          });
          //logger.debug('OrQueries : ' + JSON.stringify(OrQueries));
          highlight.company_nm = req.query.searchText;
        }
        if (searchTypes.indexOf("employee_nm") >= 0) {
          OrQueries.push({
            employee_nm: {
              $regex: new RegExp(req.query.searchText, "i")
            }
          });
          //logger.debug('OrQueries : ' + OrQueries);
          highlight.employee_nm = req.query.searchText;
        }
        if (OrQueries.length > 0) {
          findUsermanage.$or = OrQueries;
        }
      }

      //승인 사용자만 조회
      AndQueries.push({
        access_yn: "Y"
      });

      if (company_cd != '*') {
        AndQueries.push({
          company_cd: req.query.company_cd
        });
      }

      if (using_yn != '*') {
        AndQueries.push({
          using_yn: req.query.using_yn
        });
      }

      //AndQuery 추가
      if (AndQueries.length > 0) {
        findUsermanage.$and = AndQueries;
      }


      //logger.debug('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      //logger.debug('req                 ' + req);
      //logger.debug('req.query           ' + req.query);
      //logger.debug('using_yn            ' + req.query.using_yn);
      //logger.debug('searchType          ' + req.query.searchType);
      //logger.debug('searchText          ' + req.query.searchText);
      //logger.debug('company_cd          ' + req.query.company_cd);
      //logger.debug('findUsermanage      ' + JSON.stringify(findUsermanage));
      //logger.debug('highlight           ' + JSON.stringify(highlight));


      return {
        using_yn: req.query.using_yn,
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
