'use strict';

var async = require('async');
var Incident = require('../../models/Incident');
var MyProcess = require('../../models/MyProcess');
var service = require('../../services/incident');
var CONFIG = require('../../../config/config.json');
var logger = require('log4js').getLogger('app');
var path = require('path');

module.exports = {

  /**
   * 평가점수 업데이트
   */
  putValuation: (req, res, next) => {

    console.log("putValuation ======================================================");
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.query : ", req.query);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.params : ", req.params);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.body : ", req.body);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx  req.body : ", req.body.incident.id);
    console.log("==================================================================");

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
              /*
              Usermanage.findOne({
                  email: Incident.manager_email
              }, function (err, usermanage) {
                  if (err) {
                      return res.json({
                          success: false,
                          message: err
                      });
                  } else {
                      if(usermanage != null){
                          if (usermanage.email_send_yn == 'Y') {
                              mailer.evaluationSend(Incident, upIncident);
                          }
                      }
                  }
              });
              */
              return res.json({
                success: true,
                message: "update successed"
              });
            }
          });
        }
      });
    } catch (e) {
      logger.error("incident control valuationSave : ", e);
      return res.json({
        success: false,
        message: err
      });
    }
  },


  /**
   * 사용자 본인 Incident 조회
   */
  userlist: (req, res, next) => {

    var search = service.createSearch(req);

    if (search.findIncident.$and == null) {
      search.findIncident.$and = [{
        "request_id": req.session.email
      }];
    } else {
      search.findIncident.$and.push({
        "request_id": req.session.email
      });
    }

    var page = 1;
    var perPage = 3;

    //console.log("=============================================");
    //console.log("req.query.page : ", req.query.page);
    //console.log("req.query.perPage : ", req.query.perPage);
    //console.log("=============================================");

    if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
    if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);

    //console.log("=============================================");
    //console.log("search.findIncident : ", JSON.stringify(search.findIncident));
    //console.log("=============================================");

    try {
      async.waterfall([function (callback) {
        Incident.count(search.findIncident, function (err, totalCnt) {

          if (err) {
            return res.json({
              success: false,
              message: err
            });
          } else {
            callback(null, totalCnt);
          }
        })
      }], function (err, totalCnt) {

        Incident.find(search.findIncident, function (err, incident) {
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
    } catch (err) {} finally {}

  },


  /**
   * 문의리스트 조회
   */
  incidnetList: (req, res, next) => {
    try {
            
        if (req.session.user_flag == '9') {
            Incident.find({
                request_id: req.session.email
            }, function (err, incident) {

                //logger.debug("======================================");
                //logger.debug("incident : ", incident);
                //logger.debug("======================================");

                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    res.json(incident);
                }
            }).sort('-register_date')
                .limit(10);
        } else if (req.session.user_flag == '5') {

            Incident.find({
                request_company_cd: req.session.company_cd
            }, function (err, incident) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    res.json(incident);
                }
            }).sort('-register_date')
                .limit(10);

        } else if (req.session.user_flag == '4') {

            var AndQueries = [];
            var condition = {};
            var condition2 = {};
            condition2.email = req.session.email;

            async.waterfall([function (callback) {
                MyProcess.find(condition2).distinct('higher_cd').exec(function (err, myHigherProcess) {

                    //logger.debug("======================================");
                    //logger.debug("condition2 : ", condition2);
                    //logger.debug("======================================");

                    if (condition.$and == null) {
                        condition.$and = [{
                            "higher_cd": {
                                "$in": myHigherProcess
                            }
                        }];
                    } else {
                        condition.$and.push({
                            "higher_cd": {
                                "$in": myHigherProcess
                            }
                        });
                    }

                    callback(null, myHigherProcess)

                }).sort('-register_date')
                    .limit(10);
            }], function (err, myHigherProcess) {

                Incident.find(condition, function (err, incident) {

                    //logger.debug("======================================");
                    //logger.debug("incident : ", incident);
                    //logger.debug("======================================");

                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else {
                        res.json(incident);
                    }
                }).sort('-register_date')
                    .limit(10);
            });
        } else if (req.session.user_flag == '3') {

            Incident.find({
                manager_dept_cd: req.session.dept_cd
            }, function (err, incident) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    res.json(incident);
                }
            }).sort('-register_date')
                .limit(10);

        } else if (req.session.user_flag == '1') {

            Incident.find({}, function (err, incident) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    res.json(incident);
                }
            }).sort('-register_date')
                .limit(10);

        } else {

            Incident.find({
                manager_email: req.session.email
            }, function (err, incident) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    res.json(incident);
                }
            }).sort('-register_date')
                .limit(10);

        }
    } catch (e) {

    }
  },


  /**
   * Incident 상세 JSON 데이타 조회
   */
  detail: (req, res, next) => {

    try {
      Incident.findById({
        _id: req.query.incident_id
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
              var path = incident.attach_file[i].path
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

  insert: (req, res) => {

    console.log("================== insert = (req, res) ======================");
    console.log("xxxx req.session : ", req.session);
    //console.log("req.body.incident : ", req.body.incident);
    console.log("=============================================================");

    async.waterfall([function (callback) {

      var newincident = req.body.incident;

      //const a = JSON.parse(req.query.aa);
      //console.log("zzzzzzzz ",a.a);
      //console.log("zzzzzzzz ",req.query.aa);

      //TODO
      //추가수정
      newincident.request_company_cd = req.session.company_cd;
      newincident.request_company_nm = req.session.company_nm;
      newincident.request_dept_nm = req.session.dept_nm;
      newincident.request_nm = req.session.user_nm;
      newincident.request_id = req.session.email;

      //추가수정
      newincident.register_company_cd = req.session.company_cd;
      newincident.register_company_nm = req.session.company_nm;
      newincident.register_nm = req.session.user_nm;
      newincident.register_id = req.session.email;

      //if (req.files) {
      //    newincident.attach_file = req.files;
      //}
      Incident.create(newincident, function (err, newincident) {
        if (err) {
          console.log("trace err ", err);
          res.send({
            gubun: err
          });
        }

        //////////////////////////////////////
        // SD 업무담당자 사내메신저 호출
        //alimi.sendAlimi(req.body.incident.higher_cd);
        //////////////////////////////////////

        callback(null);
      });
    }], function (err) {
      console.log("trace 111");
      res.send({
        gubun: 'Y'
      });
    });
  },

  /**
   * incident 삭제 
   */
  delete: (req, res, next) => {

    console.log("xxxxxxxxxxxxxxxxx",req.body.id);

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
  },


  /*
  list : (req, res) => {

      console.log("================== list = (req, res) ======================");
      console.log("xxxx req.session : ",req.session);
      //console.log("req.body.incident : ", req.body.incident);
      console.log("=============================================================");

      var search = service.createSearch(req);
      var page = 1;
      var perPage = 15;

      if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
      if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);

      //logger.debug("===============search control================");
      //logger.debug("req.query.higher_cd : ", req.query.higher_cd);
      //logger.debug("req.query.lower_cd : ", req.query.lower_cd);
      //logger.debug("search.findIncident : ", JSON.stringify(search.findIncident));
      //logger.debug("=============================================");

      try {

          async.waterfall([function (callback) {

              //상위업무가 전체이고, SD 담당자일때만 나의 상위 업무만 조회
              if (req.session.user_flag == "1" || req.session.user_flag == "4" || (req.query.user == "manager" && req.session.user_flag == "3")) {

                  var condition = {};
                  condition.email = req.session.email;

                  MyProcess.find(condition).distinct('higher_cd').exec(function (err, myHigherProcess) {

                      if (search.findIncident.$and == null) {

                          //logger.debug("=============================================");
                          //logger.debug("search.findIncident.$and is null : ", myHigherProcess);
                          //logger.debug("=============================================");

                          search.findIncident.$and = [{
                              "higher_cd": {
                                  "$in": myHigherProcess
                              }
                          }];
                          //{"$and":[{"higher_cd":{"$in":["H004","H006","H012","H024","H001"]}}]}
                          
                          if(req.query.status_cd != "1" && req.query.status_cd != "5"){
                              search.findIncident.$and.push({"manager_email":req.session.email})
                          }


                      } else {

                          //logger.debug("=============================================");
                          //logger.debug("search.findIncident.$and is not null : ", myHigherProcess);
                          //logger.debug("=============================================");

                          search.findIncident.$and.push({
                              "higher_cd": {
                                  "$in": myHigherProcess
                              }
                          });
                          
                          if(req.query.status_cd != "1" && req.query.status_cd != "5"){
                              search.findIncident.$and.push({"manager_email":req.session.email})
                          }

                          //'$and': [ { lower_cd: 'L004' } ] }
                      }

                      logger.debug("getIncident =============================================");
                      logger.debug("page : ", page);
                      logger.debug("perPage : ", perPage);
                      logger.debug("req.query.perPage : ", req.query.perPage);
                      logger.debug("search.findIncident : ", JSON.stringify(search.findIncident));
                      logger.debug("getIncident =============================================");

                      callback(err);
                  });
              } else {
                  callback(null);
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

                      //logger.debug("=============================================");
                      //logger.debug("incidentCnt : ", totalCnt);
                      //logger.debug("=============================================");

                      callback(null, totalCnt)
                  }
              });
          }
      ], function (err, totalCnt) {

          Incident.find(search.findIncident, function (err, incident) {
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
                      rtnData.incident = incident;
                      rtnData.totalCnt = totalCnt

                      //logger.debug("=============================================");
                      //logger.debug("rtnData.totalCnt : ", rtnData.totalCnt);
                      //logger.debug("rtnData : ", JSON.stringify(rtnData));
                      //logger.debug("=============================================");

                      res.json(rtnData);

                  }
              })
              .sort('-register_date')
              .skip((page - 1) * perPage)
              .limit(perPage);
          });
      } catch (err) {

          //logger.debug("===============search control================");
          //logger.debug("search list error : ", err);
          //logger.debug("=============================================");

      } finally {}
  },
  */

  download: (req, res, next) => {

    var tmpPath = req.body.filepath;
    tmpPath = tmpPath.substring(tmpPath.indexOf(CONFIG.fileUpload.directory) + CONFIG.fileUpload.directory.length + 1);

    var filepath = path.join(__dirname, '../../../../../', CONFIG.fileUpload.directory, tmpPath);
    res.download(filepath, req.params.filename);

  },

}
