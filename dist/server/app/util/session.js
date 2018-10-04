'use strict';

var async = require('async');
var UserToken = require('../models/UserToken');
const logger = require('log4js').getLogger('app');

module.exports = {

    sessionCheck: (req, res, next) => {
        
        //console.log('=====================session=================');
        //console.log('req.cookies : ' , req.cookies);
        //console.log('req.session.email : ' , req.session.email);
        //console.log('req.session.user_flag : ' , req.session.user_flag);
        //console.log('req.session.group_flag : ' , req.session.group_flag);
        //console.log('req.session.dept_cd : ' , req.session.dept_cd);
        //console.log('=============================================\n');

        if (req.session.email != null || req.session.email != undefined) {
            next();
        } else { 
            //console.log("xxxxxxxxxxx req.session is null");
            if(req.cookies.email){
                //console.log("yyyyyyyyyy req.cookies.email : ", req.cookies.email);
                try {
                    /**
                     * 토근 비교
                     */
                    var condition = {};
                    condition.email = req.cookies.email;
                    //console.log("condition.email : ", condition.email);
                    UserToken.findOne(condition).exec(function (err, userToken) {
                        //console.log("userToken : ", userToken);
                        if (userToken != null) {
                            //console.log("userToken != null");
                            //console.log("req.cookies.token : ",req.cookies.token);
                            if (userToken.token == req.cookies.token){ //토근이 일치하면
                                //console.log("okokokokokok");
                                req.session.email = req.cookies.email;
                                req.session.user_id = req.cookies.email;
                                req.session.sabun = req.cookies.email;
                                req.session.user_flag = req.cookies.user_flag;
                                req.session.group_flag = req.cookies.group_flag;
                                req.session.user_nm = req.cookies.employee_nm;
                                req.session.company_cd = req.cookies.company_cd;
                                req.session.company_nm = req.cookies.company_nm;
                                req.session.dept_cd = req.cookies.dept_cd;
                                req.session.dept_nm = req.cookies.dept_nm;
                                req.session.position_nm = req.cookies.position_nm;
                                req.session.jikchk_nm = req.cookies.jikchk_nm;
                                req.session.office_tel_no = req.cookies.office_tel_no;
                                req.session.hp_telno = req.cookies.hp_telno;
                                next();
                            }else{
                                return res.sendStatus(403);
                            }
                        }
                    });
                } catch (e) {
                    logger.debug(e);
                    return res.sendStatus(403);
                }
            }
        }
    }
}