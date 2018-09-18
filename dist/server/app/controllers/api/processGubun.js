'use strict';

const mongoose = require('mongoose');
const async = require('async');
const HigherProcessModel = require('../../models/HigherProcess');
const ProcessGubunModel = require('../../models/ProcessGubun');
const ProcessStatusModel = require('../../models/ProcessStatus');
const logger = require('log4js').getLogger('app');
const service = require('../../services/processgubun');

module.exports = {

  /**
   * 신규 등록 페이지 출력
   */
  insert: (req, res, next) => {
    var processGubunCode = req.body.processGubunCode;

    async.waterfall([function (callback) {
      ProcessGubunModel.count({
        'process_cd': processGubunCode.process_cd
      }, function (err, processGubunCodeCnt) {
        if (err) {
          return res.json({
            success: false,
            message: err
          });
        } else {
          callback(null, processGubunCodeCnt);
        }
      });
    }], function (err, processGubunCodeCnt) {
      var rtnData = {};

      if (processGubunCodeCnt > 0) {
        rtnData.message = "중복된 코드가 존재합니다.";

        return res.json({
          success: false,
          message: rtnData.message
        });
      } else {
        ProcessGubunModel.create(req.body.processGubunCode, function (err, processGubunCode) {
          if (err) {
            return res.json({
              success: false,
              message: err
            });
          } else {
            return res.json({
              success: true,
              message: "insert successed"
            });
          }
        });
      }
    });
  },

  /**
   * 업데이트
   */
  update: (req, res, next) => {
    try {
      ProcessGubunModel.findOneAndUpdate({
        _id: req.body.processGubunCodeDetail.id
      }, req.body.processGubunCodeDetail, function (err, processGubun) {
        if (err) {
          return res.json({
            success: false,
            message: err
          });
        } else {
          return res.json({
            success: true,
            message: "update successed"
          });
        }
      });
    } catch (e) {
      console.log("processGubun controller update error > ", e);
    }
  },

  /**
   * 삭제 처리
   */
  delete: (req, res, next) => {
    try {
      ProcessGubunModel.findOneAndRemove({
        _id: req.body._id
      }, function (err, processGubun) {
        if (err) {
          return res.json({
            success: false,
            message: err
          });
        } else {
          return res.json({
            success: true,
            message: "delete successed"
          });
        }
      });
    } catch (e) {
      console.log("processGubun controller delete error > ", e);
    }
  },


  list: (req, res, next) => {
    //console.log("processGubun controller list start!");
    var search = service.createSearch(req);

    var page = 1;
    var perPage = 15;

    //console.log("==========================================getLowerProcess=======================================");
    //console.log("req.query.page : ", req.query.page);
    //console.log("req.query.perPage : ", req.query.perPage);
    //console.log("req.query.searchText : ", req.query.searchText);
    //console.log("================================================================================================");

    if (req.query.page != null && req.query.page != '') page = Number(req.query.page);
    if (req.query.perPage != null && req.query.perPage != '') perPage = Number(req.query.perPage);

    async.waterfall([function (callback) {
      ProcessGubunModel.count(search.findIncident, function (err, totalCnt) {
        if (err) {
          return res.json({
            success: false,
            message: err
          });
        } else {
          callback(null, totalCnt);
        }
      });
    }], function (err, totalCnt) {
      ProcessGubunModel.find(search.findIncident, function (err, processGubun) {

          if (err) {
            return res.json({
              success: false,
              message: err
            });
          } else {
            var rtnData = {};
            rtnData.processGubun = processGubun;
            rtnData.totalCnt = totalCnt;
            rtnData.totalPage = Math.ceil(totalCnt / perPage);

            res.json(rtnData);
          }
        }).sort({
          process_nm: 1
        })
        .skip((page - 1) * perPage)
        .limit(perPage);
    });
  },




};
