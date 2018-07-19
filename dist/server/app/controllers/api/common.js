'use strict';

var mongoose = require('mongoose');
var async = require('async');
var IncidentModel = require('../../models/Incident');
var HigherProcessModel = require('../../models/HigherProcess');
var ProcessStatusModel = require('../../models/ProcessStatus');
var CompanyModel = require('../../models/Company');
var logger = require('log4js').getLogger('app');

module.exports = {

    /**
     * 상위업무 조회
     */
    higherProcess: (req, res, next) => {
        
        //console.log("=====================");
        //console.log("condition : ", condition);
        //console.log("=====================");

        try {
            var condition = {};
            condition.use_yn = "사용";

            //if (req.query.company_cd != null) {
            //    condition.company_cd = req.query.company_cd;
            //}
            
            console.log("=============================================");
            console.log("getHigherProcess condition : ", condition);
            console.log("=============================================");

            HigherProcessModel.find(condition, function (err, higherProcess) {
                if (err) {
                    return res.json(null);
                } else {
                    res.json(higherProcess);
                }
            }).sort('higher_nm');
        } catch (e) {
            console.log(e);
        }finally{}
    },

    /**
     * 진행상태 조회
     */
    processStatus: (req, res, next) => {
        
        //console.log("=====================");
        //console.log("condition : ", condition);
        //console.log("=====================");

        try {
            var condition = {};

            ProcessStatusModel.find(condition, function (err, processStatus) {
                if (err) {
                    return res.json(null);
                } else {
                    res.json(processStatus);
                }
            }).sort('sort_lvl');
        } catch (e) {
            console.log(e);
        }finally{}
    },

    /**
     * 회사조회
     */
    company: (req, res, next) => {

        CompanyModel.find({}, function (err, company) {
            
            if (err) {
                res.json(null);
            }else{

                //console.log("=====================");
                //console.log("company : ", company);
                //console.log("=====================");

                var rtnVal = [];

                company.forEach(function(company, index, companyArray){

                    var newCompany = {};
                    newCompany.company_cd             = company.company_cd               //회사코드
                    newCompany.company_nm             = company.company_nm               //회사이름   
                    
                    rtnVal.push(newCompany);
                });
                                                      

                //console.log("=====================");
                //console.log("rtnVal : ", rtnVal);
                //console.log("=====================");

                res.json(rtnVal);
            }
        }).sort({
            group_flag: -1,
            company_nm: 1
        });
    },
};