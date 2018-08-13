'use strict';

var express = require("express");
var router = express.Router();
var upload = require('./util/multer');
var logger = require('log4js').getLogger(__filename);

var userCtrl = require("../app/controllers/api/user");
var incidentCtrl = require("../app/controllers/api/incident");
var statisticCtrl = require("../app/controllers/api/statistic");
var companyCtrl = require("../app/controllers/api/company");
var higherProcessCtrl = require("../app/controllers/api/higherProcess");
var apiCtrl = require("../app/controllers/api/common");


// Login route
router.post('/login', userCtrl.login);    //로그인
//router.post('/logout', userCtrl.logout);    //로그아웃


//Users route
router.post('/addUser', userCtrl.insert);    //사용자 추가등록
router.get('/empInfo', userCtrl.empInfo);    //사용자 정보
router.get('/findEmp', userCtrl.findEmp);    //사용자 찾기


//usermanage route
router.get('/user/list', userCtrl.list);    //사원정보관리


//Common api route
router.get('/higherProcess', apiCtrl.higherProcess);    //상위업무 조회
router.get('/lowerProcess', apiCtrl.lowerProcess);      //하위업무 조회
router.get('/myProcess', apiCtrl.myProcess);            //본인업무 조회
router.get('/company', apiCtrl.companyList);            //회사 조회
router.get('/processStatus', apiCtrl.processStatus);    //진행상태 조회
router.get('/processGubun', apiCtrl.processGubun);      //처리구분 조회


//incident route
router.get('/incident/list', incidentCtrl.list);    //인시던트 조회
router.get('/incident/detail', incidentCtrl.detail);    //상세조회
router.post('/incident/new', incidentCtrl.insert);     //문의하기 등록
router.post('/incident/download', incidentCtrl.download);  //첨부파일 다운로드
router.put('/incident/valuation', incidentCtrl.setValuation); //만족도 평가
router.put('/incident/changeHigher', incidentCtrl.setChangeHigher); //상위업무 변경
router.put('/incident/receipt', incidentCtrl.setReceipt); //업무 접수
router.put('/incident/complete', incidentCtrl.setComplete); //업무 완료
router.put('/incident/n_complete', incidentCtrl.setNComplete); //업무 미완료
router.put('/incident/hold', incidentCtrl.setHold); //업무 협의
router.delete('/incident/delete', incidentCtrl.delete);  //삭제
router.get('/incident/excelData', incidentCtrl.excelData);    //엑셀데이타 조회


//statistic route
router.get('/statistic/comHigher', statisticCtrl.comHigher);  //회사별 상위별 건수
router.get('/statistic/statusCdCnt', statisticCtrl.statusCdCnt);  //상태별 건수
router.get('/statistic/valuationCnt', statisticCtrl.valuationCnt);  //만족도 건수
router.get('/statistic/monthlyCnt', statisticCtrl.monthlyCnt);  //월별 건수
router.get('/statistic/higherCnt', statisticCtrl.higherCdCnt);  //신청건수 상위


//company route
router.get('/company/list', companyCtrl.list); //회사 조회
router.put('/company/update', companyCtrl.update); //회사 수정

//higherProcess route
router.get('/higherProcess/list', higherProcessCtrl.list); //상위업무 조회
router.put('/higherProcess/update', higherProcessCtrl.update); //상위업무 수정

//upload incident attach file 
router.post('/upload-file', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.json({success:fasle, err:err.toString()});
    }
    return res.json(req.file); 
  });
});

module.exports = router;
