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

        return { findIncident: findIncident };

    }
};

/**
 * or 조건 만들기
 */
function createOrCondition(req){
    var OrQueries = [];
    if (req.query.searchType && req.query.searchText) {
        var searchTypes = req.query.searchType.toLowerCase().split(",");
        if (searchTypes.indexOf("title") >= 0) {
            OrQueries.push({
                title: {
                    $regex: new RegExp(req.query.searchText, "i")
                }
            });
        } else if (searchTypes.indexOf("content") >= 0) {
            OrQueries.push({
                content: {
                    $regex: new RegExp(req.query.searchText, "i")
                }
            });
        } else if (searchTypes.indexOf("request") >= 0) {
            OrQueries.push({
                request_nm: {
                    $regex: new RegExp(req.query.searchText, "i")
                }
            });
        } else if (searchTypes.indexOf("manager") >= 0) {
            OrQueries.push({
                manager_nm: {
                    $regex: new RegExp(req.query.searchText, "i")
                }
            });
        } else if (searchTypes.indexOf("title,content") >= 0) {
            OrQueries.push({
                title: {
                    $regex: new RegExp(req.query.searchText, "i")
                },
                content: {
                    $regex: new RegExp(req.query.searchText, "i")
                }
            });
        }
    }
    if(req.query.complete){
        OrQueries.push({'status_cd':'3'});
        OrQueries.push({'status_cd':'4'});
    }
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
            var df2 = df.toISOString();

            var dt = new Date(reg_date_to);
            var dt2 = dt.toISOString();


        }else{        

            var df = new Date(reg_date_from);
            df.setDate(df.getDate()-1);
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
    if (status_cd != '*') {
        AndQueries.push({
            status_cd: req.query.status_cd
        });
    }

    //처리된 내용검색 gbn 구분 추가
    //gbn=complete 시, status=3,4만 가져오기
    if (req.query.gbn == "complete") {
        AndQueries.push({
            $or: [{
                "status_cd": "3"
            }, {
                "status_cd": "4"
            }]
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
    return AndQueries;
}

               
                
