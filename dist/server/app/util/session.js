'use strict';

var async = require('async');
var UserToken = require('../models/UserToken');
var jwt = require('jsonwebtoken');
const logger = require('log4js').getLogger('app');

module.exports = {

    sessionCheck: (req, res, next) => {
        
        //logger.debug('=====================session=================');
        //logger.debug('req : ' , req);
        //logger.debug('req.headers.authorization : ' , req.headers.authorization);
        //logger.debug('req.session.email : ' , req.session.email);
        //logger.debug('req.session.user_flag : ' , req.session.user_flag);
        //logger.debug('req.session.group_flag : ' , req.session.group_flag);
        //logger.debug('req.session.dept_cd : ' , req.session.dept_cd);
        //logger.debug('=============================================\n');

        var tokenUser;

        if(req.headers.authorization){
            tokenUser = jwt.decode(req.headers.authorization).user;
        }
        
        //logger.debug('=============================================\n');
        //logger.debug('tokenUser : ' , tokenUser);
        //logger.debug('=============================================\n');

        if (req.session.email != null || req.session.email != undefined) {
            next();
        } else { 
            //logger.debug("xxxxxxxxxxx req.session is null");
            if(tokenUser.email){
                //logger.debug("yyyyyyyyyy tokenUser.email : ", tokenUser.email);
                try {
                    /**
                     * 토근 비교
                     */
                    var condition = {};
                    condition.email = tokenUser.email;
                    //logger.debug("condition.email : ", condition.email);
                    UserToken.findOne(condition).exec(function (err, userToken) {
                        //logger.debug("userToken : ", userToken);
                        if (userToken != null) {
                            
                            //logger.debug("userToken != null");
                            //logger.debug("userToken.token : ",userToken.token);
                            //logger.debug("tokenUser.token : ",tokenUser.token);
                            
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
                                //logger.debug("xxxxxxxxxxx req.session is null");
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