'use strict';

var async = require('async');
var UserToken = require('../models/UserToken');
var jwt = require('jsonwebtoken');
const logger = require('log4js').getLogger('app');

module.exports = {

    sessionCheck: (req, res, next) => {
        
        //console.log('=====================session=================');
        //console.log('req : ' , req);
        //console.log('req.headers.authorization : ' , req.headers.authorization);
        //console.log('req.session.email : ' , req.session.email);
        //console.log('req.session.user_flag : ' , req.session.user_flag);
        //console.log('req.session.group_flag : ' , req.session.group_flag);
        //console.log('req.session.dept_cd : ' , req.session.dept_cd);
        //console.log('=============================================\n');

        var tokenUser;

        if(req.headers.authorization){
            tokenUser = jwt.decode(req.headers.authorization).user;
        }
        
        //console.log('=============================================\n');
        //console.log('tokenUser : ' , tokenUser);
        //console.log('=============================================\n');

        if (req.session.email != null || req.session.email != undefined) {
            next();
        } else { 
            //console.log("xxxxxxxxxxx req.session is null");
            if(tokenUser.email){
                //console.log("yyyyyyyyyy tokenUser.email : ", tokenUser.email);
                try {
                    /**
                     * 토근 비교
                     */
                    var condition = {};
                    condition.email = tokenUser.email;
                    //console.log("condition.email : ", condition.email);
                    UserToken.findOne(condition).exec(function (err, userToken) {
                        //console.log("userToken : ", userToken);
                        if (userToken != null) {
                            
                            //console.log("userToken != null");
                            //console.log("userToken.token : ",userToken.token);
                            //console.log("tokenUser.token : ",tokenUser.token);
                            
                            //if (userToken.token == tokenUser.token){ //토근이 일치하면
                                req.session.email = tokenUser.email;
                                req.session.user_id = tokenUser.email;
                                req.session.sabun = tokenUser.email;
                                req.session.user_flag = tokenUser.user_flag;
                                req.session.group_flag = tokenUser.group_flag;
                                req.session.user_nm = tokenUser.employee_nm;
                                req.session.company_cd = tokenUser.company_cd;
                                req.session.company_nm = tokenUser.company_nm;
                                req.session.dept_cd = tokenUser.dept_cd;
                                req.session.dept_nm = tokenUser.dept_nm;
                                req.session.position_nm = tokenUser.position_nm;
                                req.session.jikchk_nm = tokenUser.jikchk_nm;
                                req.session.office_tel_no = tokenUser.office_tel_no;
                                req.session.hp_telno = tokenUser.hp_telno;
                                next();
                            //}else{
                                //console.log("xxxxxxxxxxx req.session is null");
                                //return res.sendStatus(403);
                            //}
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