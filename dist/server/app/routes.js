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
router.post('/login', userCtrl.login);


//Users route
router.post('/addUser', userCtrl.insert);
router.get('/empInfo', userCtrl.empInfo);


//Common api route
router.get('/higherProcess', apiCtrl.higherProcess);
router.get('/processStatus', apiCtrl.processStatus);


//incident route
router.get('/incident/userlist', incidentCtrl.userlist);
router.get('/incident/detail', incidentCtrl.detail);
router.post('/incident/new', incidentCtrl.insert);
router.put('/incident/valuation', incidentCtrl.putValuation);
router.delete('/incident/delete', incidentCtrl.delete);
router.post('/incident/download', incidentCtrl.download);


//statistic route
router.get('/statistic/comHigher', statisticCtrl.comHigher);
router.get('/statistic/statusCdCnt', statisticCtrl.statusCdCnt);


//upload incident attach file 
router.post('/upload-file', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.json({success:fasle, err:err.toString()});
    }
    return res.json(req.file); 
  });
});

//company route
router.get('/company/list', companyCtrl.list);


module.exports = router;
