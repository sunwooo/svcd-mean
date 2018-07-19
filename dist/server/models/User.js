"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var moment = require("moment");
var userSchema = mongoose.Schema({
    userCompany_nm: { type: String, default: '' },
    company_cd: { type: String, default: '' },
    company_nm: { type: String, default: '미승인' },
    email: { type: String, required: true, unique: true },
    user_id: { type: String },
    password: { type: String, required: true },
    employee_nm: { type: String },
    dept_cd: { type: String, default: '' },
    dept_nm: { type: String, default: '' },
    jikchk_nm: { type: String, default: '' },
    position_nm: { type: String, default: '' },
    dom_post_cd1: { type: String, default: '' },
    dom_addr: { type: String, default: '' },
    dom_addr2: { type: String, default: '' },
    office_tel_no: { type: String, default: '' },
    hp_telno: { type: String, default: '' },
    img_path: { type: String, default: '' },
    alarm_minute: { type: Number, default: '' },
    register_id: { type: String },
    register_date: { type: String, default: '' },
    modify_id: { type: String },
    modify_date: { type: String, default: '' },
    email_ref: { type: String },
    email_send_yn: { type: String, default: 'N' },
    sabun: { type: String },
    access_yn: { type: String, default: 'N' },
    using_yn: { type: String, default: 'Y' },
    user_flag: { type: String, default: 9 },
    group_flag: { type: String, default: 'out' },
    created_at: { type: String, default: '' },
    updated_at: { type: String, default: '' }
});
userSchema.pre("save", hashPassword);
userSchema.pre("findOneAndUpdate", function hashPassword(next) {
    var user = this._update;
    if (user.password == '') {
        var user = this._update;
        delete user.password;
        return next();
    }
    else {
        var user = this._update;
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
});
/**
 * 비밀번호 비교
 */
userSchema.methods.authenticate = function (password) {
    var user = _this;
    return bcrypt.compareSync(password, user.password);
};
/**
 * 비밀번호 해쉬 값
 */
userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};
/**
 * 비밀번호를 해쉬로 바꿈
 * @param {*} next
 */
function hashPassword(next) {
    var user = this;
    var m = moment();
    var date = m.format("YYYY-MM-DD HH:mm:ss");
    user.created_at = date;
    user.register_date = date;
    user.modify_date = date;
    if (!user.isModified("password")) {
        return next();
    }
    else {
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
}
var User = mongoose.model('User', userSchema);
exports.default = User;
/*
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
};

// Omit the password when returning a user
userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;
*/ 
//# sourceMappingURL=User.js.map