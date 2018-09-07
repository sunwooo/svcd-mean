'use strict';
const logger = require('log4js').getLogger('app');

module.exports = {

    sessionCheck: (req, res, next) => {
        
        console.log('=====================session=================');
        console.log('req.session.email : ' + req.session.email);
        console.log('req.session.user_flag : ' + req.session.user_flag);
        console.log('req.session.group_flag : ' + req.session.group_flag);
        console.log('req.session.dept_cd : ' + req.session.dept_cd);
        console.log('=============================================\n');

        if (req.session.email != null || req.session.email != undefined) {
            next();
        } else { 
            return res.sendStatus(403);
        }
        
    }
}