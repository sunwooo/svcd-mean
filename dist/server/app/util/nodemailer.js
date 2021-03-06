'use strict';
var express = require('express');
var session = require('express-session');
var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');
var config = require('../../config/config.json');
var logger = require('log4js').getLogger('app');

var sender = '서비스데스크 관리자 <servicedesk@isu.co.kr>';
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
                logger.debug('Nodemailer receiveSend Failes >>>>>>>>>> ' + err)
            }
            transporter.close();
        });
        
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
                logger.debug('Nodemailer finishSend Failes >>>>>>>>>> ' + err)
            }
            transporter.close();
        });
    
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
        html += "< 문의내용 ><br>";
        html += req.content + "<br>";
        html += "<br><hr>";
        html += coment;

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
                logger.debug('Nodemailer evaluationSend Failes >>>>>>>>>> ' + err)
            }
            transporter.close();
        });

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

    //결재요청 메일
    requestApproval: (req, req2, res, next) => {
        
        var receiver = req.request_nm + " <" + req.request_id + ">";
        var mailTitle = "[서비스데스크 결재 요청] " + req.title;
        var html = "";
        html += "< 문의내용 ><br><br>";
        html += req.content ;
        html += "<hr><br>";
        html += "안녕하세요. 이수시스템 담당자 "+ req2.manager_nm  + " 입니다"+"<br>";
        html += "위 요청사항은 그룹웨어 결재가 필요합니다."+"<br><br>";
        html += commentGW;

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