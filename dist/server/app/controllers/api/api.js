'use strict';

var mongoose = require('mongoose');
var async = require('async');
var IncidentModel = require('../../models/Incident');
var CompanyModel = require('../../models/Company');
var logger = require('log4js').getLogger('app');

module.exports = {


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



};