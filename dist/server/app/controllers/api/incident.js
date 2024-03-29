'use strict';

var async = require('async');
var Incident = require('../../models/Incident');
var MyProcess = require('../../models/MyProcess');
var User = require('../../models/User');
var service = require('../../services/incident');
var mailer = require('../../util/nodemailer');
var alimi = require('../../util/alimi');
var CONFIG = require('../../../config/config.json');
var moment = require('moment');
var logger = require('log4js').getLogger('app');
var path = require('path');
var fs = require('fs');

module.exports = {

  /**
   * 인시던트 수정
   */
  update: (req, res, next) => {
    try {
      async.waterfall([function (callback) {

        var upIncident = req.body.incident;

        //logger.debug("========================================================");
        //logger.debug("========================req.body.incident ",req.body.incident);
        //logger.debug("========================================================");


        Incident.findOneAndUpdate({
          _id: req.body.incident._id
        }, upIncident, function (err, Incident) {
          if (!Incident) {
            return res.json({
              success: false,
              message: "No data found to update"
            });
          } else {
            callback(null, upIncident);
          }
        });

      }], function (err, upIncident) {
        if(!req.body.deletefile){
            return res.json({
                success: true,
                message: "수정되었습니다."
            });  
        }  
        fs.unlink(req.body.deletefile, function (err) {
            if (err) {
              logger.debug("incident attach file delete ",err);
            }
            return res.json({
                success: true,
                message: "수정되었습니다."
            });  
          });
      });
    } catch (err) {
      logger.error("incident control update error : ", err);
      return res.json({
        success: false,
        message: err
      });
    }
  },


  /**
   * 상위업무 변경
   */
  setChangeHigher: (req, res, next) => {
    try {
      async.waterfall([function (callback) {

        var upIncident = req.body.incident;

        var m = moment();
        var date = m.format("YYYY-MM-DD HH:mm:ss");

        upIncident.receipt_content = "* 상/하위업무변경 : " + req.session.user_nm + "-" + date;
        //업무변경 시, 상태값 다시 업데이트 (최예화과장 요청)
        upIncident.status_cd = "1";
        upIncident.status_nm = '접수대기';

        upIncident.manager_company_cd = ''; //담당자 회사코드
        upIncident.manager_company_nm = ''; //담당자 회사명
        upIncident.manager_nm = ''; //담당자 명
        upIncident.manager_dept_cd = ''; //담당자 부서코드
        upIncident.manager_dept_nm = ''; //담당자 부서명
        upIncident.manager_position = ''; //담당자 직위명
        upIncident.manager_email = ''; //담당자 이메일
        upIncident.manager_phone = ''; //담당자 전화
        upIncident.receipt_date = ''; //접수일
        upIncident.complete_reserve_date = ''; //완료예정일

        if (!upIncident.lower_cd) {
          upIncident.lower_cd = "";
          upIncident.lower_nm = "";
        }


        callback(null, upIncident);

      }], function (err, upIncident) {

        if (err) {
          res.json({
            success: false,
            message: "No data found to update"
          });
        } else {

          Incident.findOneAndUpdate({
            _id: req.body.incident.id
          }, upIncident, function (err, Incident) {
            if (err) {

              return res.json({
                success: false,
                message: err
              });
            } else {

              //******************************* */
              // SD 업무담당자 사내메신저 호출
              alimi.sendAlimi(req.body.incident.higher_cd);
              //******************************* */

              return res.json({
                success: true,
                message: "update successed"
              });

            }
          });
        }
      });
    } catch (err) {
      logger.error("manager control saveReceipt : ", err);
      return res.json({
        success: false,
        message: err
      });
    }
  },

  /**
   * 접수 처리
   */
  setReceipt: (req, res, next) => {

    try {
      async.waterfall([function (callback) {
        var upIncident = req.body.incident;

        var m = moment();
        var date = m.format("YYYY-MM-DD HH:mm:ss");

        //접수일자 표기 통일하기 위해 수정 (등록일자 형태)

        upIncident.receipt_date = date;
        if (upIncident.complete_reserve_date.length > 10) upIncident.complete_reserve_date = upIncident.complete_reserve_date.substring(0, 10);
        upIncident.complete_reserve_date = upIncident.complete_reserve_date + " " + upIncident.complete_hh + ":" + upIncident.complete_mi + ":" + "00"
        upIncident.status_cd = '2';
        upIncident.status_nm = '처리중';
        

        //접수자 세션체크 후 데이타 맵핑
        upIncident.manager_email = req.session.email;
        upIncident.manager_nm = req.session.user_nm;
        upIncident.manager_company_nm = req.session.company_nm;
        upIncident.manager_dept_nm = req.session.dept_nm;
        upIncident.manager_position = req.session.position_nm;
        upIncident.manager_phone = req.session.office_tel_no;

        callback(null, upIncident);
      }], function (err, upIncident) {
        if (err) {
          res.json({
            success: false,
            message: "No data found to update"
          });
        } else {
          Incident.findOneAndUpdate({
            _id: req.body.incident.id
          }, upIncident, function (err, Incident) {
            if (err) {
              return res.json({
                success: false,
                message: err
              });
            } else {
              /*
               * SD담당자가 GW결재필요 check 후 접수 시 결재프로세스 요청 메일 전송
              */ 
              if(upIncident.gw_link){
                mailer.requestApproval(Incident, upIncident);
                //console.log("qqq");
              }

              //접수 업데이트 성공 시 메일 전송
              User.findOne({
                email: Incident.request_id
              }, function (err, user) {
                if (err) {
                  return res.json({
                    success: false,
                    message: err
                  });
                } else {
                  if (user != null) {
                    if (user.email_send_yn == 'Y') {
                      mailer.receiveSend(Incident, upIncident);
                    }
                  }
                }
              });
              return res.json({
                success: true,
                message: "update successed"
              });
            }
          });
        }
      });
    } catch (err) {
      logger.error("manager control saveReceipt : ", err);
      return res.json({
        success: false,
        message: err
      });
    }
  },

  /**
   * 완료 처리
   */
  setComplete: (req, res, next) => {
    try {
      async.waterfall([function (callback) {
        var upIncident = req.body.incident;

        var m = moment();
        var date = m.format("YYYY-MM-DD HH:mm:ss");

        //upIncident.complete_date = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
        upIncident.complete_date = date;
        upIncident.status_cd = '3';
        upIncident.status_nm = '미평가';

        if (upIncident.complete_open_flag) upIncident.complete_open_flag = "Y";
        else upIncident.complete_open_flag = "N";

        if (upIncident.solution_flag) upIncident.solution_flag = "Y";
        else upIncident.solution_flag = "N";

        // 200410_김선재 : 자체처리여부 체크 추가
        if (typeof upIncident.self_solve_flag == "undefined" || upIncident.self_solve_flag) upIncident.self_solve_flag = "Y";
        else upIncident.self_solve_flag = "N";

        callback(null, upIncident);
      }], function (err, upIncident) {
        if (err) {
          res.json({
            success: false,
            message: "No data found to update"
          });
        } else {
          Incident.findOneAndUpdate({
            _id: req.body.incident.id
          }, upIncident, function (err, Incident) {
            if (err) return res.json({
              success: false,
              message: err
            });
            if (!Incident) {
              return res.json({
                success: false,
                message: "No data found to update"
              });
            } else {
              //완료 업데이트 성공 시 메일 전송
              User.findOne({
                email: Incident.request_id
              }, function (err, user) {
                if (err) {
                  return res.json({
                    success: false,
                    message: err
                  });
                } else {
                  if (user != null) {
                    if (user.email_send_yn == 'Y') {
                      mailer.finishSend(Incident, upIncident);
                    }
                  }
                }
              });
              return res.json({
                success: true,
                message: "update successed"
              });
            }
          });
        }
      });

    } catch (err) {
      logger.error("manager control saveComplete : ", err);
      return res.json({
        success: false,
        message: err
      });
    }
  },

  /**
   * 미완료 처리
   */
  setNComplete: (req, res, next) => {
    try {
      async.waterfall([function (callback) {
        var upIncident = req.body.incident;

        var m = moment();
        var date = m.format("YYYY-MM-DD HH:mm:ss");

        //upIncident.complete_date = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
        upIncident.nc_date = date;
        upIncident.status_cd = '9';
        upIncident.status_nm = '미처리';

        callback(null, upIncident);
      }], function (err, upIncident) {

        Incident.findOneAndUpdate({
          _id: req.body.incident.id
        }, upIncident, function (err, Incident) {
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
      });
    } catch (err) {
      logger.error("manager control saveNComplete : ", err);
      return res.json({
        success: false,
        message: err
      });
    }
  },

  /**
   * 협의처리 처리
   */
  setHold: (req, res, next) => {
    try {
      async.waterfall([function (callback) {
        var upIncident = req.body.incident;

        var m = moment();
        var date = m.format("YYYY-MM-DD HH:mm:ss");

        //upIncident.complete_date = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
        upIncident.hold_date = date;
        upIncident.status_cd = '5';
        upIncident.status_nm = '협의필요';

        callback(null, upIncident);
      }], function (err, upIncident) {

        Incident.findOneAndUpdate({
          _id: req.body.incident.id
        }, upIncident, function (err, Incident) {
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
      });

    } catch (err) {
      logger.error("manager control saveHold : ", err);
      return res.json({
        success: false,
        message: err
      });
    }
  },

  /**
   * 평가점수 업데이트
   */
  setValuation: (req, res, next) => {
    try {
      async.waterfall([function (callback) {
        var upIncident = req.body.incident;
        upIncident.status_cd = '4';
        upIncident.status_nm = '처리완료';
        callback(null, upIncident);
      }], function (err, upIncident) {
        if (err) {
          res.json({
            success: false,
            message: "No data found to update"
          });
        } else {
          Incident.findOneAndUpdate({
            _id: req.body.incident.id
          }, upIncident, function (err, Incident) {
            if (err) {
              return res.json({
                success: false,
                message: err
              });
            }
            if (!Incident) {
              return res.json({
                success: false,
                message: "No data found to update"
              });
            } else {
              //평가 완료 업데이트 성공 시 담당자에게 메일 전송
              User.findOne({
                email: Incident.manager_email
              }, function (err, user) {
                if (err) {
                  return res.json({
                    success: false,
                    message: err
                  });
                } else {
                  if (user != null) {
                    if (user.email_send_yn == 'Y') {
                      mailer.evaluationSend(Incident, upIncident);
                    }
                  }
                }
              });
              return res.json({
                success: true,
                message: "update successed"
              });
            }
          });
        }
      });
    } catch (err) {
      logger.error("incident control valuationSave : ", err);
      return res.json({
        success: false,
        message: err
      });
    }
  },


  /**
   * Incident 리스트 조회
   */
  list: (req, res, next) => {

    var search = service.createSearch(req);

    //logger.debug("=================================================");
    //logger.debug("req.query.page : ", req.query);
    //logger.debug("req.query.page : ", req.query.page);
    //logger.debug("search : ", JSON.stringify(search));
    //logger.debug("=================================================");

    var page = 1;
    var perPage = 15;

    if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
    if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);

    try {
      async.waterfall([function (callback) {

          //callback을 이용한 higher_cd를 가져오기 때문에 service에서 생성 않음
          //전체담당자, 팀장, 업무담당자이고 구분값에 manager로 넘어왔을 시 
          if (req.session.user_flag == "9" || req.query.user == "general"){
              callback(null);
          }else if(req.query.user == "company"){
              callback(null);
          }else if ((req.session.user_flag == "1" && (req.query.user == "manager" || req.query.user == "managerall")) || req.session.user_flag == "3" || req.session.user_flag == "4") {

            var condition = {};
            if (req.query.user != "managerall") {
              condition.email = req.session.email;
            }

            //logger.debug("==========================================================");
            //logger.debug("search.findIncident1 :",JSON.stringify(search.findIncident));
            //logger.debug("==========================================================");

             MyProcess.find(condition).distinct('higher_cd').exec(function (err, myHigherProcess) {
                if (search.findIncident.$and == null) {
                  search.findIncident.$and = [{
                    "higher_cd": {
                      "$in": myHigherProcess
                    }
                  }];
                } else {
                  search.findIncident.$and.push({
                    "higher_cd": {
                      "$in": myHigherProcess
                    }
                  });
                }

                /*
                  PSW 2021-01-21 수정  
                  상위항목은 존재하나, 지정되지 않은 하위항목도 포함시키기 위해 처리 
                */           
                /* 210125_김선재 : lower_cd 찾는 함수와 higher_cd 찾는 함수가 병렬로 돌아 서로 callback 을 호출하는 부분 수정 */
                var condition2 = {};

                if(req.query.email == null){ 
                    condition2.email = req.session.email;
                }else{
                    condition2.email = req.query.email;
                }
                
                MyProcess.find(condition2, function (err, mp) {
                  if (!err) {
                      var rtnArr = [];

                      //비교용 myProcessArr 생성
                      var myProcessArr = getMyprocess(condition2.email, mp);

                      //var lowerArr = [];
                      var lower= [];
                      lower = myProcessArr;

                      if (search.findIncident.$and == null) {
                        search.findIncident.$and = [{
                          "lower_cd": {
                            "$in": lower
                          }
                        }];
                      } else {
                        search.findIncident.$and.push({
                          "lower_cd": {
                            "$in": lower
                          }
                        });
                      }
                    }
                    callback(null);
                });
                //수정 끝

            });

            /*
              220728_김선재 : "긴급" 조회조건 추가
            */
            var urgentYn;
            if(req.query.urgent != null && req.query.urgent == "true") {

              if (search.findIncident.$and == null) {
                search.findIncident.$and = [{
                  "process_speed": "Y"
                }];
              }else {
                search.findIncident.$and.push({
                  "process_speed": "Y"
                });
              }
            }

          }
        },
        function (callback) {
          //logger.debug("================================================================");
          //logger.debug("===================> search.findIncident : ", search.findIncident);
          //logger.debug("================================================================");

          Incident.count(search.findIncident, function (err, totalCnt) {
            if (err) {
              logger.error("incident : ", err);

              return res.json({
                success: false,
                message: err
              });
            } else {
              callback(null, totalCnt);
            }
          });
        }
      ], function (err, totalCnt) {
        console.log("==========================================================");
        console.log("search.findIncident2 :",JSON.stringify(search.findIncident));
        console.log("==========================================================");

        //logger.debug("==========================================================");
        //logger.debug("search.findIncident2 :",JSON.stringify(search.findIncident));
        //logger.debug("==========================================================");

        Incident.find(search.findIncident, function (err, incident) {

            //logger.debug("=================================================");
            //logger.debug("totalCnt : ",totalCnt);
            //logger.debug("(page - 1) * perPage : ",(page - 1) * perPage);
            //logger.debug("perPage : ",perPage);
            //logger.debug("incident : ",incident);
            //logger.debug("=================================================");


            //logger.debug("=================================================");
            //logger.debug("totalCnt : ",totalCnt);
            //logger.debug("(page - 1) * perPage : ",(page - 1) * perPage);
            //logger.debug("perPage : ",perPage);
            //console.log("incident AAAAAAAAAAAAAAAAAAAAAA : ", incident);
            //logger.debug("=================================================");

            if (err) {
              return res.json({
                success: false,
                message: err
              });
            } else {


              //incident에 페이징 처리를 위한 전체 갯수전달
              var rtnData = {};
              rtnData.incident = incident;
              rtnData.totalCnt = totalCnt;
              res.json(rtnData);

            }
          })
          .sort('-register_date')
          .skip((page - 1) * perPage)
          .limit(perPage);
      });
    } catch (err) {
        logger.debug("err : ",err);
    } finally {}

  },

  /**
   * Incident 엑셀데이타 조회
   */
  excelData: (req, res, next) => {

    var search = service.createSearch(req);

    var page = 1;
    var perPage = 10000;

    if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
    if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);

    try {
      async.waterfall([function (callback) {

          //callback을 이용한 higher_cd를 가져오기 때문에 service에서 생성 않음
          //전체담당자, 팀장, 업무담당자이고 구분값에 manager로 넘어왔을 시 
          if (req.query.user == "general"){
                callback(null);
            }else if(req.query.user == "company"){
              //상위업무 'H008'에 대해서는 엑셀다운로드 시, 비공개 값 다운로드 되지 않도록 처리
              if(req.query.higher_cd =='H008'){
                if (search.findIncident.$and == null) {
                  search.findIncident.$and = [{
                      "complete_open_flag": 'Y'
                  }];
                  } else {
                  search.findIncident.$and.push({
                      "complete_open_flag": 'Y'
                  });
                }
              }
              callback(null);
            }else if ((req.session.user_flag == "1" && (req.query.user == "manager" || req.query.user == "managerall")) || req.session.user_flag == "3" || req.session.user_flag == "4") {

            var condition = {};
            if (req.query.user != "managerall") {
                condition.email = req.session.email;
            }

            MyProcess.find(condition).distinct('higher_cd').exec(function (err, myHigherProcess) {
                if (search.findIncident.$and == null) {
                search.findIncident.$and = [{
                    "higher_cd": {
                    "$in": myHigherProcess
                    }
                }];
                } else {
                search.findIncident.$and.push({
                    "higher_cd": {
                    "$in": myHigherProcess
                    }
                });
                }
                callback(null);
            });
          }

        },
        function (callback) {
          Incident.count(search.findIncident, function (err, totalCnt) {
            if (err) {
              logger.error("incident : ", err);

              return res.json({
                success: false,
                message: err
              });
            } else {
              callback(null, totalCnt);
            }
          });
        }
      ], function (err, totalCnt) {

        var project = {};

        if(req.session.user_flag == "5"){
            project ={
                /* 190904_김선재 : 최재준차장님 요청, 엑실 다운로드시 "_id"열 출력 안되도록 */
            	_id: 0, //_id: '$_id', 
                진행상태: '$status_nm',
                상위업무: '$higher_nm',
                하위업무: '$lower_nm',
                요청자이름: '$request_nm',
                요청자회사: '$request_company_nm',
                요청자부서: '$request_dept_nm',
                등록일자: '$register_date',
                완료일자: '$complete_date',
                요청제목: '$title',
                고객요청내용: '$content',
                담당자이름: '$manager_nm',
                처리내용: '$complete_content',
                공개여부: '$complete_open_flag'
              };
        }else{
            project ={
                /* 190904_김선재 : 최재준차장님 요청, 엑실 다운로드시 "_id"열 출력 안되도록 */
            	_id: 0, //_id: '$_id',
            	진행상태: '$status_nm',
                상위업무: '$higher_nm',
                하위업무: '$lower_nm',
                요청자이름: '$request_nm',
                요청자회사: '$request_company_nm',
                요청자부서: '$request_dept_nm',
                등록일자: '$register_date',
                완료일자: '$complete_date',
                요청제목: '$title',
                고객요청내용: '$content',
                담당자이름: '$manager_nm',
                처리내용: '$complete_content',
                처리소요시간: '$work_time',
                //2022-05-25 psw 추가 : 페타시스 내부회계 요청
                처리구분 : '$process_nm',
                programID : '$program_id',
                //내부공유사항: '$sharing_content'
                등록번호: '$register_num'
              };
        }

        var aggregatorOpts = [{
          $match: search.findIncident
        }, {
          $project: project
        },{
          $sort: {
            "등록일자": -1
          }
        }];
       
        /*, {
          $sort: {
            "등록일자": -1
          }
        }];*/
        /**
        *db.stocks.aggregate()
            [
              { $project : { cusip: 1, date: 1, price:1, _id: 0 } },
              { $sort : { cusip : 1, date: 1 } }
            ],
            {
              allowDiskUse: true
            }
          )
        */

        console.log("==================================================");
        console.log("aggregatorOpts : " , JSON.stringify(aggregatorOpts));
        console.log("==================================================");
        
        Incident.aggregate(aggregatorOpts).allowDiskUse(true).exec(function (err, incident) {
        //Incident.aggregate(aggregatorOpts).exec(function (err, incident) {
          if (err) {
            return res.json({
              success: false,
              message: err
            });
          } else {
            //incident에 페이징 처리를 위한 전체 갯수전달
            var rtnData = {};
            rtnData.incident = incident;
            rtnData.totalCnt = totalCnt;
            res.json(rtnData);
          }
        });
      });
    } catch (err) {} finally {}

  },


  /**
   * Incident 상세 JSON 데이타 조회
   */
  detail: (req, res, next) => {

    try {
      var id = req.query.incident_id;
      Incident.findById({
        _id: id
      }, function (err, incident) {
        if (err) {
          return res.json({
            success: false,
            message: err
          });
        } else {
          //path 길이 잘라내기

          if (incident.attach_file.length > 0) {
            for (var i = 0; i < incident.attach_file.length; i++) {

              if (path.indexOf(CONFIG.fileUpload.directory) > -1) {
                incident.attach_file[i].path = path.substring(path.indexOf(CONFIG.fileUpload.directory) + CONFIG.fileUpload.directory.length + 1);
              } else {
                incident.attach_file[i].path = incident.attach_file[i].path + "/" + incident.attach_file[i].filename;
              }

              //logger.debug("=============================================");
              //logger.debug("incident.attach_file[i].path 2 : ", incident.attach_file[i].path);
              //logger.debug("incident.attach_file[i].filename 2 : ", incident.attach_file[i].filename);
              //logger.debug("incident.attach_file[i].originalname 2 : ", incident.attach_file[i].originalname);
              //logger.debug("=============================================");

              if (incident.attach_file[i].mimetype != null && incident.attach_file[i].mimetype.indexOf('image') > -1) {
                incident.attach_file[i].mimetype = 'image';
              }

            }
          }
          res.json(incident);
        }
      });
    } catch (e) {
      //logger.debug('****************', e);
    }
  },


  /**
   * 문의하기 등록
   */
  insert: (req, res) => {

    //logger.debug("================== incident insert (req, res) ======================");
    //logger.debug("xxxx req.session : ", req.session);
    //logger.debug("req.body.incident : ", req.body.incident);
    //logger.debug("req.body.incident.title : ", req.body.incident.title);
    //logger.debug("=============================================================");

    async.waterfall([function (callback) {

      var newincident = req.body.incident;
      var request_info = req.body.request_info;

      //logger.debug("newincident ", newincident);
      //logger.debug("req.body.request_info ", req.body.request_info);

      //TODO
      //추가수정
      if (request_info == null) {
        newincident.request_company_cd = req.session.company_cd;
        newincident.request_company_nm = req.session.company_nm;
        newincident.request_dept_nm = req.session.dept_nm;
        newincident.request_nm = req.session.user_nm;
        newincident.request_id = req.session.email;
      } else {
        newincident.request_company_cd = request_info.company_cd;
        newincident.request_company_nm = request_info.company_nm;
        newincident.request_dept_nm = request_info.dept_nm;
        newincident.request_nm = request_info.employee_nm;
        newincident.request_id = request_info.email;
      }

      //추가수정
      newincident.register_company_cd = req.session.company_cd;
      newincident.register_company_nm = req.session.company_nm;
      newincident.register_nm = req.session.user_nm;
      newincident.register_sabun = req.session.email;

      //if (req.files) {
      //    newincident.attach_file = req.files;
      //}

      //logger.debug("xxxxxxxxxxxxx newincident : ", newincident);

      Incident.create(newincident, function (err, newincident) {
        if (err) {
          //logger.debug("trace err ", err);
          res.send({
            gubun: err
          });
        }

        //////////////////////////////////////
        // SD 업무담당자 사내메신저 호출
        alimi.sendAlimi(req.body.incident.higher_cd);
        //////////////////////////////////////

        callback(null);
      });
    }], function (err) {
      res.json({
        gubun: 'Y'
      });
    });
  },


  /**
   * incident 삭제 
   */
  delete: (req, res, next) => {

    try {
      async.waterfall([function (callback) {

        var upIncident = {};
        var m = moment();
        var date = m.format("YYYY-MM-DD HH:mm:ss");

        upIncident.deleted_at = date;
        upIncident.delete_flag = 'Y';

        callback(null, upIncident);
      }], function (err, upIncident) {
        Incident.findOneAndUpdate({
          _id: req.body.id
        }, upIncident, function (err, Incident) {
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
      });

    } catch (err) {
      logger.error("incident deleted err : ", err);
      return res.json({
        success: false,
        message: err
      });
    }


    /*
    Incident.findOneAndRemove({
      _id: req.body.id
      //,author: req.user._id
    }, function (err, incident) {
      if (err) return res.json({
        success: false,
        message: err
      });
      if (!incident) return res.json({
        success: false,
        message: "No data found to delete"
      });
      res.json(incident);
    });
    */
  },


  /**
   * 첨부파일 다운로드
   */
  download: (req, res, next) => {

    var tmpPath = req.body.filepath;
    tmpPath = tmpPath.substring(tmpPath.indexOf(CONFIG.fileUpload.directory) + CONFIG.fileUpload.directory.length + 1);

    var filepath = path.join(__dirname, '../../../../../', CONFIG.fileUpload.directory, tmpPath);
    res.download(filepath, req.body.filename);

  },

  /**
   * Dashboard용 Incident 리스트 조회
   */
  dashboard_list: (req, res, next) => {

    var condition = {};
    
    if (req.query.request_company_cd != null && req.query.request_company_cd != '*') {
      condition.request_company_cd = req.query.request_company_cd;
    }

    if (req.query.higher_cd != null && req.query.higher_cd != '*') {
      condition.higher_cd = req.query.higher_cd;
    }

    if (req.query.register_yyyy != null && req.query.register_yyyy != '*') {
      condition.register_yyyy = req.query.register_yyyy;
    }
    
    if (req.query.register_mm != null && req.query.register_mm != '*') {
      condition.register_mm = req.query.register_mm;
    }

    if (req.query.valuation != null && req.query.valuation != '*') {
      condition.valuation = Number(req.query.valuation);
    }
    
    if (req.query.status_cd != null && req.query.status_cd != '*') {
      condition.status_cd = req.query.status_cd;
    }

    if (req.query.manager_email != null && req.query.manager_email != '*') {
        condition.manager_email = req.query.manager_email;
    }

    if (req.query.request_id != null && req.query.request_id != '*') {
        condition.request_id = req.query.request_id;
    }  

    //logger.debug("=================================================");
    //logger.debug("req.query : ", req.query);
    //logger.debug("req.query.page : ", req.query.page);
    //logger.debug("search : ", JSON.stringify(search));
    //logger.debug("=================================================");

    //logger.debug("================================================================");
    //logger.debug("===================> condition : ", JSON.stringify(condition));
    //logger.debug("================================================================");

    var page = 1;
    var perPage = 15;

    if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
    if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);

    try {
      async.waterfall([function (callback) {

          
          Incident.count(condition, function (err, totalCnt) {
            if (err) {
              logger.error("incident : ", err);

              return res.json({
                success: false,
                message: err
              });
            } else {
              callback(null, totalCnt);
            }
          });
        }
      ], function (err, totalCnt) {

        //logger.debug("=================================================");
        //logger.debug("totalCnt : ",totalCnt);
        //logger.debug("=================================================");

        Incident.find(condition, function (err, incident) {

            //logger.debug("=================================================");
            //logger.debug("totalCnt : ",totalCnt);
            //logger.debug("(page - 1) * perPage : ",(page - 1) * perPage);
            //logger.debug("perPage : ",perPage);
            //logger.debug("incident : ",incident);
            //logger.debug("=================================================");

            if (err) {
              return res.json({
                success: false,
                message: err
              });
            } else {

              //incident에 페이징 처리를 위한 전체 갯수전달
              var rtnData = {};
              rtnData.incident = incident;
              rtnData.totalCnt = totalCnt;
              
              //logger.debug("=================================================");
              //logger.debug("rtnData : ",rtnData);
              //logger.debug("=================================================");

              res.json(rtnData);

            }
          })
          .sort('-register_date')
          .skip((page - 1) * perPage)
          .limit(perPage);
      });
    } catch (err) {
        logger.debug("err : ",err);
    } finally {}

  },

}

/**
 * 본인 하위 업무 조회
 * @param {*} email 
 * @param {*} userInfo 
 */
function getMyprocess(email, processInfo) {

    var rtnArr = [];
    var i=0;

    processInfo.forEach((ps) => {
        if (ps.email == email) {
          i++;
        rtnArr.push(ps.lower_cd);
        }
    });
    /*
      PSW 2021-01-21 수정  
      상위항목은 존재하나, 지정되지 않은 하위항목도 포함시키기 위해 처리 
    */
    i =0;
    
    if(i==0){
      rtnArr.push(null);
    }
    
    if(i==0){
      rtnArr.push("");
    }
    
    return rtnArr;

}