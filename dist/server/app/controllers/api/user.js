'use strict';

var async = require('async');
var jwt = require('jsonwebtoken');
var User = require('../../models/User');
var UserToken = require('../../models/UserToken');
var service = require('../../services/user');
var mailer = require('../../util/nodemailer');
var AccessUserService = require('../../services/userAccess');
var request = require("request");
var CONFIG = require('../../../config/config.json');
var logger = require('log4js').getLogger('app');

module.exports = {

    /**
     * 그룹사 및 고객사 로그인
     */
    login: (req, res) => {

      console.log("========controller user.login()========");
      console.log("req.session : ", req.session);
      console.log("req.cookie : ", req.cookies);
      console.log("req.body : ", req.body);
      console.log("req.query : ", req.query);
      console.log("=======================================");

      


      var condition = {};
      if (req.body.email != null) {
        /* 200518_김선재 : 메일주소 후행 공백 시 비정상 로그인 현상 처리 */
        // condition.email = req.body.email;
        condition.email = req.body.email.trim();
      } else {
        return res.sendStatus(403);
      }

      try {
        /**
         * 로그인 정보 매핑
         * user 테이블에서 사용자 1차 검색 (비밀번호 틀릴 시 그룹웨어 검색)
         * user 테이블에 존재않을 시 그룹웨어 검색  
         */

        //2022-03-18 psw 수정중 
        //https://gwt.isu.co.kr/cm/api/ISU_OutInterface/api/login?userId=testtesttest@isu.co.kr&password=test!!2021

        async.waterfall([function (callback) {
            User.findOne(condition).exec(function (err, user) {

              var gwUri = "";
              //if(req.body.sso){
                  //2022-03-18 psw 수정중 
                  //원본  
                  //gwUri = CONFIG.groupware.uri + "/CoviWeb/api/UserInfo.aspx?type=sso&email=" + req.body.email + "&password=" + encodeURIComponent(req.body.password);
                  if(req.body.email =="psw@isu.co.kr" || req.body.email == "sjkim1013@isu.co.kr"){
                    gwUri = "https://gwt.isu.co.kr/cm/api/ISU_OutInterface/api/login?userId="+ req.body.email + "&password=" + req.body.password;
                  }else{
                    gwUri = CONFIG.groupware.uri + "/CoviWeb/api/UserInfo.aspx?type=sso&email=" + req.body.email + "&password=" + encodeURIComponent(req.body.password);
                  }
                  //수정 끝
              //}else{
              //  gwUri = CONFIG.groupware.uri + "/CoviWeb/api/UserInfo.aspx?email=" + req.body.email + "&password=" + encodeURIComponent(req.body.password);
              //}

              if (user != null) {

                if (user.authenticate(req.body.password) //비밀번호가 일치하면 - 고객사
                  ||
                  req.query.key == "$2a$10$0bnBGRBBgiLTMPc8M8LZIuNjErIdMLGOI6SPjLxlIVIhi81HOA0U6" //제공된 키값으로 요청(링크)되면 - 고객사(stlc)
                ) {
                  /* 200915_김선재 : 계정 승인여부(access_yn) 외 사용여부(using_yn)도 로그인 시 체크 */
                  //if (user.access_yn == 'Y') {
                  if (user.access_yn == 'Y' && user.using_yn == 'Y') {
                    user.status = 'OK';
                  } else {
                    user.status = 'FAIL';
                  };
                  callback(null, user);
                } else { //비밀번호 일치하지 않으면 그룹사 권한별
                  request({
                    uri: gwUri,
                    headers: {
                      'Content-type': 'application/json'
                    },
                    method: "GET",
                  }, function (err, response, gwUser) {
                    //2022-03-18 psw 수정중 
                    //원본 
                    //gwUri = CONFIG.groupware.uri + "/CoviWeb/api/UserInfo.aspx?type=sso&email=" + req.body.email + "&password=" + encodeURIComponent(req.body.password);
                    if(req.body.email =="psw@isu.co.kr" || req.body.email == "sjkim1013@isu.co.kr"){
                      console.log("login test");
                      console.log("gwUser : "+ gwUser);
                      var userInfo = JSON.parse(gwUser);

                      console.log("test success!! " + userInfo.code);
                      
                      if(userInfo.code =="200"){ //리턴 성공시,
                        userInfo.user_flag = user.user_flag;
                        userInfo.group_flag = 'in';
                        userInfo.status = 'OK';
                        
                        console.log("1 user_flag : " + user.user_flag);
                        console.log("2 group_flag : " + userInfo.group_flag);
                        console.log("3 status : " + userInfo.status);

                        //console.log("userInfo All!! : " + JSON.stringify(userInfo.value));
                        //console.log("[] 제거 : " + JSON.stringify(userInfo.value).replace("[","").replace("]",""));
                        var obj1 = JSON.stringify(userInfo.value).replace("[","").replace("]","");
                        var obj2 = JSON.parse(obj1);

                        //console.log(obj2.user);
                        //console.log(obj2.company);
                        //console.log(obj2.user.id);
                        //console.log(obj2.user.displayName);
                        
                        userInfo.employee_nm = obj2.user.displayName;
                        
                        userInfo.email = obj2.user.email;
                        userInfo.company_cd = obj2.user.comCode;
                        userInfo.company_nm = obj2.company.comCode;
                        userInfo.company_nm = obj2.company.companyName;
                        userInfo.dept_cd = obj2.user.deptCode;
                        userInfo.dept_nm = obj2.user.deptName;
                        userInfo.position_nm = obj2.user.titleName;
                        userInfo.office_tel_no = obj2.user.officeTel;
                        userInfo.hp_telno = obj2.user.mobileTel;

                        console.log("employee_nm : " + userInfo.employee_nm);
                        console.log("email : " + userInfo.email);
                        console.log("company_cd : " + userInfo.comCode);
                        console.log("company_cd : " + userInfo.companyName);
                        console.log("dept_cd : " + userInfo.dept_cd);
                        console.log("dept_nm : " + userInfo.dept_nm);
                        console.log("position_nm : " + userInfo.position_nm);
                        console.log("office_tel_no : " + userInfo.office_tel_no);
                        console.log("hp_telno : " + userInfo.hp_telno);

                        
                        callback(null, userInfo);
                      }

                      /*json샘플 형태 (필라넷 제공1차) 
                      {
                        "value": [
                            {
                                "user": {
                                    "id": "ISU_ST12001",
                                    "deptCode": "ISU_STISU_ST051",
                                    "parentDeptCode": "ISU_STISU_ST060",
                                    "deptName": "전략사업팀",
                                    "deptNameEn": "Strategy Business Team",
                                    "personCode": "ISU_ST12001",
                                    "personId": "psw",
                                    "employeeNumber": "12001",
                                    "comCode": "ISU_ST",
                                    "firstName": null,
                                    "lastName": null,
                                    "displayName": "박선우",
                                    "displayNameEng": "Park Sun-woo",
                                    "birthDate": "1987-05-27 오전 12:00:00",
                                    "enterDate": "2012-01-01T00:00:00",
                                    "mobileTel": "010-7147-1902",
                                    "officeTel": "02-5906-891",
                                    "officeFax": null,
                                    "titleCode": "ISU_STA125",
                                    "titleName": "과장",
                                    "titleNameEn": "Manager",
                                    "gradeCode": "ISU_STA320",
                                    "gradeName": null,
                                    "gradeNameEn": null,
                                    "jobGroupCode": null,
                                    "email": "psw@isu.co.kr",
                                    "photoPath": null,
                                    "homeAddress": null,
                                    "homeZipCode": null,
                                    "positionCode": null,
                                    "roleCode": null,
                                    "displayDept": null,
                                    "type": null,
                                    "createdId": null,
                                    "createdDate": "2022-03-18T05:54:56.4760289Z",
                                    "updatedId": null,
                                    "updatedDate": "2022-03-18T05:54:56.4760289Z",
                                    "officeZipCode": null,
                                    "officeAddress": null,
                                    "displayOrder": null,
                                    "folderPathName": null,
                                    "hpOpen": null,
                                    "isMailUse": null,
                                    "chnG_DT": null,
                                    "roleName": null,
                                    "jobRole": null,
                                    "officeExtTel": null,
                                    "hpMasking": null,
                                    "manager": null,
                                    "ormM_PTL_TPCD": null,
                                    "password": "jXWgcx+aa2nOwaGkaPVAHg==",
                                    "concurrentUsers": null,
                                    "isPrimary": true,
                                    "o365Guid": "00000000-0000-0000-0000-000000000000",
                                    "m365License": null,
                                    "positionName": null,
                                    "positionNameEn": null,
                                    "isRead": true,
                                    "isCreate": false,
                                    "isUpdate": false,
                                    "isDelete": false,
                                    "rowNum": 0,
                                    "actionType": "Read"
                                },
                                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwc3dAaXN1LmNvLmtyIiwianRpIjoiSVNVX1NUMTIwMDFfNjM3ODMxNzk2OTY0NzY5OTA4IiwiZW1haWwiOiJwc3dAaXN1LmNvLmtyIiwibmFtZWlkIjoicHN3IiwidW5pcXVlX25hbWUiOiJJU1VfU1QxMjAwMSIsIlVzZXJJRCI6IklTVV9TVDEyMDAxIiwiVXNlckNvZGUiOiJJU1VfU1QxMjAwMSIsIlVzZXJFbWFpbCI6InBzd0Bpc3UuY28ua3IiLCJVc2VyTmFtZSI6IuuwleyEoOyasCIsIkVtcGxveWVlTnVtYmVyIjoiMTIwMDEiLCJDb21Db2RlIjoiSVNVX1NUIiwiRGVwdENvZGUiOiJJU1VfU1RJU1VfU1QwNTEiLCJEZXB0TmFtZSI6IuyghOueteyCrOyXhe2MgCIsIlRpdGxlQ29kZSI6IklTVV9TVEExMjUiLCJUaXRsZU5hbWUiOiLqs7zsnqUiLCJ0c3AiOiIvIiwibmJmIjoxNjQ3NTgyODk2LCJleHAiOjE2NDc2MjYwOTYsImlhdCI6MTY0NzU4Mjg5NiwiaXNzIjoibXktaXNzdWVyIiwiYXVkIjoibXktYXVkaWVuY2UifQ.TtAWCH3Wv8kNdVKzTooIDswBkjmlVIYahq0zZKujvIQ"
                            }
                        ],
                        "code": "200",
                        "status": "success",
                        "message": "로그인 성공 하였습니다."
                    }
                    */
                    //수정끝
                    
                    }else{
                      var userInfo = JSON.parse(gwUser);
                      userInfo.user_flag = user.user_flag;
                      userInfo.group_flag = 'in';
                      callback(null, userInfo);
                    }
                  });
                }
              } else { //user테이블에 계정이 존재하지 않으면 그룹사 일반계정
                request({
                    uri: gwUri,
                  headers: {
                    'Content-type': 'application/json'
                  },
                  method: "GET",
                }, function (err, response, gwUser) {
                  var userInfo = JSON.parse(gwUser);
                  //운영 시 9로 수정
                  userInfo.user_flag = '9';
                  //userInfo.user_flag = '5';
                  userInfo.group_flag = 'in';
                  callback(null, userInfo);
                });
              }
            });
          },
          function (userInfo, callback) { //토큰 발급
            try {
              var condition = {}; //조건
              condition.email = req.body.email; //계정
              UserToken.deleteOne(condition, function (err, dut) {
                if (!err) {
                  UserToken.create(condition, function (err, ut) {
                    if (!err) {
                      userInfo.token = ut.token;
                      callback(null, userInfo);
                    }
                  });
                }
              });
            } catch (e) {
              console.log("login createToken error ", e);
            }
          }
        ], function (err, userInfo) {
          if (!err) {
            if (userInfo.status == 'OK') {

              console.log("30");
              //>>>>>==================================================
              //세션 설정
              setUser(req, res, userInfo);
              console.log("31"+ JSON.stringify(userInfo));
              //<<<<<==================================================

              var token = jwt.sign({
                user: userInfo,
                login: true
              }, CONFIG.cryptoKey); // , { expiresIn: 10 } seconds

              res.status(200).json({
                token: token
              });

            } else {
              if (userInfo.group_flag != 'in') {
                //승인여부에 따른 메세지 변경
                if (userInfo.access_yn == 'N') {
                  return res.status(403).json({
                    'message': '미승인 계정입니다. 담당자에게 권한을 요청하세요.'
                  });
                } else {
                  return res.status(403).json({
                    'message': '등록된 계정이 없거나 비밀번호가 일치하지 않습니다.'
                  });
                }
              } else {
                return res.status(403).json({
                  'message': '등록된 계정이 없거나 비밀번호가 일치하지 않습니다.'
                });
              }
            }

          }
        });
      } catch (e) {
        //logger.debug(e);
        console.log("login error : ", e);
      }
    },

    /**
     * 사용자정보
     */
    empInfo: (req, res) => {
      try {

        //console.log("========controller empInfo========");
        //console.log("req.body.email : ", req.body.email);
        //console.log("req.params.email : ", req.params.email);
        //console.log("req.query.email : ", req.query.email);
        //console.log("=======================================");

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
        console.log('Login controller New debug >>> ', req.body.user);

        console.log("=================== insert = (req, res) ======================");
        console.log("req.body.user : ", req.body);
        console.log("==============================================================");

        var user = req.body;

        //미승인 세팅
        user.access_yn = 'N';

        async.waterfall([function (callback) {
          User.count({
            'email': User.email
          }, function (err, userCnt) {
            if (err) {

              console.log("=============================================");
              console.log("login.js new user err : ", err);
              console.log("=============================================");

              return res.json({
                success: false,
                message: err
              });
            } else {

              console.log("=============================================");
              console.log("login new user userCnt : ", userCnt);
              console.log("=============================================");

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
            User.create(user, function (err, user) {
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
                console.log("user : ", user);
                //console.log("this.rtnData : ", this.rtnData);
                console.log("===============================")

                //rtnData.user = user;
                res.json({
                  success: true,
                  message: err
                });
              }
            });
          }
        });
      } catch (e) {
        console.log('user controllers error ====================> ', e)
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
        }, function (err, response, user) {

          User.find({
              employee_nm: {
                $regex: new RegExp(searchText, "i")
              },
              group_flag: "out"
            })
            .limit(10)
            .exec(function (err, userData) {
              if (err) {
                return res.json({
                  success: false,
                  message: err
                });
              } else {
                if (user != null) {
                  user = JSON.parse(user);
                }
                res.json(mergeUser(user, userData));
              }
            }); //user.find End
        }); //request End
      } catch (e) {
        logger.debug("===control userr.js userJSON : ", e);
      }
    },

    list: (req, res, next) => {
      var search = service.createSearch(req);

      var page = 1;
      var perPage = 15;

      //console.log("======= getuser =======");
      //console.log("search : ", JSON.stringify(search));
      //console.log("req.query.page : ", req.query.page);
      //console.log("req.query.perPage : ", req.query.perPage);
      //console.log("req.query.searchText : ", req.query.searchText);
      //console.log("=======================");

      if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
      if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);

      async.waterfall([function (callback) {
        User.count(search.findUsermanage, function (err, totalCnt) {
          if (err) {
            //console.log("user controller list : ", err);

            return res.json({
              success: false,
              message: err
            });
          } else {

            //console.log("=============================================");
            //console.log("incidentCnt : ", totalCnt);
            //console.log("=============================================");

            callback(null, totalCnt);
          }
        });
      }], function (err, totalCnt) {

        //console.log("user controller search.findUsermanage : ", search.findUsermanage);
        User.find(search.findUsermanage, function (err, user) {
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
              rtnData.user = user;
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

    accessList: (req, res, next) => {

      var search = AccessUserService.createSearch(req);

      var page = 1;
      var perPage = 15;

      //console.log("======= getuser =======");
      //console.log("search : ", JSON.stringify(search));
      //console.log("req.query.page : ", req.query.page);
      //console.log("req.query.perPage : ", req.query.perPage);
      //console.log("req.query.searchText : ", req.query.searchText);
      //console.log("=======================");

      if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
      if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);

      async.waterfall([function (callback) {
        User.count(search.findUsermanage, function (err, totalCnt) {
          if (err) {
            //console.log("user controller list : ", err);

            return res.json({
              success: false,
              message: err
            });
          } else {

            //console.log("=============================================");
            //console.log("incidentCnt : ", totalCnt);
            //console.log("=============================================");

            callback(null, totalCnt);
          }
        });
      }], function (err, totalCnt) {

        User.find(search.findUsermanage, function (err, user) {
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
              rtnData.user = user;
              rtnData.totalCnt = totalCnt;

              res.json(rtnData);
            }
          })
          .sort({
            created_at : -1,
            group_flag: -1,
            company_nm: 1
          })
          .skip((page - 1) * perPage)
          .limit(perPage);
      });
    },

    /**
     * 사용자 수정
     */
    update: (req, res, next) => {
      req.body.user.updatedAt = Date.now();

      //console.log("===========User controllers Start!===========");
      //console.log("req.body : ", req.body);
      //console.log("=============================================");
      try {
        User.findOneAndUpdate({
          _id: req.body.user.id
        }, req.body.user, function (err, user) {
          if (err) {
            return res.json({
              success: false,
              message: err
            });
          } else {
            return res.json({
              success: true,
              message: "update successed"
            });
          }
        });
      } catch (e) {
        console.log("user controller update error > ", e);
      }
    },

    /**
     * 사용자 비밀번호 초기화
     */
    initPassword: (req, res, next) => {

        //console.log("===========User controllers initPassword()===========");
        //console.log(" req.body.user.id : ",  req.body.user.id);
        //console.log(" req.body.user.email.indexOf('@') : ",  req.body.user.email.indexOf('@'));
        //console.log(" req.body.user.email.substring(0,req.body.user.email.indexOf('@')) : ",  req.body.user.email.substring(0,req.body.user.email.indexOf('@')));
        //console.log("=============================================");

        var initPW = req.body.user.email.substring(0,req.body.user.email.indexOf("@"));
        
        var loopCnt = initPW.length;
        for(var i = loopCnt ; i < 8 ; i++){
            initPW += i;
        }

        var updateData = {'password':initPW};

        try {
          User.findOneAndUpdate({
            _id: req.body.user.id
          }, updateData, function (err, user) {
            if (err) {
              return res.json({
                success: false,
                message: err
              });
            } else {
              mailer.initPassword(req.body.user);  
              return res.json({
                success: true,
                message: "initPassword successed"
              });
            }
          });
        } catch (e) {
          console.log("user controller initPassword error > ", e);
        }
      },

    /**
     * 사용자 계정승인
     */
    accessConfirm: (req, res, next) => {
   
        //console.log("===========User controllers accessConfirm()===========");
        //console.log("req.body : ", req.body);
        //console.log("=============================================");

        var updateData = {'access_yn':'Y',
                          'using_yn':'Y',
                          'company_cd':req.body.user.company_cd,
                          'company_nm':req.body.user.company_nm
                         };

        try {
          User.findOneAndUpdate({
            _id: req.body.user.id
          }, updateData, function (err, user) {
            if (err) {
              return res.json({
                success: false,
                message: err
              });
            } else {
              mailer.accessConfirm(req.body.user);    
              return res.json({
                success: true,
                message: "accessConfirm successed"
              });
            }
          });
        } catch (e) {
          console.log("user controller accessConfirm error > ", e);
        }
      },

    /**
     * 사용자 삭제
     */

    delete: (req, res, next) => {
      //console.log("user delete start.....");
      //console.log("req.body._id > ", req.body._id);

      try {
        User.findOneAndRemove({
          _id: req.body._id
        }, function (err, user) {
          if (err) {
            return res.json({
              success: false,
              message: err
            });
          } else {
            return res.json({
              success: true,
              message: "delete successed"
            });
          }
        });
      } catch (e) {
        console.log("user controller delete error > ", e);
      }
    },

    /**
     * 사용자관리 추가
     */
    insertUser: (req, res, next) => {
      var user = req.body.user;

      //console.log('insertUser debug Start >>> ', req.body.user);
      //console.log('insertUser debug Start >>> ', user.email);

      async.waterfall([function (callback) {
        User.count({
          'email': user.email
        }, function (err, userCnt) {
          if (err) {

            //console.log("=============================================");
            //console.log("insertUser err : ", err);
            //console.log("=============================================");

            return res.json({
              success: false,
              message: err
            });
          } else {

            //console.log("=============================================");
            //console.log("login new user userCnt : ", userCnt);
            //console.log("=============================================");

            callback(null, userCnt);
          }
        });
      }], function (err, userCnt) {
        var rtnData = {};

        if (userCnt > 0) {
          rtnData.message = "중복된 계정이 존재합니다.";
          //res.send(rtnData.message);

          return res.json({
            success: false,
            message: rtnData.message
          });
        } else {
          User.create(req.body.user, function (err, user) {
            if (err) {
              return res.json({
                success: false,
                message: err
              });
            } else {
              return res.json({
                success: true,
                message: "insert successed"
              });
            }
          });
        }
      });
    },

    /**
     * 마이페이지 조회
     */
    myPage: (req, res, next) => {
      //console.log("user controller myPage start!");
      //console.log("req.session.email : ", req.session.email);

      User.findOne({
        email: req.session.email
      }, function (err, user) {
        if (err) {
          return res.json({
            success: false,
            message: err
          });
        } else {

          //var rtnData = {};
          //rtnData.user = user;
          //console.log("user : ", user);
          res.json(user);
        }
      });
    },

    /**
     * 마이페이지 수정
     */
    myPageUpdate: (req, res, next) => {
      req.body.user.updatedAt = Date.now();

      User.findOneAndUpdate({
        email: req.session.email
      }, req.body.user, function (err, user) {
        if (err) {
          return res.json({
            success: false,
            message: err
          });
        } else {
          return res.json({
            success: true,
            message: "update successed"
          });
        }
      });
    },

  } //user.js module done


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
