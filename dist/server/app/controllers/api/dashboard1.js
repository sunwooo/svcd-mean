'use strict';

var async = require('async');
var Incident = require('../../models/Incident');
var MyProcess = require('../../models/MyProcess');
var service = require('../../services/dashboard1')
var alimi = require('../../util/alimi');
var CONFIG = require('../../../config/config.json');
var moment = require('moment');
var logger = require('log4js').getLogger('app');
var path = require('path');


module.exports = {

  /**
   * 년도별 월별 문의 건수
   */
  chart1: (req, res, next) => {

    try {
        var svc = service.chart1(req);
  
        //console.log("chart1 svc : ", JSON.stringify(svc));
  
        Incident.aggregate(svc.aggregatorOpts)
          .exec(function (err, incident) {
  
            if (err) {
  
              //console.log("==================================================");
              //console.log(" Dashboard.aggregate error ", err);
              //console.log("==================================================");
  
              return res.json({
                success: false,
                message: err
              });
  
            } else {
  
              res.json(incident);
  
              //console.log("chart1 svc : ", JSON.stringify(incident));
  
            }
          });
  
      } catch (err) {
        return res.json({
          success: false,
          message: err
        });
      }finally {}

  },

  chart1_1: (req, res, next) => {

    try {
      var svc = service.requestCompany_count(req);

      //console.log("chart1_1 svc : ", JSON.stringify(svc));

      Incident.aggregate(svc.aggregatorOpts)
        .exec(function (err, incident) {

          if (err) {

            //console.log("==================================================");
            //console.log(" Dashboard.aggregate error ", err);
            //console.log("==================================================");

            return res.json({
              success: false,
              message: err
            });

          } else {

            res.json(incident);

            //console.log("incident : ", JSON.stringify(incident));

          }
        });

    } catch (err) {
      return res.json({
        success: false,
        message: err
      });
    }
  },

  /**
   * 상위업무별 문의 건수
   */
  chart1_2: (req, res, next) => {

    try {
      var svc = service.company_reqcnt(req);

      Incident.aggregate(svc.aggregatorOpts).exec(function (err, incident) {

        if (err) {
          return res.json({
            success: false,
            message: err
          });
        } else {
          res.json(incident);
        }
      });

    } catch (e) {
      return res.json({
        success: false,
        message: e
      });
    }
  },

  /**
   * 상위업무별 문의 건수
   */
  chart1_3: (req, res, next) => {

    try {
      var svc = service.process_cnt(req);

      /*

      Incident.aggregate(svc.aggregatorOpts).exec(function (err, incident) {

        if (err) {
          return res.json({
            success: false,
            message: err
          });
        } else {
          res.json(incident);
        }
      });
      */

    } catch (e) {
      return res.json({
        success: false,
        message: e
      });
    }
  },

   /**
   * 진행상태 건수
   */
  chart1_4: (req, res, next) => {

    try {
        var svc = service.chat1_4(req);
  
        Incident.aggregate(svc.aggregatorOpts).exec(function (err, incident) {
  
          if (!err) {

            //console.log("==================================================");
            //console.log(" incident chart2_4: ",JSON.stringify(incident));
            //console.log("==================================================");

            res.json(incident);
          }
        });
  
      } catch (e) {
        return res.json({
          success: false,
          message: e
        });
      }
  },


};
