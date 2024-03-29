'use strict';

var mongoose = require('mongoose');
var async = require('async');
var request = require("request");
var CONFIG = require('../../../config/config.json');
var alimi = require('../../util/alimi');

var IncidentModel = require('../../models/Incident');
var CompanyModel = require('../../models/Company');
var logger = require('log4js').getLogger('app');

module.exports = {


    /*
        211108_김선재 : 배정민대리 요청 업무코드로 문의내역 조회 API 요청
        모든 문의건에 대해서가 아닌, HR 팀에서 필요한 세 업무에 대해서만 API 제공
          - OPTI-HR : H008
          - 채용 : H028
          - 근무관리시스템 : H030
    */
    incidents: (req, res, next) => {

        //logger.debug========== api hr ===========");
        //logger.debug=============================");
        console.log("========================================");
        console.log("============ api incidents =============");
        console.log("========================================");


        var condition = {};
        // condition.higher_cd = 'H008'; //OPTI-HR 코드
        // 2022-09-26 PSW SAP ERP 상위업무 추가
        if(req.query.higher_cd == 'H008' || req.query.higher_cd == 'H028' || req.query.higher_cd == 'H030' || req.query.higher_cd == 'H010'){ 
            condition.higher_cd = req.query.higher_cd;
        }else {
            condition.higher_cd = ''
        }
        if(req.query.yyyy != null){
            condition.register_yyyy = req.query.yyyy;
        }
        if(req.query.mm != null){
            condition.register_mm = req.query.mm;
        }
        //if(req.query.title != null){
        //   condition.title = req.query.title;
        //}
        
        //condition.allowDiskUse = true;
        try{
            
            IncidentModel.find(condition, function (err, incident) {

            
                if (err) {
                    res.json(null);
                    console.log("err >>>>" + err);
                }else{

                    var rtnVal = [];

                    incident.forEach(function(incident, index, incidentArray){

                        var newIncident = {};
                        
                        newIncident.row_id                = incident._id                     //Object ID
                        newIncident.higher_cd             = incident.higher_cd               //상위업무 코드
                        newIncident.higher_nm             = incident.higher_nm               //상위업무 이름                                             
                        newIncident.lower_cd              = incident.lower_cd                //하위업무 코드
                        newIncident.lower_nm              = incident.lower_nm                //하위업무 이름                                                                                                                      
                        newIncident.status_cd             = incident.status_cd               //진행상태(processStatus 모델)  
                        newIncident.status_nm             = incident.status_nm               //진행상태명            
                        newIncident.process_speed         = incident.process_speed           //긴급구분                                                                                                                                       
                        newIncident.title                 = incident.title                   //제목 
                        newIncident.content               = incident.content                 //내용      
                        //newIncident.content               = incident.content.replace(/<(\/img|img)([^>]*)>/gi,"")  //PSW 내용 img태그 제거->1건에 대해서만 처리                                                          
                        newIncident.request_company_cd    = incident.request_company_cd      //요청자 회사코드
                        newIncident.request_company_nm    = incident.request_company_nm      //요청자 회사명                                                              
                        newIncident.request_dept_cd       = incident.request_dept_cd         //요청자 부서코드
                        newIncident.request_dept_nm       = incident.request_dept_nm         //요청자 부서명 
                        newIncident.request_email         = incident.request_id              //요청자 계정
                        newIncident.request_nm            = incident.request_nm              //요청자 명                                                               
                        newIncident.request_complete_date = incident.request_complete_date   //완료요청일
                        newIncident.register_company_cd   = incident.register_company_cd     //등록자 회사코드  
                        newIncident.register_company_nm   = incident.register_company_nm     //등록자 회사명                                                              
                        newIncident.register_sabun        = incident.register_sabun          //등록자 사번 
                        newIncident.register_nm           = incident.register_nm             //등록자 명                                                                
                        newIncident.register_date         = incident.register_date           //등록일                                                                     
                        newIncident.register_yyyy         = incident.register_yyyy           //등록년                                                                     
                        newIncident.register_mm           = incident.register_mm             //등록월
                        newIncident.register_dd           = incident.register_dd             //등록일자 
                        newIncident.app_menu              = incident.app_menu                //문의 메뉴 경로                                                                                                                                             
                        newIncident.receipt_content       = incident.receipt_content         //접수내용                                                                         
                        newIncident.manager_company_cd    = incident.manager_company_cd      //담당자 회사코드
                        newIncident.manager_company_nm    = incident.manager_company_nm      //담당자 회사명
                        newIncident.manager_nm            = incident.manager_nm              //담당자 명
                        newIncident.manager_dept_cd       = incident.manager_dept_cd         //담당자 부코드
                        newIncident.manager_dept_nm       = incident.manager_dept_nm         //담당자 부서명
                        newIncident.manager_position      = incident.manager_position        //담당자 직위명
                        newIncident.manager_email         = incident.manager_email           //담당자 이메일
                        newIncident.manager_phone         = incident.manager_phone           //담당자 전화
                        newIncident.receipt_date          = incident.receipt_date            //접수일
                        newIncident.business_level        = incident.business_level          //난이도
                        newIncident.complete_reserve_date = incident.complete_reserve_date   //완료예정일
                        newIncident.solution_flag         = incident.solution_flag           //해결여부
                        newIncident.complete_content      = incident.complete_content        //완료 코멘트                                                                                                                                              
                        newIncident.delay_reason          = incident.delay_reason            //지연사유                                                                           
                        newIncident.work_time             = incident.work_time               //작업시간                                                                         
                        newIncident.complete_date         = incident.complete_date           //완료일                                                                                                                                                 
                        newIncident.complete_open_flag    = incident.complete_open_flag      //완료후공개여부                                                                                                                                        
                        newIncident.process_cd            = incident.process_cd              //처리구분
                        newIncident.process_nm            = incident.process_nm              //처리구분내용                                                                        
                        newIncident.valuation             = incident.valuation               //평가점수                                                                         
                        newIncident.valuation_content     = incident.valuation_content       //평가내용


                        /* 
                            200519_김선재 : 지혜과장님 요청, SSMS 인터페이스 항목 추가 
                            - "GW 결재필요", "Programe ID", "내부처리 공유"
                        */
                        newIncident.gw_link               = (incident.gw_link != null) ? incident.gw_link : 'N'
                        newIncident.program_id            = incident.program_id
                        newIncident.sharing_content       = incident.sharing_content
                        
                        
                        if(incident.delete_flag =="Y"){
                             newIncident.delete_flag      = incident.delete_flag         //삭제여부
                        }else{
                            newIncident.delete_flag       = "N"                           //삭제여부
                        }
                                                                                                                                                                                                                                         
                        //newIncident.created_at            = incident.created_at              //생성일
                        
                        rtnVal.push(newIncident);
                });

                    //logger.debug("=====================");
                    //logger.debug("rtnVal : ", rtnVal);
                    //logger.debug("=====================");

                    ////PSW <img>태그 제거 : Array multi처리 적용
                    console.log("=====================");
                    console.log("rtnVal : ", rtnVal.length);

                    for(var tmp=0; tmp< rtnVal.length; tmp++){
                        if(rtnVal[tmp].content == null){
                        }else{
                            if(rtnVal[tmp].content.includes('img')){
                                rtnVal[tmp].content = rtnVal[tmp].content.replace(/<(\/img|img)([^>]*)>/gi,"");
                            }else{
                                rtnVal[tmp].content = rtnVal[tmp].content;
                            }
                        }
                        if(rtnVal[tmp].complete_content == null){
                        }else{
                            if(rtnVal[tmp].complete_content.includes('img')){
                                rtnVal[tmp].complete_content = rtnVal[tmp].complete_content.replace(/<(\/img|img)([^>]*)>/gi,"");
                            }else{
                                rtnVal[tmp].complete_content = rtnVal[tmp].complete_content;
                            }
                        } 
                    }
                    
                     
                    //console.log("rtnVal : ", rtnVal[0].content);
                    //console.log("rtnVal : ", JSON.stringify(rtnVal));
                    //console.log("=====================");

                    res.json(rtnVal);
                }
            //#psw - MongoError (Sort operation) 오류로 제거 2020-03-24
            //메모리 부족
            //}).sort('-register_date');
            });
        }catch(err){
        }finally{}
    },


    hr: (req, res, next) => {

        //logger.debug========== api hr ===========");
        //logger.debug=============================");
        console.log("=================================");
        console.log("============ api hr =============");
        console.log("=================================");


        var condition = {};
        condition.higher_cd = 'H008'; //OPTI-HR 코드
        
        if(req.query.yyyy != null){
            condition.register_yyyy = req.query.yyyy;
        }
        if(req.query.mm != null){
            condition.register_mm = req.query.mm;
        }
        //if(req.query.title != null){
        //   condition.title = req.query.title;
        //}
        
        //condition.allowDiskUse = true;
        try{
            
            IncidentModel.find(condition, function (err, incident) {

            
                if (err) {
                    res.json(null);
                    console.log("err >>>>" + err);
                }else{

                    var rtnVal = [];

                    incident.forEach(function(incident, index, incidentArray){

                        var newIncident = {};
                        
                        newIncident.row_id                = incident._id                     //Object ID
                        newIncident.higher_cd             = incident.higher_cd               //상위업무 코드
                        newIncident.higher_nm             = incident.higher_nm               //상위업무 이름                                             
                        newIncident.lower_cd              = incident.lower_cd                //하위업무 코드
                        newIncident.lower_nm              = incident.lower_nm                //하위업무 이름                                                                                                                      
                        newIncident.status_cd             = incident.status_cd               //진행상태(processStatus 모델)  
                        newIncident.status_nm             = incident.status_nm               //진행상태명            
                        newIncident.process_speed         = incident.process_speed           //긴급구분                                                                                                                                       
                        newIncident.title                 = incident.title                   //제목 
                        newIncident.content               = incident.content                 //내용      
                        //newIncident.content               = incident.content.replace(/<(\/img|img)([^>]*)>/gi,"")  //PSW 내용 img태그 제거->1건에 대해서만 처리                                                          
                        newIncident.request_company_cd    = incident.request_company_cd      //요청자 회사코드
                        newIncident.request_company_nm    = incident.request_company_nm      //요청자 회사명                                                              
                        newIncident.request_dept_cd       = incident.request_dept_cd         //요청자 부서코드
                        newIncident.request_dept_nm       = incident.request_dept_nm         //요청자 부서명 
                        newIncident.request_email         = incident.request_id              //요청자 계정
                        newIncident.request_nm            = incident.request_nm              //요청자 명                                                               
                        newIncident.request_complete_date = incident.request_complete_date   //완료요청일
                        newIncident.register_company_cd   = incident.register_company_cd     //등록자 회사코드  
                        newIncident.register_company_nm   = incident.register_company_nm     //등록자 회사명                                                              
                        newIncident.register_sabun        = incident.register_sabun          //등록자 사번 
                        newIncident.register_nm           = incident.register_nm             //등록자 명                                                                
                        newIncident.register_date         = incident.register_date           //등록일                                                                     
                        newIncident.register_yyyy         = incident.register_yyyy           //등록년                                                                     
                        newIncident.register_mm           = incident.register_mm             //등록월
                        newIncident.register_dd           = incident.register_dd             //등록일자 
                        newIncident.app_menu              = incident.app_menu                //문의 메뉴 경로                                                                                                                                             
                        newIncident.receipt_content       = incident.receipt_content         //접수내용                                                                         
                        newIncident.manager_company_cd    = incident.manager_company_cd      //담당자 회사코드
                        newIncident.manager_company_nm    = incident.manager_company_nm      //담당자 회사명
                        newIncident.manager_nm            = incident.manager_nm              //담당자 명
                        newIncident.manager_dept_cd       = incident.manager_dept_cd         //담당자 부코드
                        newIncident.manager_dept_nm       = incident.manager_dept_nm         //담당자 부서명
                        newIncident.manager_position      = incident.manager_position        //담당자 직위명
                        newIncident.manager_email         = incident.manager_email           //담당자 이메일
                        newIncident.manager_phone         = incident.manager_phone           //담당자 전화
                        newIncident.receipt_date          = incident.receipt_date            //접수일
                        newIncident.business_level        = incident.business_level          //난이도
                        newIncident.complete_reserve_date = incident.complete_reserve_date   //완료예정일
                        newIncident.solution_flag         = incident.solution_flag           //해결여부
                        newIncident.complete_content      = incident.complete_content        //완료 코멘트                                                                                                                                              
                        newIncident.delay_reason          = incident.delay_reason            //지연사유                                                                           
                        newIncident.work_time             = incident.work_time               //작업시간                                                                         
                        newIncident.complete_date         = incident.complete_date           //완료일                                                                                                                                                 
                        newIncident.complete_open_flag    = incident.complete_open_flag      //완료후공개여부                                                                                                                                        
                        newIncident.process_cd            = incident.process_cd              //처리구분
                        newIncident.process_nm            = incident.process_nm              //처리구분내용                                                                        
                        newIncident.valuation             = incident.valuation               //평가점수                                                                         
                        newIncident.valuation_content     = incident.valuation_content       //평가내용


                        /* 
                            200519_김선재 : 지혜과장님 요청, SSMS 인터페이스 항목 추가 
                            - "GW 결재필요", "Programe ID", "내부처리 공유"
                        */
                        newIncident.gw_link               = (incident.gw_link != null) ? incident.gw_link : 'N'
                        newIncident.program_id            = incident.program_id
                        newIncident.sharing_content       = incident.sharing_content
                        
                        
                        if(incident.delete_flag =="Y"){
                             newIncident.delete_flag      = incident.delete_flag         //삭제여부
                        }else{
                            newIncident.delete_flag       = "N"                           //삭제여부
                        }
                                                                                                                                                                                                                                         
                        //newIncident.created_at            = incident.created_at              //생성일
                        
                        rtnVal.push(newIncident);
                });

                    //logger.debug("=====================");
                    //logger.debug("rtnVal : ", rtnVal);
                    //logger.debug("=====================");

                    ////PSW <img>태그 제거 : Array multi처리 적용
                    console.log("=====================");
                    console.log("rtnVal : ", rtnVal.length);

                    for(var tmp=0; tmp< rtnVal.length; tmp++){
                        if(rtnVal[tmp].content == null){
                        }else{
                            if(rtnVal[tmp].content.includes('img')){
                                rtnVal[tmp].content = rtnVal[tmp].content.replace(/<(\/img|img)([^>]*)>/gi,"");
                            }else{
                                rtnVal[tmp].content = rtnVal[tmp].content;
                            }
                        }
                        if(rtnVal[tmp].complete_content == null){
                        }else{
                            if(rtnVal[tmp].complete_content.includes('img')){
                                rtnVal[tmp].complete_content = rtnVal[tmp].complete_content.replace(/<(\/img|img)([^>]*)>/gi,"");
                            }else{
                                rtnVal[tmp].complete_content = rtnVal[tmp].complete_content;
                            }
                        } 
                    }
                    
                     
                    //console.log("rtnVal : ", rtnVal[0].content);
                    //console.log("rtnVal : ", JSON.stringify(rtnVal));
                    //console.log("=====================");

                    res.json(rtnVal);
                }
            //#psw - MongoError (Sort operation) 오류로 제거 2020-03-24
            //메모리 부족
            //}).sort('-register_date');
            });
        }catch(err){
        }finally{}
    },

    company: (req, res, next) => {

        CompanyModel.find({}, function (err, company) {
            
            if (err) {
                res.json(null);
            }else{

                //logger.debug(=====================");
                //logger.debug(company : ", company);
                //logger.debug(=====================");

                var rtnVal = [];

                company.forEach(function(company, index, companyArray){

                    var newCompany = {};
                    newCompany.company_cd             = company.company_cd               //회사코드
                    newCompany.company_nm             = company.company_nm               //회사이름   
                    
                    rtnVal.push(newCompany);
                });
                                                      

                //logger.debug(=====================");
                //logger.debug(rtnVal : ", rtnVal);
                //logger.debug(=====================");

                res.json(rtnVal);
            }
        }).sort({
            group_flag: -1,
            company_nm: 1
        });
    },

    gwLink: (req, res) => {

        console.log("===========================================");
        console.log("=============== api gwLink ================");
        console.log("========== req.query ===========", req.query);
        console.log("===========================================");
        
        var condition = req.query;

        if(req.query.register_date != null){
            condition.register_date = req.query.register_date;
            condition.request_complete_date = req.query.register_date;
        }
        condition.app_menu = "GW";
        condition.status_nm = "미평가";
        condition.status_cd = "3";
        condition.valuation = "0";
        
        try{
            IncidentModel.create(condition, function (err, incident) {

              if (err) {

                return res.json({
                  success: false,
                  message: err
                });
              } else {
                return res.json(condition);
              }
            });
        }catch(e){
            
        }finally{}
        
        
    }

    ,

    goIncident: (req, res) => {

        console.log("===============================================");
        console.log("=============== api goIncident ================");
        console.log("===============================================");
        var aJson = req.query.objectid;
        
        console.log("aJson : ", aJson);
        //var condition = {}; //req.query;
        //if(req.query.objectid != null){
        //    condition._id = ObjectId('"'+ req.query.objectid +'"');
        //}
        
        //console.log("condition : ", condition);
        
        try{
            IncidentModel.findOne({_id: aJson}).exec(function (err, incident) {
            //IncidentModel.findOne({_id: '5e3cb11816eccb3ba0ade204'}).exec(function (err, incident) {
   
                if (err) {
                    console.log("err : ", err);
                    ///res.json(null);
                }else{
                    console.log("incident id: ", incident._id);
                    console.log("incident: ", incident);
                    
                    
                }
            });
        } catch(err){
        }finally{}
    }

    /* 210226_김선재 */
    ,
    registerIncident: (req, res) => {

        logger.debug("=====================================================");
        logger.debug("=============== api registerIncident ================");
        logger.debug("=====================================================");
        logger.debug("req.body", req.body);
        console.log("=====================================================");
        console.log("=============== api registerIncident ================");
        console.log("=====================================================");
        console.log("req.body", req.body);

        var requestType = req.body.type;
        var condition = {};

        var newincident = {};

        try {

            switch(requestType){
                // 전자전표 결재문서 삭제 요청 문의글 동록
                case "delSlipDoc":

                    condition.requestPerson = req.body.requestPerson;
                    condition.fiid = req.body.fiid;

                    async.waterfall([
                        function(callback) {

                            // 기본정보 가져오기
                            request({
                                uri : CONFIG.groupware.uri + "/COVIWeb/api/UserSimpleData.aspx?email=" + condition.requestPerson,
                                //uri : "http://gw.isudev.com" + "/COVIWeb/api/UserSimpleData.aspx?email=" + condition.requestPerson, //210525_김선재 : 개발 세팅
                                method : "GET",
                                headers : {
                                    "Content-Type" : "application/json",
                                    "Access-Control-Allow-Origin" : "*"
                                }
                            }, function(err, res, body) {
                                callback(null, body);
                                logger.debug("body : " + body);
                            });

                        },
                        function(userData, callback) {

                            // 삭제 요청내역 등록
                            var urlString = "/COVIWeb/api/WithdrawDocSlip.aspx?type=register";
                            urlString = urlString + "&fiid=" + condition.fiid;
                            urlString = urlString + "&registerCode=" + condition.requestPerson;

                            console.log("URL : "+ urlString);
                            logger.debug("URL : "+ urlString);

                            request({
                                uri : CONFIG.groupware.uri + urlString,
                                //uri : "http://gw.isudev.com" + urlString, //210525_김선재 : 개발 세팅
                                method : "GET",
                                headers : {
                                    "Content-Type" : "application/json",
                                    "Access-Control-Allow-Origin" : "*"
                                }
                            }, function(err, res, body) {
                                callback(null, userData);
                            });

                        }
                    ], function(err, body) {
                        if(err || body == null) {
                            console.log("request", "err", err);
                            logger.debug("request", "err", err);
                            return res.json({
                                code : "FAIL",
                                message : "GW Api failed",
                                err : err
                            });
                        }

                        var requestPerson = JSON.parse(body);

                        var content = "<p>전자전표 회수를 위한 결재 문서 삭제 요청입니다.</p><p>문의자 :&nbsp;<br>&nbsp;&nbsp;{회사}<br>&nbsp; {소속}<br>&nbsp; {성명} {직위} ({사번})</p><p>문서 FIID : <b>{fiid}</b></p><p>문서 삭제 링크 : <a href='{링크}'>링크</a><br></p><p>문서정보 조회 쿼리 :&nbsp;<br>&nbsp; select b.STATE, a.* from COVI_FLOW_FORM_INST.dbo.WF_FORM_INSTANCE_WF_SLIP__V0 a <br>&nbsp; inner join COVI_FLOW_INST.dbo.WF_PROCESS b on b.PROCESS_ID = a.PROCESS_ID<br>&nbsp; where a.FORM_INST_ID = '{fiid}'<br></p>"
                        content = content.replace(/{회사}/gi, requestPerson.company_nm);
                        content = content.replace(/{소속}/gi, requestPerson.dept_nm);
                        content = content.replace(/{성명}/gi, requestPerson.employee_nm);
                        content = content.replace(/{직위}/gi, requestPerson.position_nm);
                        content = content.replace(/{사번}/gi, condition.requestPerson);
                        content = content.replace(/{fiid}/gi, condition.fiid);
                        content = content.replace(/{링크}/gi, CONFIG.groupware.uri + "/COVIWeb/api/WithdrawDocSlip.aspx?type=delete&fiid=" + condition.fiid);
                        //content = content.replace(/{링크}/gi, "http://gw.isudev.com" + "/COVIWeb/api/WithdrawDocSlip.aspx?fiid=" + condition.fiid); //210525_김선재 : 개발 세팅

                        newincident.process_speed = "N";
                        newincident.title = "[전자증빙] 전표 회수를 위한 문서 삭제 요청";
                        newincident.request_complete_date = new Date();
                        newincident.content = content;
                        newincident.higher_cd = "H001";
                        newincident.higher_nm = "그룹웨어";
                        newincident.request_company_cd = "ISU_ST";
                        newincident.request_company_nm = "주식회사 이수시스템";
                        newincident.request_dept_nm = "";
                        newincident.request_nm = "전자증빙";
                        newincident.request_id = "eaccount@isu.co.kr";
                        newincident.register_company_cd = "ISU_ST";
                        newincident.register_company_nm = "주식회사 이수시스템";
                        newincident.register_nm = "전자증빙";
                        newincident.register_sabun = "eaccount@isu.co.kr";

                        // Incident 등록
                        IncidentModel.create(newincident, function (err, newincident) {
                            if (err) {
                                return res.json({
                                    code : "FAIL",
                                    message : "IncidentModel.create fail",
                                    err : err
                                });
                            }

                            // SD 업무담당자 사내메신저 호출
                            //alimi.sendAlimi(req.body.incident.higher_cd);

                        });

                        return res.json({
                            code : "SUCCESS",
                            message : "문의글이 등록되었습니다."
                        });
                    });

                    break;
                default:
                    return res.json({
                        code : "FAIL",
                        message : "type undefined"
                    });
                    break;
            }

        }catch(err) {
            return res.json({
                code : "FAIL",
                message : "registerIncident api failed",
                err : err
            });
        }
    }

};