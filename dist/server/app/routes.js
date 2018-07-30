'use strict';

var express = require("express");
var router = express.Router();
var upload = require('./util/multer');
var logger = require('log4js').getLogger(__filename);

var userCtrl = require("../app/controllers/api/user");
var incidentCtrl = require("../app/controllers/api/incident");
var statisticCtrl = require("../app/controllers/api/statistic");
var companyCtrl = require("../app/controllers/api/company");
var apiCtrl = require("../app/controllers/api/common");


// Login route
router.post('/login', userCtrl.login);    //로그인


//Users route
router.post('/addUser', userCtrl.insert);    //사용자 추가등록
router.get('/empInfo', userCtrl.empInfo);    //사용자 정보

//usermanage route
router.get('/user/list', userCtrl.list);    //사원정보관리


//Common api route
router.get('/higherProcess', apiCtrl.higherProcess);    //상위업무 조회
router.get('/processStatus', apiCtrl.processStatus);    //진행상태 조회


//incident route
router.get('/incident/userlist', incidentCtrl.userlist);    //처리진행현황(본인데이타)
router.get('/incident/incidnetList', incidentCtrl.incidnetList);    //문의 리스트 조회
router.get('/incident/detail', incidentCtrl.detail);    //상세조회
router.post('/incident/new', incidentCtrl.insert);     //문의하기 등록
router.put('/incident/valuation', incidentCtrl.putValuation); //만족도 평가
router.delete('/incident/delete', incidentCtrl.delete);  //삭제
router.post('/incident/download', incidentCtrl.download);  //첨부파일 다운로드


//statistic route
router.get('/statistic/comHigher', statisticCtrl.comHigher);  //회사별 상위별 건수
router.get('/statistic/statusCdCnt', statisticCtrl.statusCdCnt);  //상태별 건수
router.get('/statistic/valuationCnt', statisticCtrl.valuationCnt);  //만족도 건수
router.get('/statistic/monthlyCnt', statisticCtrl.monthlyCnt);  //월별 건수
router.get('/statistic/higherCnt', statisticCtrl.higherCdCnt);  //신청건수 상위


//company route
router.get('/company/list', companyCtrl.list); //회사 조회


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
