'use strict';

var async = require('async');
var logger = require('log4js').getLogger('app');
var MyProcess = require('../models/MyProcess');

module.exports = {

    createSearch: (req) => {


        var findIncident = {};

        // or 조건 생성
        var orArr = createOrCondition(req);
        if(orArr.length > 0)
            findIncident.$or = orArr;

        // and 조건 생성
        var andArr = createAndCondition(req);
        if(andArr.length > 0)
        findIncident.$and = andArr;
    
        //logger.debug("=============================== createSearch ==================================");
        //logger.debug("findIncident : ",JSON.stringify(findIncident));
        //logger.debug("===============================================================================");

        return { findIncident: findIncident };

    }
};



/**
 * or 조건 만들기
 */
function createOrCondition(req){
    var OrQueries = [];

        //logger.debug("=============================== createOrCondition ==================================");
        //logger.debug("req.query.searchType : ",req.query.searchType);
        //logger.debug("req.query.searchText : ",req.query.searchText);
        //logger.debug("===============================================================================");

    if (req.query.searchType && req.query.searchText) {
        var searchTypes = req.query.searchType.toLowerCase().split(",");
        
        if (searchTypes.indexOf("title") > -1) {
            OrQueries.push({
                title: {
                    /* 220622_김선재 : 정규표현식 Like 검색 미작동 건 수정 */
                    // $regex: new RegExp(req.query.searchText, "i")
                    $regex: req.query.searchText
                }
            });
        }
        if (searchTypes.indexOf("content") > -1) {
            OrQueries.push({
                content: {
                    /* 220622_김선재 : 정규표현식 Like 검색 미작동 건 수정 */
                    // $regex: new RegExp(req.query.searchText, "i")
                    $regex: req.query.searchText
                }
            });
        }
        if (searchTypes.indexOf("request_nm") > -1) {
            OrQueries.push({
                request_nm: {
                    /* 220622_김선재 : 정규표현식 Like 검색 미작동 건 수정 */
                    // $regex: new RegExp(req.query.searchText, "i")
                    $regex: req.query.searchText
                }
            });
        }
        if (searchTypes.indexOf("manager_nm") > -1) {
            OrQueries.push({
                manager_nm: {
                    /* 220622_김선재 : 정규표현식 Like 검색 미작동 건 수정 */
                    // $regex: new RegExp(req.query.searchText, "i")
                    $regex: req.query.searchText
                }
            });
        }
        /* else if (searchTypes.indexOf("title,content") > -1) {
            OrQueries.push({
                title: {
                    $regex: new RegExp(req.query.searchText, "i")
                },
                content: {
                    $regex: new RegExp(req.query.searchText, "i")
                }
            });
        } */
        
    }
    /*
        191112_김선재 : 검색기능 제한으로 인한 Or 조건에서 And 조건으로 이동
    */
    // if (req.query.user == "general"){
    //     if(req.query.complete){
    //         //OrQueries.push({'status_cd':'3'});
    //         OrQueries.push({'status_cd':'4'});
    //     }else{
    //         OrQueries.push({'status_cd':'1'});
    //         OrQueries.push({'status_cd':'2'});
    //         OrQueries.push({'status_cd':'3'});
    //         OrQueries.push({'status_cd':'5'});
    //         OrQueries.push({'status_cd':'9'});
    //     }
    // }

    logger.debug("=============================== createOrCondition ==================================");
    logger.debug("OrQueries : ",OrQueries);
    logger.debug("===============================================================================");

    return OrQueries;
    
}


/**
 * and 조건 만들기
 */
function createAndCondition(req){

    var AndQueries = [];

    var user = req.query.user == null ? "*" : req.query.user;
    var register_yyyy = req.query.register_yyyy == null ? "*" : req.query.register_yyyy;
    var company_cd = req.query.company_cd == null ? "*" : req.query.company_cd;
    var higher_cd = req.query.higher_cd == null ? "*" : req.query.higher_cd;
    var lower_cd = req.query.lower_cd == null ? "*" : req.query.lower_cd;
    var status_cd = req.query.status_cd == null ? "*" : req.query.status_cd;
    var reg_date_from = req.query.reg_date_from;
    var reg_date_to = req.query.reg_date_to;

    // 삭제되지 않은 데이타 조회
    AndQueries.push({
        delete_flag: {$ne: 'Y'}
    });

    //등록년도 조건 추가
    if (register_yyyy != '*') {
        AndQueries.push({
            register_yyyy: req.query.register_yyyy
        });
    }
    
    /**
     * 일반사용자 본인데이타만 조회 조건 추가
     */
    if(user == "general"){
        AndQueries.push({
            request_id: req.session.email
        });
        /*
            191112_김선재 : 검색기능 제한으로 인한 Or 조건에서 And 조건으로 이동
        */
        if(req.query.complete){
            AndQueries.push({'status_cd':'4'});
        }else {
            AndQueries.push(
                {"$or": [
                    {'status_cd':'1'},
                    {'status_cd':'2'},
                    {'status_cd':'3'},
                    {'status_cd':'5'},
                    {'status_cd':'9'}
                ]}
            )
        }
    }else if(user == "company"){
        AndQueries.push(
        {
            request_company: req.session.request_company
        });
    }else if ((req.session.user_flag == "1" && (user == "manager" || user == "managerall")) || req.session.user_flag == "3" || req.session.user_flag == "4") {

        if(status_cd.length > 1){ //진행 상태가 배열로 요청될 때
            
            /**
             * 요청자가 매니저가 아니고 진행상태에 '접수대기','협의필요' 포함 배열로 넘어올 시
             */

            if ((status_cd.indexOf("2") > -1 
                 || status_cd.indexOf("3") > -1
                 || status_cd.indexOf("4") > -1
                 || status_cd.indexOf("9") > -1
                 )
                 && (user != "managerall")) {
                
                    var m_email_flag = false;
                    req.query.status_cd.forEach((status_cd) => {
                        if (status_cd == "1" || status_cd == "5"){
                            m_email_flag = true;
                        }
                    });
                    
                    if(m_email_flag){
                        var email = [];
                        email.push(req.session.email);
                        email.push("");
                        AndQueries.push({
                            manager_email: {"$in":email}
                        });
                    }else{
                        AndQueries.push({
                            manager_email: req.session.email
                        });
                    }

            }
        }else{ //진행 상태가 하나씩 요청될 때
            if (status_cd.indexOf("1") == -1 && status_cd.indexOf("5") == -1 && user != "managerall" && user != "manager") {
                AndQueries.push({
                    manager_email: req.session.email
                });
            }
        }
    }


    //검색기간 조건 추가
    /*2018-05-04, 검색기간 조회 로직 수정
        String의 경우, $gte, $lte 동작 안함
        1) from to 같을 경우, from 을 하루 전으로 조정함
        2) toISOString() 처리
    */  
    if(reg_date_from && reg_date_to){
        if(reg_date_from == reg_date_to){  
            
            var df = new Date(reg_date_from);
            df.setDate(df.getDate()-1);  
            //df.setDate(df.getDate());  
            var df2 = df.toISOString();

            var dt = new Date(reg_date_to);
            var dt2 = dt.toISOString();


        }else{        

            var df = new Date(reg_date_from);
            df.setDate(df.getDate()-1);
            //df.setDate(df.getDate());
            var df2 = df.toISOString(); 

            var dt = new Date(reg_date_to);
            //dt.setDate(dt.getDate()+1);
            var dt2 = dt.toISOString();
        }

        AndQueries.push({
            register_date: {
                $gte: df2,
                $lte: dt2
            }
        });

    }

    //진행상태 조건 추가
    if(status_cd.length == 1){
        if (status_cd != '*') {
            AndQueries.push({
                status_cd: req.query.status_cd
            });
        }
    }else{
        AndQueries.push({
            status_cd: {"$in":req.query.status_cd}
        });
    }

    //처리된 내용검색 gbn 구분 추가
    //gbn=complete 시, status=3,4만 가져오기
    if (req.query.gbn == "complete") {
        AndQueries.push({
            $or: [
                //{
                //    "status_cd": "3"
                //}, 
                {
                    "status_cd": "4"
                }   
            ]
        });
    }

    //상위업무 조건 추가
    if (higher_cd != '*') {
        AndQueries.push({
            higher_cd: req.query.higher_cd
        });
    }

    //하위업무 조건 추가
    if (lower_cd != '*') {
        AndQueries.push({
            lower_cd: req.query.lower_cd
        });
    }

    //일반사용자 조건 추가
    if (req.session.user_flag == "9") {
        AndQueries.push({
            request_id: req.session.email
        });
    }

    //고객사관리자 조건 추가
    if (req.session.user_flag == "5") {
        AndQueries.push({
            request_company_cd: req.session.company_cd
            //higher_cd: {$ne: 'H008'}
        });
    }

    //업무담당자 조건 추가
    if (req.session.user_flag == "4") {            
        //회사코드가 존재하면
        if(req.query.user == "managerall"){
            if (company_cd != '*') {
                AndQueries.push({
                    request_company_cd: company_cd
                });
            }
        }else if(req.query.user == "manager"){
            if (company_cd != '*') {
                AndQueries.push({
                    request_company_cd: company_cd
                });
            }
        }
    }

    //업무관리자 조건 추가
    if (req.session.user_flag == "3") {
        if(req.query.user == "managerall"){
            if (company_cd != '*') {
                AndQueries.push({
                    request_company_cd: company_cd
                });
            }
        } else if(req.query.user == "manager"){
            if (company_cd != '*') {
                AndQueries.push({
                    request_company_cd: company_cd
                });
            }
        } else {
            AndQueries.push({
                manager_dept_cd: req.session.dept_cd
                //manager_dept_cd: "ISU_STISU_ST005"
            });
        }
    }

    //전체 관리자 조건 추가
    if(req.session.user_flag == "1") {
        if(req.query.user == "managerall" ){
            if (company_cd != '*') {
                AndQueries.push({
                    request_company_cd: company_cd
                });
            }
        } else if(req.query.user == "manager"){
            if (company_cd != '*' && company_cd != 'null' ) {
                AndQueries.push({
                    request_company_cd: company_cd
                });
            }
        }
    }

    console.log("=============================== createOrCondition ==================================");
    console.log("AndQueries : ",JSON.stringify(AndQueries));
    console.log("===============================================================================");

    logger.debug("=============================== createOrCondition ==================================");
    logger.debug("AndQueries : ",JSON.stringify(AndQueries));
    logger.debug("===============================================================================");

    return AndQueries;
}
 
                
