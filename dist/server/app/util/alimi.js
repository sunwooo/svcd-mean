'use strict';

var mongoose = require('mongoose');
var async = require('async');
var logger = require('log4js').getLogger('app');
var MyProcess = require('../models/MyProcess');
var request = require("request");
var CONFIG = require('../../config/config.json');

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
                    "manager.email": 1
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
                                        
                                    //메일알림
                                    }else{

                                    }
                                    //추가 끝
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