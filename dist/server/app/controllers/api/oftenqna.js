'use strict';

var async = require('async');

var Company = require('../../models/Company');
var Incident = require('../../models/Incident');
var User = require('../../models/User');
var OftenQna = require('../../models/OftenQna');
var service = require('../../services/oftenqna');
var CONFIG = require('../../../config/config.json');
var logger = require('log4js').getLogger('app');
var moment = require('moment');
var fs = require('fs');

module.exports = {
 
    /**
    * qna 조회
    */
    list: (req, res, next) => {
        var search = service.createSearch(req);

        var page = 1;
        var perPage = 15;

        //logger.debug("==========================================getcompany=======================================");
        //logger.debug("req.query.page : ", req.query.page);
        //logger.debug("req.query.perPage : ", req.query.perPage);
        //logger.debug("req.query.searchText : ", req.query.searchText);
        //logger.debug("================================================================================================");

        if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
        if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);


        async.waterfall([function (callback) {


            OftenQna.find(search.findOftenqna, function (err, oftenqna) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: err
                        });
                    } else { 
                        callback(null);
                    }
                })
               
                //.sort("-" + search.order_by);111
                /*
                .sort({
                    group_flag: -1,
                    company_nm: 1
                })
                .skip((page - 1) * perPage)
                .limit(perPage);
                */

        },
        function (callback) {
            OftenQna.count(search.findOftenqna, function (err, totalCnt) {
                if (err) {
                    logger.error("oftenqna : ", err);

                    return res.json({
                        success: false,
                        message: err
                    });
                } else {

                    //logger.debug("=============================================");
                    //logger.debug("oftenqna : ", totalCnt);
                    //logger.debug("=============================================");

                    callback(null, totalCnt)
                }
            });
        }
        ], function (err, totalCnt) {

            OftenQna.find(search.findOftenqna, function (err, oftenqna) {
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
                    rtnData.oftenqna = oftenqna;
                    rtnData.totalCnt = totalCnt;
                    rtnData.totalPage = Math.ceil(totalCnt/perPage);

                    //logger.debug("=============================================");
                    //logger.debug("rtnData.totalCnt : ", rtnData.totalCnt);
                    //logger.debug("rtnData : ", JSON.stringify(rtnData));
                    //logger.debug("=============================================");

                    res.json(rtnData);

                }
            })
                //.sort({
                //    group_flag: -1,
                //    company_nm: 1
                //})
                .skip((page - 1) * perPage)
                .limit(perPage);
        });
    
    },

    /**
     * qna 조회 (사용자)
     */
    userlist: (req, res, next) => {
        try{
        //logger.debug("===============================userlist===============================");
        //logger.debug("req.query.company_cd : ", req.query.company_cd);
        //logger.debug("===============================userlist===============================");
        var search = service.createSearch(req);

        var page = 1;
        var perPage = 15;

        //logger.debug("==========================================userlist=======================================");
        //logger.debug("req.query.page : ", req.query.page);
        //logger.debug("req.query.perPage : ", req.query.perPage);
        //logger.debug("req.query.searchText : ", req.query.searchText);
        //logger.debug("================================================================================================");

        if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
        if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);
        //if (req.query.company_cd != null && req.query.company_cd != '') company_cd = req.query.company_cd;


        async.waterfall([function (callback) {
            //logger.debug("req.query.company_cd : ", req.query.company_cd);
            var condition = {};
            search.findOftenqna.company_cd =  {'$elemMatch': { id: req.query.company_cd}};

            OftenQna.find(search.findOftenqna , function (err, oftenqna) {

                //logger.debug("search.findOftenqna : " , search.findOftenqna);
                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    callback(null)
                }
            });
        },
        function (callback) {
            OftenQna.count(search.findOftenqna, function (err, totalCnt) {
                if (err) {
                    logger.error("oftenqna : ", err);

                    return res.json({
                        success: false,
                        message: err
                    });
                } else {

                    //logger.debug("=============================================");
                    //logger.debug("oftenqna : ", totalCnt);
                    //logger.debug("=============================================");

                    callback(null, totalCnt)
                }
            });
        }
        ], function (err, totalCnt) {

            OftenQna.find(search.findOftenqna, function (err, oftenqna) {
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
                    rtnData.oftenqna = oftenqna;
                    rtnData.totalCnt = totalCnt;
                    rtnData.totalPage = Math.ceil(totalCnt/perPage);

                    //logger.debug("=============================================");
                    //logger.debug("rtnData.totalCnt : ", rtnData.totalCnt);
                    //logger.debug("rtnData : ", JSON.stringify(rtnData));
                    //logger.debug("=============================================");

                    res.json(rtnData);

                }
            })
                //.sort({
                //    group_flag: -1,
                //    company_nm: 1
                //})
                .skip((page - 1) * perPage)
                .limit(perPage);
        });
        }catch(err){
            logger.debug("err : ",err);
        }
    },

    /**
     * qna 수정
    */
    update: (req, res, next) => {

        try {
            async.waterfall([function (callback) {
      
              //logger.debug("========================================================");
              //logger.debug("========================req.body ",req.body);
              //logger.debug("========================req.body._id ",req.body.qna._id);
              //logger.debug("========================================================");
      
              OftenQna.findOneAndUpdate({
                _id: req.body.qna._id
              }, req.body.qna, function (err, qna) {
                if (!qna) {
                  return res.json({
                    success: false,
                    message: "No data found to update"
                  });
                } else {
                  callback(null);
                }
              });
      
            }], function (err) {
              if(!req.body.deletefile){
                  return res.json({
                      success: true,
                      message: "수정되었습니다."
                  });  
              }  
              fs.unlink(req.body.deletefile, function (err) {
                  if (err) {
                    logger.debug("qna attach file delete ",err);
                  }
                  return res.json({
                      success: true,
                      message: "수정되었습니다."
                  });  
                });
            });
          } catch (err) {
            logger.error("qna control update error : ", err);
            return res.json({
              success: false,
              message: err
            });
          }
    },

    /**
    * qna 삭제 
    */
    delete: (req, res, next) => {
        //logger.debug("delete start.....");
        try {
            async.waterfall([function (callback) {

            var upQna = {};
            var m = moment();
            var date = m.format("YYYY-MM-DD HH:mm:ss");

            upQna.deleted_at = date;
            upQna.delete_flag = 'Y';

            callback(null, upQna);

            //logger.debug("upQna : ", upQna);

        }], function (err, upQna) {
                OftenQna.findOneAndRemove({
                _id: req.body._id
                }, upQna, function (err, qna) {
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
            logger.error("upQna deleted err : ", err);
            return res.json({
                success: false,
                message: err
            });
        }
    },

    /**
    * qna 등록
    */
    insert: (req, res) => {

    //logger.debug("================== insert = (req, res) ======================");
    //logger.debug("xxxx req.session : ", req.session);
    //logger.debug("req.body.incident : ", req.body.incident);
    //logger.debug("=============================================================");
    try{
        async.waterfall([function (callback) {

        var newqna = req.body.qna;
        //logger.debug("newqna ", newqna);
        
        
        newqna.register_company_cd = req.session.company_cd;
        newqna.register_company_nm = req.session.company_nm;
        newqna.register_nm = req.session.user_nm;
        newqna.register_id = req.session.email;
        
        

        if (req.files) {
            newqna.attach_file = req.files;
        }
        //logger.debug("nnnnn newqna.pop_yn : ", newqna );
        OftenQna.create(newqna, function (err, savedqna) {
            if (err) {
            //logger.debug("trace err ", err);
            return res.json({
                success: false,
                message: err
            });
            }
            
            //logger.debug("trace OftenQna.create savedqna", savedqna);
        
                
            //////////////////////////////////////
            // SD 업무담당자 사내메신저 호출
            //alimi.sendAlimi(req.body.incident.higher_cd);
            //////////////////////////////////////

            callback(null);
            
            });
            }], function (err) {
            return res.json({
                    success: true,
                    message: err
                });
            });

    } catch (err) {
        logger.error("upQna deleted err : ", err);
        return res.json({
            success: false,
            message: err
        });
    }
    },

    getPopUpYN : (req, res, next) => {
        var search = service.createSearch(req);

        //logger.debug("==========================================getPopUpYn=======================================");
        //logger.debug("==========================================1111111111111111111111=======================================");
        //logger.debug("req.session.company_cd : ", req.session.company_cd);
        //logger.debug("===========================================================================================");

        var condition = {};
        search.findOftenqna.company_cd =  {'$elemMatch': { id: req.session.company_cd}};
        search.findOftenqna.pop_yn = "Y";

        //logger.debug("search.findOftenqna : ", JSON.stringify(search.findOftenqna));


        try {
            /*
            OftenQna.find({
                company_cd: {
                    $regex: new RegExp(req.session.company_cd, "i")
                },
                pop_yn : "Y"
            }).exec(function (err, oftenQna) {
            */
            OftenQna.find(search.findOftenqna , function (err, oftenqna) {
                
                //logger.debug("==============================================");
                //logger.debug("oftenqna :", oftenqna);
                //logger.debug("company_cd", req.session.company_cd);
                //logger.debug("oftenQna", JSON.stringify(oftenQna));
                //logger.debug("==============================================");

                if (err) {
                    return res.json({
                        success: false,
                        message: err
                    });
                } else {
                    //res.send(oftenQna);
                    //res.json(oftenQna);
                    //logger.debug("oftenqna :", oftenqna);

                    var rtnData = {};
                    rtnData.oftenqna = oftenqna;
                    //rtnData.totalCnt = totalCnt;

                    //logger.debug("=============================================");
                    //logger.debug("rtnData.totalCnt : ", rtnData.totalCnt);
                    //logger.debug("rtnData : ", JSON.stringify(rtnData));
                    //logger.debug("=============================================");

                    //logger.debug("rtnData.oftenqna : ", rtnData.oftenqna);
                    
                    res.json(rtnData);
                }
            });
        } catch (e) {
            logger.debug('****************', e);
        }
        
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
}
