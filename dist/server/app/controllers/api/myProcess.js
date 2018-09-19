'use strict';

var async = require('async');
var HigherProcess = require('../../models/HigherProcess');
var LowerProcess = require('../../models/LowerProcess');
var MyProcess = require('../../models/MyProcess');
var logger = require('log4js').getLogger('app');

module.exports = {

    /**
     * 나의 업무 체계 조회
     */
    myProcessTree: (req, res, next) => {

        try {

            async.waterfall([function (callback) {
                
                var condition = {};
                if (req.query.higher_cd != "*") {
                    condition.higher_cd = req.query.higher_cd;
                }
                //condition.user_flag = { $ne: '0' };
                condition.use_yn = '사용';

                HigherProcess.find(condition, function (err, hp) {
                    if (!err) {
                        callback(null, hp);
                    }
                }).sort('sort_lvl');
            
            },
            function (hp, callback) {

                var condition = {};
                //condition.user_flag = { $ne: '0' };
                condition.use_yn = '사용';

                LowerProcess.find(condition, function (err, lp) {
                    if (!err) {
                        callback(null, hp, lp);
                    }
                }).sort('lower_nm');

            }], function (err, higherProcess, lowerProcess) {

                var condition = {};
                condition.email = req.session.email;

                MyProcess.find(condition, function (err, mp) {
                    
                    if (!err) {

                        var rtnArr = [];

                        //비교용 myProcessArr 생성
                        var myProcessArr = getMyprocess(req, mp);

                        higherProcess.forEach(hp => {

                            var higher = {};
                            higher.text = hp.higher_nm;
                            higher.value = hp.higher_cd;
                            higher.lower = [];
                            var lowerArr = [];

                            lowerProcess.forEach(lp => {

                                if(hp.higher_cd == lp.higher_cd){
                                    
                                    var lower = {};
                                    var val = {};
                
                                    val.company_cd = req.session.company_cd;
                                    val.company_nm = req.session.company_nm;
                                    val.dept_cd = req.session.dept_cd;
                                    val.dept_nm = req.session.dept_nm;
                                    val.email = req.session.email;
                                    val.employee_nm = req.session.employee_nm;

                                    val.higher_cd = lp.higher_cd;
                                    val.higher_nm = lp.higher_nm;
                                    val.lower_cd = lp.lower_cd;
                                    val.lower_nm = lp.lower_nm;

                                    lower.text = lp.lower_nm;
                                    lower.value = val;
                                    lower.checked = false;

                                    myProcessArr.forEach(mpt => {
                                        if (mpt == lp.lower_cd) {
                                            //체크 처리
                                            lower.checked = true;
                                        }
                                    });
                                    
                                    lowerArr.push(lower);
                                    higher.lower = lowerArr;
                                }

                            });
                            //하위업무가 있을 때만 상위업무에 포함
                            if(higher.lower.length > 0){
                                rtnArr.push(higher);
                            }

                        });
                        res.json(rtnArr);
                    }
                });

            
            });
        } catch (err) {

            logger.error("common control myProcess error : ", err);
            return res.json({
            success: false,
            message: err
            });

        } finally {

        }
    },

    /**
     * 나의 업무 수정
     */
    update: (req, res, next) => {
        try{

            var condition = {}; //조건
            condition.company_cd    = req.session.company_cd; //회사코드
            condition.email         = req.session.email; //이메일
            if(req.body.higher_cd != null && req.body.higher_cd != "*"){
                condition.higher_cd = req.body.higher_cd;
            }

            MyProcess.deleteMany(condition, function( err, writeOpResult ){

                if (!err){
                    
                    if(req.body.myProcess.length > 0){

                        var newMyProcessModel = req.body.myProcess;

                        MyProcess.create(newMyProcessModel, function (err, writeOpResult) {
                            if (err) {
                                res.json({
                                    success: false,
                                    message: err
                                }); 
                            } else {
                                res.json({
                                    success: true,
                                    message: "저장되었습니다."
                                }); 
                            }
                        });
                    }else{
                        res.json({
                            success: true,
                            message: "저장되었습니다."
                        }); 
                    }
                    
                    
                }
            });
        }catch(e){
            logger.log("myProcess controllers update : ", e);
        }finally{}
    },


}



/**
 * 본인 하위 업무 조회
 * @param {*} req 
 * @param {*} res 
 * @param {*} userInfo 
 */
function getMyprocess(req, processInfo) {

    var rtnArr = [];
    processInfo.forEach((ps) => {
        if (ps.email == req.session.email) {
        rtnArr.push(ps.lower_cd);
        }
    });

    return rtnArr;

}