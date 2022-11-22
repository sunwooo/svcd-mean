'use strict';

var mongoose = require('mongoose');
var async = require('async');
var logger = require('log4js').getLogger('app');
var MyProcess = require('../models/MyProcess');
var request = require("request");
var CONFIG = require('../../config/config.json');
//PSW 추가
var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');


module.exports = {

    /**
     * 그룹메신저 호출
     */
    sendAlimi: (higher_cd) => {

        //logger.debug("=============================================");
        //logger.debug("util/alimi/sendAlimi, higher_cd : ", higher_cd);
        //logger.debug("=============================================")
        
        try{
            //>>>>> 상위업무에 매핑되는 사원찾기
            var condition = {};
            condition.higher_cd = higher_cd;

            var aggregatorOpts = [{
                $match: condition
            }, {
                $group: { //그룹
                    _id: {
                        email: "$email"
                    }
                }
            }, {
                $lookup: {
                    //from: "usermanages", // join 할 collection명
                    from: "users", // join 할 collection명
                    localField: "_id.email", // 기본 키($group에서 얻은 값)
                    foreignField: "email", // 외래 키(usermanagers collection에 값) 
                    as: "manager" // 결과를 배출할 alias ( 필드명 )
                }
            }, {
                $project: {
                    "manager.company_cd": 1,
                    "manager.sabun": 1,
                    "manager.using_yn" : 1,
                    //psw 추가
                    "manager.teams_yn" : 1,
                    "manager.email": 1,
                    "manager.email_send_yn" : 1
                    //추가 끝
                }
            }]

            //logger.debug("=============================================");
            //logger.debug("util/alimi/sendAlimi aggregate!!! aggregatorOpts  ", JSON.stringify(aggregatorOpts));
            //logger.debug("=============================================");

            console.log("test!! ", JSON.stringify(aggregatorOpts));

            MyProcess.aggregate(aggregatorOpts).exec(function (err, targetUser) {

                if (err) {

                    logger.error("=============================================");
                    logger.error("util/alimi/sendAlimi aggregate!!! err  ", err);
                    logger.error("=============================================");

                } else {

                    var gw = CONFIG.groupware.uri;
                    var alimi = CONFIG.msgAlimi.uri;

                    if(targetUser != null){

                        for (var i = 0; i < targetUser.length; i++) {

                            //logger.debug("=============================================");
                            //logger.debug("util/alimi/sendAlimi aggregate!!! aggregatorOpts  ", aggregatorOpts);
                            //logger.debug("util/alimi/sendAlimi aggregate!!! targetUser[i].manager  ", targetUser[i].manager.length);
                            //logger.debug("=============================================");

                            if(targetUser[i].manager.length > 0){
                                //Go Live(운영 시 수정처리)
                                if(targetUser[i].manager[0].using_yn == "Y" && targetUser[i].manager[0].company_cd != null && targetUser[i].manager[0].sabun != null){
                                    var manager = targetUser[i].manager[0].company_cd + targetUser[i].manager[0].sabun;
                                    //var manager = "ISU_ST01004";

                                    //console.log("==targetUser=="+targetUser[i].manager[0].email);
                                    //console.log("==targetUser=="+targetUser[i].manager[0].teams_yn);

                                    //logger.debug("=============================================");
                                    //logger.debug("util/alimi/sendAlimi, manager : ", manager);
                                    //logger.debug("=============================================")
                                    
                                    request({
                                        uri: alimi + "/alimi/call_alimi.jsp?msgtype=CSD&users_id=" + manager + "&title=1&link_url=" + gw + "/CoviWeb/Main.aspx?type=helpdesK" + manager,
                                        headers: {
                                            'Content-type': 'application/html'
                                        },
                                        method: "GET",
                                    }, function (err, response, body) {
                                        //todo
                                    });

                                    /*
                                      2022-03-23 psw 추가 
                                      Teams 알림여부(teams_yn) 사용 시, 챗봇으로 알림을 발송하는 API 
                                    */
                                    //Teams 챗봇 알림 api
                                    //팀즈알림
                                    if(targetUser[i].manager[0].teams_yn == "Y"){
                                        //console.log("==targetUser email============"+targetUser[i].manager[0].email); //targerUser 일 경우 알림 (psw@isu.co.kr)
                                        request({
                                            uri: "https://bot.isu.co.kr/cm/Chat/botcall/send",
                                            headers: {
                                                'Content-type': 'application/json'
                                            },
                                            method: "POST",
                                            body: JSON.stringify({
                                                "emails" : [
                                                    targetUser[i].manager[0].email
                                                ],
                                                "systemtype" : "Normal", 
                                                "messagetype" : "Text",
                                                "title" : "SERVICE DESK 알림",
                                                "subTitle" : "접수 : 1건",
                                                "text" :  "서비스데스크에 신규 등록되었습니다.",
                                                "link" : "http://sd.isusystem.co.kr",
                                                "systemCode" : "servicedesk", 
                                                "summary" : "알림이 도착했습니다.", 
                                                "from" : "ADMIN"
                                            }),
                                        }, function (err, response, body) {
                                            //todo
                                            if (!err) {
                                                console.log("==================1===================");
                                                console.log(body);
                                            }
                                            else {
                                                console.log("==================2===================");
                                                console.log("err: " + err);
                                                //console.log("response.statusCode: " + response.statusCode);
                                                //console.log("response.statusText: " + response.statusText);
                                            }
                                        });
                                    }
                                    
                                    //2022-05-25 PSW 메일 알림 추가
                                    if(targetUser[i].manager[0].email_send_yn == "Y"){
                                        console.log("###########alimi 1 ############");
                                        
                                        console.log("==targetUser email============"+targetUser[i].manager[0].email); //targerUser 일 경우 메일알림 
                                        
                                        var sender = '서비스데스크 관리자 <servicedeskadmin@isu.co.kr>';

                                        var coment = "";
                                        coment += "<br><br>";
                                        coment += "더 자세한 내용은 서비스 데스크 게시판에서 확인 하세요.<br>";
                                        coment += "서비스 데스크 ( http://sd.isusystem.co.kr )<br>";
                                        coment += "<br>";
                                        coment += "※ 이 메일은 발신 전용입니다. 회신은 처리되지 않습니다.";

                                        var receiver = targetUser[i].manager[0].employee_nm + " <" + targetUser[i].manager[0].email + ">";
                                        var mailTitle = "[ 서비스데스크 등록 알림 ]";
                                        var html = "";
                                        html += "접수 : " + "1건" + "<br>";
                                        html += "서비스데스크에 신규 등록되었습니다. " + "<br>";
                                        html += coment;

                                        
                                        var transporter = nodemailer.createTransport({
                                            host: CONFIG.mailer.host,
                                            port: CONFIG.mailer.port,
                                            auth: false,
                                            mock: false,
                                            });

                                        transporter.verify(function (error, success) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log("Server is ready to take our messages");
                                        }
                                        });
                                        
                                        transporter.sendMail({
                                            from: CONFIG.mailer.user,
                                            to: receiver,
                                            subject: mailTitle,
                                            html: html
                                        },function(err,res){
                                            if (err) {
                                                console.log("mailSend mail err : ", + err);
                                                console.log("mailSend mail res : ", + res);
                                                
                                            }
                                            transporter.close();
                                        });
                                        
                                    }else{
                                        console.log("###########alimi 2 ############");
                                    }
                                    
                                    
                                }else{
                                    //logger.debug("=============================================");
                                    //logger.debug("util/alimi/sendAlimi aggregate!!! targetUser[i]  ", JSON.stringify(targetUser[i]));
                                    //logger.debug("=============================================");
                                }
                            
                            }
                            
                        }
                    }
                }
            });
            //<<<<< 상위업무에 매핑되는 사원찾기   
        }catch(e){

            logger.error("=============================================");
            logger.error("util/alimi/sendAlimi error : ", e);
            logger.error("=============================================")

        }finally{

        }
  
    },

};