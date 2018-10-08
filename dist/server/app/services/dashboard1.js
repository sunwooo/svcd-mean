'use strict';

const logger = require('log4js').getLogger('app');

module.exports = {

  /**
   * 요청회사별 건수
   * requestCompany_count
   */
  requestCompany_count: (req) => {

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
    /*
    if (req.query.higher_cd != null && req.query.higher_cd != '*') {
      condition.higher_cd = req.query.higher_cd;
    }
    */

    //condition.higher_cd = 'H008';

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


    var aggregatorOpts = [{
        $match: condition
      }, {
        $group: { //요청 회사별 집계
          _id: {
            request_company_nm: "$request_company_nm",
            higher_nm: "$higher_nm"
          },
          count: {
            $sum: 1
          }
        }
      }, {
        "$sort": {
          "count": -1
        }
      }, {
        $group: {
          _id: {
            higher_nm: "$_id.higher_nm"
          },
          grp: {
            $push: {
              request_company_nm: "$_id.request_company_nm",
              count: "$count"
            },
          },

          countSum: {
            $sum: "$count"
          },

        }
      }

      //,{ $unwind: '$register_yyyy' }
      //,{ "$sort": { "valuationSum" : -1, "_id.register_yyyy" : 1}}
      // $each: [ { id: 3, score: 8 }, { id: 4, score: 7 }, { id: 5, score: 6 } ],
      //$sort: { score: 1 }

      , {
        "$sort": {
          "countSum": -1
        }
      }
    ]

    //console.log("==========================================================");
    //console.log('requestCompany_count  >>>>>>> ', JSON.stringify(aggregatorOpts));
    //console.log("==========================================================");

    return {
      aggregatorOpts: aggregatorOpts
    };
  },

  company_reqcnt: (req) => {
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

    var aggregatorOpts = [{
        $match: condition
      }, {
        $group: { //그룹칼럼
          _id: {
            request_company_nm: "$request_company_nm"
          },
          name: {
            $first: "$request_company_nm"
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
    ]

    return {
      aggregatorOpts: aggregatorOpts
    };
  },

  process_cnt: (req) => {
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

    var aggregatorOpts = [{
        $match: condition
      }, {
        $group: { //그룹칼럼
          _id: {
            process_nm: "$process_nm"
          },
          name: {
            $first: "$process_nm"
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
    ]

    return {
      aggregatorOpts: aggregatorOpts
    };

    //console.log("==========================================================");
    //console.log('requestCompany_count  >>>>>>> ', JSON.stringify(aggregatorOpts));
    //console.log("==========================================================");
  },
};
