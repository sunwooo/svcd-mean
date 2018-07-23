'use strict';

var async = require('async');
var jwt = require('jsonwebtoken');
var User = require('../../models/User');
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

}

function setUser(req, res, userInfo) {

  //console.log("===============================")
  //console.log("setUser ", userInfo);
  //console.log("===============================");

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
