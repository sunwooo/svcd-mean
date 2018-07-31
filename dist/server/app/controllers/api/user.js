'use strict';

var async = require('async');
var jwt = require('jsonwebtoken');
var User = require('../../models/User');
var service = require('../../services/usermanage');
var request = require("request");
var CONFIG = require('../../../config/config.json');
var logger = require('log4js').getLogger('app');

module.exports = {

  login: (req, res) => {

    console.log("========controller user.login()========");
    console.log("req.session : ", req.session);
    console.log("req.cookie : ", req.cookies);
    console.log("req.body : ", req.body);
    //console.log("req.query : ", req.query);
    console.log("=======================================");

    var condition = {};
    if (req.body.email != null) {
      condition.email = req.body.email;
    } else {
      condition.email = "x"; //전체 리턴을 방지용 임시 문자
    }

    User.findOne(condition, (err, user) => {

      if (!user) {
        return res.sendStatus(403);
      }

      /*
      if (user.authenticate(req.body.password)) {
        
        const token = jwt.sign({ 
            user: user,
            login: true
          }, CONFIG.cryptoKey); // , { expiresIn: 10 } seconds
      } else {
        
        const token = jwt.sign({ 
            user: user,
            login: false
          }, CONFIG.cryptoKey); // , { expiresIn: 10 } seconds
      }
      */

      setUser(req, res, user);

      //삭제필요
      const token = jwt.sign({
        user: user,
        login: true
      }, CONFIG.cryptoKey); // , { expiresIn: 10 } seconds


      res.status(200).json({
        token: token
      });

    });
  },

  /**
   * 사용자정보
   */
  empInfo: (req, res) => {
    try {

      console.log("========controller empInfo========");
      console.log("req.body.email : ", req.body.email);
      console.log("req.params.email : ", req.params.email);
      console.log("req.query.email : ", req.query.email);
      console.log("=======================================");

      var condition = {};
      if (req.query.email != null) {
        condition.email = req.query.email;
      } else {
        condition.email = "x"; //전체 리턴을 방지
      }

      User.find(condition).exec(function (err, user) {


        //console.log("===============>user : ", user);

        if (!user) {
          return res.sendStatus(403);
        } else {
          res.json(user);
        }

      }); //empInfo.find End
    } catch (e) {
      logger.error("===control empInfo.js empInfo : ", e);
    }
  },

  insert: (req, res) => {
    try {
      //console.log('Login controller New debug >>> ', req.body.usermanage);

      console.log("=================== insert = (req, res) ======================");
      console.log("req.body.usermanage : ", req.body);
      console.log("==============================================================");

      var usermanage = req.body;

      //미승인 세팅
      usermanage.access_yn = 'N';

      async.waterfall([function (callback) {
        User.count({
          'email': User.email
        }, function (err, userCnt) {
          if (err) {

            console.log("=============================================");
            console.log("login.js new usermanage err : ", err);
            console.log("=============================================");

            return res.json({
              success: false,
              message: err
            });
          } else {

            //console.log("=============================================");
            //console.log("login new usermanage userCnt : ", userCnt);
            //console.log("=============================================");

            callback(null, userCnt);
          }
        })
      }], function (err, userCnt) {
        var rtnData = {};

        if (userCnt > 0) {
          res.json({
            success: false,
            message: User.email + '는 이미 등록된 계정입니다.'
          })
        } else {
          User.create(usermanage, function (err, usermanage) {
            if (err) {
              console.log("===============================")
              console.log("login.js new err : ", err);
              console.log("===============================")

              return res.json({
                success: false,
                message: err
              });
            } else {

              console.log("===============================")
              console.log("usermanage : ", usermanage);
              //console.log("this.rtnData : ", this.rtnData);
              console.log("===============================")

              //rtnData.usermanage = usermanage;
              res.json({
                success: true,
                message: err
              });
            }
          });
        }
      });
    } catch (e) {
      console.log('usermanage controllers error ====================> ', e)
    }
  },

  /**
   * 사용자정보
   */
  findEmp: (req, res) => {
    try {

      var searchText = req.query.empName;
      request({
        uri: CONFIG.groupware.uri + "/CoviWeb/api/UserList.aspx?searchName=" + encodeURIComponent(searchText),
        headers: {
          'Content-type': 'application/json'
        },
        method: "GET",
      }, function (err, response, usermanage) {

        User.find({
            employee_nm: {
              $regex: new RegExp(searchText, "i")
            },
            group_flag: "out"
          })
          .limit(10)
          .exec(function (err, usermanageData) {
            if (err) {
              return res.json({
                success: false,
                message: err
              });
            } else {
              if (usermanage != null) {
                usermanage = JSON.parse(usermanage);
              }
              res.json(mergeUser(usermanage, usermanageData));
            }
          }); //usermanage.find End
      }); //request End
    } catch (e) {
      logger.debug("===control usermanager.js userJSON : ", e);
    }
  },

  list: (req, res, next) => {
    var search = service.createSearch(req);

    var page = 1;
    var perPage = 15;

    //console.log("==========================================getusermanage=======================================");
    //console.log("req.query.page : ", req.query.page);
    //console.log("req.query.perPage : ", req.query.perPage);
    //console.log("req.query.searchText : ", req.query.searchText);
    //console.log("================================================================================================");

    if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
    if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);


    async.waterfall([function (callback) {
        User.find(search.findUsermanage, function (err, usermanage) {
          if (err) {
            return res.json({
              success: false,
              message: err
            });
          } else {
            callback(null);
          }
        })
      },
      function (callback) {
        User.count(search.findUsermanage, function (err, totalCnt) {
          if (err) {
            logger.error("incident : ", err);

            return res.json({
              success: false,
              message: err
            });
          } else {

            //logger.debug("=============================================");
            //logger.debug("incidentCnt : ", totalCnt);
            //logger.debug("=============================================");

            callback(null, totalCnt)
          }
        });
      }
    ], function (err, totalCnt) {

      User.find(search.findUser, function (err, usermanage) {
          if (err) {

            //logger.debug("=============================================");
            //logger.debug("incident : ", err);
            //logger.debug("=============================================");

            return res.json({
              success: false,
              message: err
            });
          } else {

            //incident에 페이징 처리를 위한 전체 갯수전달
            var rtnData = {};
            rtnData.usermanage = usermanage;
            rtnData.totalCnt = totalCnt;

            res.json(rtnData);
          }
        })
        .sort({
          group_flag: -1,
          company_nm: 1
        })
        .skip((page - 1) * perPage)
        .limit(perPage);
    });
  },


}


/**
 * 배열합치기
 * @param {} trg1 
 * @param {*} trg2 
 */
function mergeUser(trg1, trg2) {
  var rtnJSON = [];
  try {
    if (trg1 != null) {
      for (var i = 0; i < trg1.length; i++) {
        rtnJSON.push(trg1[i]);
      }
    }
    if (trg2 != null) {
      for (var i = 0; i < trg2.length; i++) {
        rtnJSON.push(trg2[i]);
      }
    }
    return rtnJSON;
  } catch (e) {
    logger.error("control useremanage mergeUser : ", e);
  }
}

/**
 * 세션 처리
 * @param {*} req 
 * @param {*} res 
 * @param {*} userInfo 
 */
function setUser(req, res, userInfo) {
  req.session.email = userInfo.email;
  req.session.user_id = userInfo.user_id;
  req.session.sabun = userInfo.sabun;
  req.session.password = userInfo.password;
  req.session.user_flag = userInfo.user_flag;
  req.session.group_flag = userInfo.group_flag;
  req.session.user_nm = userInfo.employee_nm;
  req.session.company_cd = userInfo.company_cd;
  req.session.company_nm = userInfo.company_nm;
  req.session.dept_cd = userInfo.dept_cd;
  req.session.dept_nm = userInfo.dept_nm;
  req.session.position_nm = userInfo.position_nm;
  req.session.jikchk_nm = userInfo.jikchk_nm;
  req.session.office_tel_no = userInfo.office_tel_no;
  req.session.hp_telno = userInfo.hp_telno;
}
