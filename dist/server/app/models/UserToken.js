var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");
var logger = require('log4js').getLogger('app');
var moment = require('moment');

var userTokenSchema = mongoose.Schema({
    email            : { type : String , required: true, unique:true },
    token            : { type : String },
    created_at       : { type : String , default : ''}
});

userTokenSchema.pre("save", hashToken);

/**
 * 비밀번호 비교
 */
userTokenSchema.methods.authenticate = function (token) {
    var userToken = this;
    try{
        return bcrypt.compareSync(token, userToken.token);
    }catch(e){
        logger.debug(e);
        return false;
    }
};

/**
 * 비밀번호 해쉬 값
 */
userTokenSchema.methods.hash = function (token) {
    return bcrypt.hashSync(token);
};

/**
 * 비밀번호를 해쉬로 바꿈
 * @param {*} next 
 */
function hashToken(next){
    try{
    var userToken = this;
    var m = moment();    
    var date = m.format("YYYY-MM-DD HH:mm:ss");

    userToken.created_at = date;
    userToken.token = bcrypt.hashSync(userToken.token);
    }catch(e){
        console.log("UserToken hashToken error", e);
    }finally{
        return next();
    }
    
}

var UserToken = mongoose.model('userToken', userTokenSchema);
module.exports = UserToken;