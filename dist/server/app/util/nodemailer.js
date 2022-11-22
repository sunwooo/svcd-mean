'use strict';
var express = require('express');
var session = require('express-session');
var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');
var config = require('../../config/config.json');
var logger = require('log4js').getLogger('app');
var urlencode = require('urlencode');


//var sender = '서비스데스크 관리자 <servicedesk@isu.co.kr>';
var sender = '서비스데스크 관리자 <servicedeskadmin@isu.co.kr>';
//수정 끝
var coment = "";
coment += "<br><br>";
coment += "더 자세한 내용은 서비스 데스크 게시판에서 확인 하세요.<br>";
coment += "서비스 데스크 ( http://sd.isusystem.co.kr )<br>";
coment += "<br>";
coment += "※ 이 메일은 발신 전용입니다. 회신은 처리되지 않습니다.";

var commentGW = "";
commentGW += "※ 이 메일은 발신 전용입니다. 회신은 처리되지 않습니다.";

module.exports = {

    //접수메일
    receiveSend: (req, req2, res, next) => {
        
    
    console.log("receiveSend mail : ");
        
    var receiver = req.request_nm + " <" + req.request_id + ">";
    var mailTitle = "[서비스데스크 접수 처리] " + req.title;
    var html = "";
    html += "고객사명 : " + req.request_company_nm + "<br>";
    html += "요청자명 : " + req.request_nm + "<br>";
    html += "완료요청일자 : " + req.request_complete_date + "<br>";
    html += "< 문의내용 ><br>";
    html += req.content + "<br>";
    html += "<br><hr><br>";
    html += "접수일자 : " + req2.receipt_date + "<br>";
    html += "담당자명 : " + req2.manager_nm + "<br>";
    html += "완료예정일자 : " + req2.complete_reserve_date + "<br>";
    html += "< 접수내용 ><br>";
    html += req2.receipt_content + "<br>";
    html += coment;

    //2022-02-28 psw 수정
    var transporter = nodemailer.createTransport({
        host: config.mailer.host,
        port: config.mailer.port,
        auth: false,
        mock: false,
        });

    transporter.verify(function (error, success) {
    if (error) {
        console.log("error >>>>>>>>" + error);
    } else {
        console.log("Server is ready to take our messages");
    }
    });

    //오류 발생 부분 수정중 
    transporter.sendMail({
        from: config.mailer.user,
        to: receiver,
        subject: mailTitle,
        html: html
    },function(err,res){
        if (err) {
            console.log("config.mailer.user : ", + config.mailer.user);
            console.log("receiver : ", + receiver);
            console.log("mailTitle : ", + mailTitle);
            console.log("html: ", + html);
            console.log("receiveSend mail err : ", + err);
            console.log("receiveSend mail res : ", + res);
            
        }
        transporter.close();
    });
    //수정 끝

    /*nodemailer 사용1차 - 기존 소스 
    var mailOptions = {
        from: sender,
        to: receiver,
        subject: mailTitle,
        html: html
    };
    
    var transporter = nodemailer.createTransport(smtpPool({
        service: config.mailer.service,
        host: config.mailer.host,
        port: config.mailer.port,
        auth: {
            user: config.mailer.user,
            pass: config.mailer.password
        },
        tls: {
            rejectUnauthorize: false
        },
        maxConnections: 5,
        maxMessages: 10
    }));


    transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log("receiveSend mail err : ", + err);
            console.log("receiveSend mail res : ", + res);
            logger.debug('Nodemailer receiveSend Failes >>>>>>>>>> ' + err);
        }
        transporter.close();
    });
    */
        
    },

    //완료메일
    finishSend: (req, req2, res, next) => {
        
        var receiver = req.request_nm + " <" + req.request_id + ">";
        var mailTitle = "[서비스데스크 완료 처리] " + req.title;
        var html = "";
        html += "고객사명 : " + req.request_company_nm + "<br>";
        html += "요청자명 : " + req.request_nm + "<br>";
        html += "완료요청일자 : " + req.request_complete_date + "<br>";
        html += "< 문의내용 ><br>";
        html += req.content + "<br>";
        html += "<br><hr><br>";
        html += "완료일자 : " + req2.complete_date + "<br>";
        html += "담당자명 : " + req.manager_nm + "<br>";
        html += "< 처리내용 ><br>";
        html += req2.complete_content + "<br>";
        html += coment;
        
        //2022-03-02 psw 수정
        var transporter = nodemailer.createTransport({
            host: config.mailer.host,
            port: config.mailer.port,
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
            from: receiver,
            to: req.request_id,
            subject: mailTitle,
            html: html
        },function(err,res){
            if (err) {
                console.log("finishSend mail err : ", + err);
                console.log("finishSend mail res : ", + res);
                
            }
            transporter.close();
        });
        //수정 끝
    },

    //평가메일
    evaluationSend: (req, req2, res, next) => {

        var evaluationValue = req2.valuation;
        var evaluationValueNM = "";

        if (evaluationValue == '1') {
            evaluationValueNM = "매우 불만족"
        } else if (evaluationValue == '2') {
            evaluationValueNM = "불만족"
        } else if (evaluationValue == '3') {
            evaluationValueNM = "보통"
        } else if (evaluationValue == '4') {
            evaluationValueNM = "만족"
        } else if (evaluationValue == '5') {
            evaluationValueNM = "매우 만족"
        }

        var receiver = req.manager_nm + " <" + req.manager_email + ">";
        var mailTitle = "[서비스데스크 평가 완료] " + req.title;
        var html = "";
        html += "고객사명 : " + req.request_company_nm + "<br>";
        html += "요청자명 : " + req.request_nm + "<br>";
        html += "평가점수 : " + evaluationValueNM + " (" + evaluationValue + " 점)" + "<br>";
        html += "<br><hr>";
        html += coment;

        //2022-03-02 psw 수정
        var transporter = nodemailer.createTransport({
            host: config.mailer.host,
            port: config.mailer.port,
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
            from: receiver,
            to: req.request_id,
            subject: mailTitle,
            html: html
        },function(err,res){
            if (err) {
                console.log("evaluationSend mail err : ", + err);
                console.log("evaluationSend mail res : ", + res);
                
            }
            transporter.close();
        });
        //수정 끝
    },

    //비밀번호 초기화
    initPassword: (req, res, next) => {
    
        //logger.debug("=============req : ",req);

        var initPW = req.email.substring(0,req.email.indexOf("@"));

        var loopCnt = initPW.length;
        for(var i = loopCnt ; i < 8 ; i++){
            initPW += i;
        }

        var receiver = req.employee_nm + " <" + req.email + ">";
        //var receiver = "이한일 <hilee@isu.co.kr>";
        var mailTitle = "[서비스데스크] 비밀번호가 초기화 되었습니다.";
        var html = "";
        html += "고객사명 : " + req.company_nm + "<br>";
        html += "요청자명 : " + req.employee_nm + "<br>";
        html += "ISU SYSTEM 서비스데스크 비밀번호가 "+initPW+"로 초기화 되었습니다.<br>";
        html += "<br><hr>";
        /*
        var mailOptions = {
            from: sender,
            to: receiver,
            subject: mailTitle,
            html: html
        };

        var transporter = nodemailer.createTransport(smtpPool({
            service: config.mailer.service,
            host: config.mailer.host,
            port: config.mailer.port,
            auth: {
                user: config.mailer.user,
                pass: config.mailer.password
            },
            tls: {
                rejectUnauthorize: false
            },
            maxConnections: 5,
            maxMessages: 10
        }));

        transporter.sendMail(mailOptions, function (err, res) {
            if (err) {
                logger.debug('Nodemailer finishSend Failes >>>>>>>>>> ' + err);
            }
            transporter.close();
        });
        */

        //2022-03-02 psw 수정
        var transporter = nodemailer.createTransport({
        host: config.mailer.host,
        port: config.mailer.port,
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
            from: receiver,
            to: req.request_id,
            subject: mailTitle,
            html: html
        },function(err,res){
            if (err) {
                console.log("initPassword mail err : ", + err);
                console.log("initPassword mail res : ", + res);
                
            }
            transporter.close();
        });
        //수정 끝
    
    },

    //계정승인
    accessConfirm: (req, res, next) => {
    
        //logger.debug("=============req : ",req);

        var receiver = req.request_nm + " <" + req.email + ">";
        //var receiver = "이한일 <hilee@isu.co.kr>";
        var mailTitle = "[서비스데스크] 요청하신 계정이 승인되었습니다.";
        var html = "";
        html += "고객사명 : " + req.company_nm + "<br>";
        html += "요청자명 : " + req.employee_nm + "<br>";
        html += "ISU SYSTEM 서비스데스크 '"+req.email+"' 계정이 승인되었습니다.<br>";
        html += "<br><hr>";       

        var mailOptions = {
            from: sender,
            to: receiver,
            subject: mailTitle,
            html: html
        };

        var transporter = nodemailer.createTransport(smtpPool({
            service: config.mailer.service,
            host: config.mailer.host,
            port: config.mailer.port,
            auth: {
                user: config.mailer.user,
                pass: config.mailer.password
            },
            tls: {
                rejectUnauthorize: false
            },
            maxConnections: 5,
            maxMessages: 10
        }));

        transporter.sendMail(mailOptions, function (err, res) {
            if (err) {
                logger.debug('Nodemailer finishSend Failes >>>>>>>>>> ' + err);
            }
            transporter.close();
        });
    
    },

    /*
    * 결재요청 메일 추가 수정 PSW 2020-09-11
    * Target URL 지정, _id 값으로 연동처리 
    */
    requestApproval: (req, req2, res, next) => {
        //var linkTarget = "http://gw.isu.co.kr/CoviWeb/Approval/Forms/request_svcd.aspx?userid=ISU_ST12001&key=F561AAF6EF0BF14D4208BB46A4CCB3AD&fmpf=WF_FORM_ISU_ACCOUNTING_007_999&objectID="+ req._id + "&sysManager=" + urlencode(req2.manager_nm);
        var linkTarget = "http://gw.isudev.com/CoviWeb/Approval/Forms/request_svcd.aspx?userid=ISU_ST12001&fmpf=WF_FORM_ISU_ACCOUNTING_007_999&objectID="+ req._id + "&sysManager=" + urlencode(req2.manager_nm);
        
        console.log("linkTarget >>>>>" + linkTarget);

        var receiver = req.request_nm + " <" + req.request_id + ">";
        var mailTitle = "[서비스데스크 결재 요청] " + req.title;
        var html = "";
        html += "< 문의내용 ><br><br>";
        html += req.content ;
        html += "<hr><br>";
        html += "안녕하세요. 이수시스템 담당자 "+ req2.manager_nm  + " 입니다"+"<br>";
        html += "위 요청사항은 그룹웨어 결재가 필요합니다."+"<br><br>";
        //PSW 연동 테스트
        html += "ObjectId : " + req._id + " <br>";
        html += "<a href=" + linkTarget + " target='_blank'>" + "결재문서작성 바로가기" + "</a>" +  "<br/><br/>";
        html += commentGW;


        console.log("html >>>>>" + html);

        var mailOptions = {
            from: sender,
            to: receiver,
            subject: mailTitle,
            html: html
        };

        var transporter = nodemailer.createTransport(smtpPool({
            service: config.mailer.service,
            host: config.mailer.host,
            port: config.mailer.port,
            auth: {
                user: config.mailer.user,
                pass: config.mailer.password
            },
            tls: {
                rejectUnauthorize: false
            },
            maxConnections: 5,
            maxMessages: 10
        }));

        transporter.sendMail(mailOptions, function (err, res) {
            if (err) {
                logger.debug('Nodemailer requestApproval Failes >>>>>>>>>> ' + err)
            }
            transporter.close();
        });
        
    },

}

