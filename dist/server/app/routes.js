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
var myProcessCtrl = require("../app/controllers/api/myProcess");
var companyProcessCtrl = require("../app/controllers/api/companyProcess");
var apiCtrl = require("../app/controllers/api/common");
var oftenQnaCtrl = require("../app/controllers/api/oftenqna");


// Login route
router.post('/login', userCtrl.login);    //로그인
//router.post('/logout', userCtrl.logout);    //로그아웃


//Users route
router.post('/addUser', ssc.sessionCheck, userCtrl.insert);    //사용자 추가등록
router.get('/empInfo', ssc.sessionCheck, userCtrl.empInfo);    //사용자 정보
router.get('/findEmp', ssc.sessionCheck, userCtrl.findEmp);    //사용자 찾기



//usermanage route
router.get('/user/list', ssc.sessionCheck, userCtrl.list);    //사원정보관리



//Common api route

router.get('/higherProcess', ssc.sessionCheck, apiCtrl.higherProcess);    //상위업무 조회
router.get('/lowerProcess', ssc.sessionCheck, apiCtrl.lowerProcess);      //하위업무 조회
router.get('/myProcess', ssc.sessionCheck, apiCtrl.myProcess);            //본인업무 조회
router.get('/company', ssc.sessionCheck, apiCtrl.companyList);            //회사 조회
router.get('/processStatus', ssc.sessionCheck, apiCtrl.processStatus);    //진행상태 조회
router.get('/processGubun', ssc.sessionCheck, apiCtrl.processGubun);      //처리구분 조회
router.get('/registerYyyy', ssc.sessionCheck, apiCtrl.registerYyyy);      //등록년도 조회

//incident route

router.get('/incident/list', ssc.sessionCheck, incidentCtrl.list);    //인시던트 조회
router.get('/incident/detail', ssc.sessionCheck, incidentCtrl.detail);    //상세조회
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


//statistic route

router.get('/statistic/comHigher', ssc.sessionCheck, statisticCtrl.comHigher);  //회사별 상위별 건수
router.get('/statistic/statusCdCnt', ssc.sessionCheck, statisticCtrl.statusCdCnt);  //상태별 건수
router.get('/statistic/valuationCnt', ssc.sessionCheck, statisticCtrl.valuationCnt);  //만족도 건수
router.get('/statistic/monthlyCnt', ssc.sessionCheck, statisticCtrl.monthlyCnt);  //월별 건수
router.get('/statistic/higherCnt', ssc.sessionCheck, statisticCtrl.higherCdCnt);  //신청건수 상위


//company route

router.get('/company/list', ssc.sessionCheck, companyCtrl.list); //회사 조회
router.put('/company/update', ssc.sessionCheck, companyCtrl.update); //회사 수정

//higherProcess route

router.get('/higherProcess/list', ssc.sessionCheck, higherProcessCtrl.list); //상위업무 조회
router.put('/higherProcess/update', ssc.sessionCheck, higherProcessCtrl.update); //상위업무 수정

//oftenqna route

router.get('/qna/list', ssc.sessionCheck, oftenQnaCtrl.list);         //자주묻는질문과답 조회(관리자)
router.get('/qna/userlist', ssc.sessionCheck, oftenQnaCtrl.userlist); //자주묻는질문과답 조회(사용자)
router.put('/qna/update', ssc.sessionCheck, oftenQnaCtrl.update);     //자주묻는질문과답 수정
router.delete('/qna/delete', ssc.sessionCheck, oftenQnaCtrl.delete);  //자주묻는질문과답 삭제
router.post('/qna/new', ssc.sessionCheck, oftenQnaCtrl.insert);       //자주묻는질문과답 등록


//myProcess route
router.get('/myProcess/myProcessTree', ssc.sessionCheck, myProcessCtrl.myProcessTree);    //나의업무 체계 조회
router.put('/myProcess/update', ssc.sessionCheck, myProcessCtrl.update);    //나의업무 체계 수정

//companyProcess route
router.get('/companyProcess/companyProcessTree', ssc.sessionCheck, companyProcessCtrl.companyProcessTree);    //회사별 업무 체계 조회
router.put('/companyProcess/update', ssc.sessionCheck, companyProcessCtrl.update);    //회사별 업무 체계 수정

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
