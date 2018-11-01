'use strict';

var express = require("express");
var router = express.Router();
var upload = require('./util/multer');
var ssc = require('./util/session');
var logger = require('log4js').getLogger(__filename);

var userCtrl = require("../app/controllers/api/user");
var incidentCtrl = require("../app/controllers/api/incident");
var statisticCtrl = require("../app/controllers/api/statistic");
var companyCtrl = require("../app/controllers/api/company");
var higherProcessCtrl = require("../app/controllers/api/higherProcess");
var lowerProcessCtrl = require("../app/controllers/api/lowerProcess");
var myProcessCtrl = require("../app/controllers/api/myProcess");
var companyProcessCtrl = require("../app/controllers/api/companyProcess");
var apiCtrl = require("../app/controllers/api/common");
var oftenQnaCtrl = require("../app/controllers/api/oftenqna");
var processGubunCtrl = require("../app/controllers/api/processGubun");
var dashboard0Ctrl = require("../app/controllers/api/dashboard0");
var dashboard1Ctrl = require("../app/controllers/api/dashboard1");
var dashboard2Ctrl = require("../app/controllers/api/dashboard2");
var dashboard3Ctrl = require("../app/controllers/api/dashboard3");


// Login route
router.post('/login', userCtrl.login);    //로그인
//router.post('/logout', userCtrl.logout);    //로그아웃


//Users route
router.post('/user/insertUser', ssc.sessionCheck, userCtrl.insertUser);    //사용자 신규등록
router.post('/user/addUser', ssc.sessionCheck, userCtrl.insert);    //사용자 추가등록
router.get('/user/empInfo', ssc.sessionCheck, userCtrl.empInfo);    //사용자 정보
router.get('/user/findEmp', ssc.sessionCheck, userCtrl.findEmp);    //사용자 찾기
router.get('/user/list', ssc.sessionCheck, userCtrl.list);          //사원정보관리
router.get('/user/accessList', ssc.sessionCheck, userCtrl.accessList);          //사원정보관리
router.put('/user/update', ssc.sessionCheck, userCtrl.update);      //사원정보수정
router.put('/user/initPassword', ssc.sessionCheck, userCtrl.initPassword);      //비밀번호 초기화
router.put('/user/accessConfirm', ssc.sessionCheck, userCtrl.accessConfirm);      //계정승인
router.delete('/user/delete', ssc.sessionCheck, userCtrl.delete);   //사원정보삭제
router.get('/user/myPage', ssc.sessionCheck, userCtrl.myPage);      //마이페이지 조회
router.put('/user/myPageUpdate', ssc.sessionCheck, userCtrl.myPageUpdate);      //마이페이지 수정


//Common api route
router.get('/higherProcess', ssc.sessionCheck, apiCtrl.higherProcess);    //상위업무 조회
router.get('/lowerProcess', ssc.sessionCheck, apiCtrl.lowerProcess);      //하위업무 조회
router.get('/myProcess', ssc.sessionCheck, apiCtrl.myProcess);            //본인업무 조회
router.get('/company', ssc.sessionCheck, apiCtrl.companyList);            //회사 조회
router.get('/processStatus', ssc.sessionCheck, apiCtrl.processStatus);    //진행상태 조회
router.get('/registerYyyy', ssc.sessionCheck, apiCtrl.registerYyyy);      //등록년도 조회
router.get('/processGubun', ssc.sessionCheck, apiCtrl.processGubun);      //처리구분 조회


//incident route
router.get('/incident/list', ssc.sessionCheck, incidentCtrl.list);    //인시던트 조회
router.get('/incident/detail', ssc.sessionCheck, incidentCtrl.detail);    //상세 조회
router.put('/incident/update', ssc.sessionCheck, incidentCtrl.update);    //인시던트 수정
router.post('/incident/new', ssc.sessionCheck, incidentCtrl.insert);     //문의하기 등록
router.post('/incident/download', ssc.sessionCheck, incidentCtrl.download);  //첨부파일 다운로드
router.put('/incident/valuation', ssc.sessionCheck, incidentCtrl.setValuation); //만족도 평가
router.put('/incident/changeHigher', ssc.sessionCheck, incidentCtrl.setChangeHigher); //상위업무 변경
router.put('/incident/receipt', ssc.sessionCheck, incidentCtrl.setReceipt); //업무 접수
router.put('/incident/complete', ssc.sessionCheck, incidentCtrl.setComplete); //업무 완료
router.put('/incident/n_complete', ssc.sessionCheck, incidentCtrl.setNComplete); //업무 미완료
router.put('/incident/hold', ssc.sessionCheck, incidentCtrl.setHold); //업무 협의
router.delete('/incident/delete', ssc.sessionCheck, incidentCtrl.delete);  //삭제
router.get('/incident/excelData', ssc.sessionCheck, incidentCtrl.excelData);    //엑셀데이타 조회
router.get('/incident/dashboard_list', ssc.sessionCheck, incidentCtrl.dashboard_list);    //dashboard용 인시던트 조회


//statistic route
router.get('/statistic/comHigher', ssc.sessionCheck, statisticCtrl.comHigher);  //회사별 상위별 건수
router.get('/statistic/statusCdCnt', ssc.sessionCheck, statisticCtrl.statusCdCnt);  //상태별 건수
router.get('/statistic/valuationCnt', ssc.sessionCheck, statisticCtrl.valuationCnt);  //만족도 건수
router.get('/statistic/monthlyCnt', ssc.sessionCheck, statisticCtrl.monthlyCnt);  //월별 건수
router.get('/statistic/higherCnt', ssc.sessionCheck, statisticCtrl.higherCdCnt);  //신청건수 상위

//processGubun route
router.get('/processGubun/list', ssc.sessionCheck, processGubunCtrl.list);          //처리구분 조회
router.put('/processGubun/update', ssc.sessionCheck, processGubunCtrl.update);      //처리구분 수정
router.post('/processGubun/new', ssc.sessionCheck, processGubunCtrl.insert);        //처리구분 등록
router.delete('/processGubun/delete', ssc.sessionCheck, processGubunCtrl.delete);   //처리구분 삭제


//company route
router.get('/company/list', ssc.sessionCheck, companyCtrl.list);            //회사 조회
router.put('/company/update', ssc.sessionCheck, companyCtrl.update);        //회사 수정
router.post('/company/new', ssc.sessionCheck, companyCtrl.insert);          //회사 등록
router.delete('/company/delete', ssc.sessionCheck, companyCtrl.delete);     //회사 삭제


//higherProcess route
router.get('/higherProcess/list', ssc.sessionCheck, higherProcessCtrl.list);                  //상위업무 조회
router.put('/higherProcess/update', ssc.sessionCheck, higherProcessCtrl.update);              //상위업무 수정
router.post('/higherProcess/new', ssc.sessionCheck, higherProcessCtrl.insert);                //상위업무 등록
router.delete('/higherProcess/delete', ssc.sessionCheck, higherProcessCtrl.delete);           //상위업무 삭제


//lowerProcess route
router.get('/lowerProcess/list', ssc.sessionCheck, lowerProcessCtrl.list);                  //상위업무 조회
router.put('/lowerProcess/update', ssc.sessionCheck, lowerProcessCtrl.update);              //상위업무 수정
router.post('/lowerProcess/new', ssc.sessionCheck, lowerProcessCtrl.insert);                //상위업무 등록
router.delete('/lowerProcess/delete', ssc.sessionCheck, lowerProcessCtrl.delete);           //상위업무 삭제


//oftenqna route
router.get('/qna/list', ssc.sessionCheck, oftenQnaCtrl.list);               //자주묻는질문과답 조회(관리자)
router.get('/qna/userlist', ssc.sessionCheck, oftenQnaCtrl.userlist);       //자주묻는질문과답 조회(사용자)
router.put('/qna/update', ssc.sessionCheck, oftenQnaCtrl.update);           //자주묻는질문과답 수정
router.delete('/qna/delete', ssc.sessionCheck, oftenQnaCtrl.delete);        //자주묻는질문과답 삭제
router.post('/qna/new', ssc.sessionCheck, oftenQnaCtrl.insert);             //자주묻는질문과답 등록
router.get('/qna/getPopUpYN', ssc.sessionCheck, oftenQnaCtrl.getPopUpYN);   //팝업공지 체크 조회
router.post('/qna/download', ssc.sessionCheck, oftenQnaCtrl.download);  //첨부파일 다운로드

//myProcess route
router.get('/myProcess/myProcessTree', ssc.sessionCheck, myProcessCtrl.myProcessTree);    //나의업무 체계 조회
router.put('/myProcess/update', ssc.sessionCheck, myProcessCtrl.update);    //나의업무 체계 수정


//companyProcess route
router.get('/companyProcess/companyProcessTree', ssc.sessionCheck, companyProcessCtrl.companyProcessTree);    //회사별 업무 체계 조회
router.put('/companyProcess/update', ssc.sessionCheck, companyProcessCtrl.update);    //회사별 업무 체계 수정


//dashboard
router.get('/dashboard/chart0_1', ssc.sessionCheck, dashboard0Ctrl.chart0_1); //년도별 월별 업무별  (요청자/접수자)건수
router.get('/dashboard/chart0_2', ssc.sessionCheck, dashboard0Ctrl.chart0_2); //년도별 월별 업무별 (요청자/접수자) 만족도별 건수
router.get('/dashboard/chart0_3', ssc.sessionCheck, dashboard0Ctrl.chart0_3); //년도별 월별 업무별 (요청자/접수자) 만족도 평균

router.get('/dashboard/chart1', ssc.sessionCheck, dashboard1Ctrl.chart1);     //년간 월별 차트5
router.get('/dashboard/chart1_1', ssc.sessionCheck, dashboard1Ctrl.chart1_1); //년도별 월별 회사별 업무별 처리현황
router.get('/dashboard/chart1_2', ssc.sessionCheck, dashboard1Ctrl.chart1_2); //년도별 월별 상위 회사5
router.get('/dashboard/chart1_3', ssc.sessionCheck, dashboard1Ctrl.chart1_3); //년도별 월별 상위 업무5
router.get('/dashboard/chart1_4', ssc.sessionCheck, dashboard1Ctrl.chart1_4);
router.get('/dashboard/chart1_5', ssc.sessionCheck, dashboard1Ctrl.chart1);
router.get('/dashboard/chart1_6', ssc.sessionCheck, dashboard1Ctrl.chart1);
router.get('/dashboard/chart1_7', ssc.sessionCheck, dashboard1Ctrl.chart1);

router.get('/dashboard/chart2', ssc.sessionCheck, dashboard2Ctrl.chart2);     //년도별 월별 업무별 만족도 상위5
router.get('/dashboard/chart2_1', ssc.sessionCheck, dashboard2Ctrl.chart2_1); //년도별 업무별 회사별 만족도
router.get('/dashboard/chart2_2', ssc.sessionCheck, dashboard2Ctrl.chart2_2); //년도별 월별 업무별 회사별 만족도 건수
router.get('/dashboard/chart2_3', ssc.sessionCheck, dashboard2Ctrl.chart2_3); //년도별 월별 만족도 상위 회사 10 
router.get('/dashboard/chart2_4', ssc.sessionCheck, dashboard2Ctrl.chart2_4); //년도별 월별 만족도 하위 회사 10 
router.get('/dashboard/chart2_5', ssc.sessionCheck, dashboard2Ctrl.chart2);
router.get('/dashboard/chart2_6', ssc.sessionCheck, dashboard2Ctrl.chart2);
router.get('/dashboard/chart2_7', ssc.sessionCheck, dashboard2Ctrl.chart2);

router.get('/dashboard/chart3', ssc.sessionCheck, dashboard3Ctrl.chart3);      //년도별 요청자/담당자 수
router.get('/dashboard/chart3_1', ssc.sessionCheck, dashboard3Ctrl.chart3_1);  //년도별 요청자 상위5
router.get('/dashboard/chart3_2', ssc.sessionCheck, dashboard3Ctrl.chart3_2);  //년도별 접수자 상위5
router.get('/dashboard/chart3_3', ssc.sessionCheck, dashboard3Ctrl.chart3_3);  //년도별 만족도 상위5
router.get('/dashboard/chart3_4', ssc.sessionCheck, dashboard3Ctrl.chart3_4);  //년도별 요청자 하위5
router.get('/dashboard/chart3_5', ssc.sessionCheck, dashboard3Ctrl.chart3_5);  //업무별 요청자/담당자 수
//router.get('/dashboard/chart3_6', ssc.sessionCheck, dashboard3Ctrl.chart3_6);


//upload incident attach file 
router.post('/upload-file', ssc.sessionCheck, function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.json({success:fasle, err:err.toString()});
    }
    return res.json(req.file); 
  });
});

module.exports = router;
