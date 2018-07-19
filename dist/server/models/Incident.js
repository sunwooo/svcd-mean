"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var moment = require("moment");
var IncidentSchema = mongoose.Schema({
    register_num: { type: Number, require: true },
    status_cd: { type: String, default: '1' },
    status_nm: { type: String, default: '접수대기' },
    process_speed: { type: String },
    course_flag: { type: String },
    title: { type: String, required: true },
    content: { type: String },
    request_company_cd: { type: String },
    request_company_nm: { type: String },
    request_dept_cd: { type: String },
    request_dept_nm: { type: String },
    request_id: { type: String },
    request_nm: { type: String },
    request_complete_date: { type: String },
    register_company_cd: { type: String },
    register_company_nm: { type: String },
    register_sabun: { type: String },
    register_nm: { type: String },
    register_date: { type: String },
    register_yyyy: { type: String },
    register_mm: { type: String },
    register_dd: { type: String },
    real_register_mm: { type: String },
    real_contact: { type: String },
    app_menu: { type: String, default: 'ServiceDesk' },
    receipt_content: { type: String },
    manager_company_cd: { type: String },
    manager_company_nm: { type: String },
    manager_nm: { type: String, default: '담당미지정' },
    manager_dept_cd: { type: String },
    manager_dept_nm: { type: String, default: '' },
    manager_position: { type: String, default: '' },
    manager_email: { type: String, default: '' },
    manager_phone: { type: String },
    receipt_date: { type: String },
    business_level: { type: String },
    complete_reserve_date: { type: String, default: '' },
    solution_flag: { type: String, default: 'Y' },
    complete_content: { type: String },
    add_complete_content: { type: String },
    program_id: { type: String },
    delay_reason: { type: String },
    work_time: { type: Number },
    complete_date: { type: String, default: '' },
    reading_cnt: { type: Number },
    complete_open_flag: { type: String, default: 'N' },
    higher_cd: { type: String },
    higher_nm: { type: String },
    lower_cd: { type: String },
    lower_nm: { type: String },
    customer_flag: { type: String },
    add_solution_content: { type: String },
    process_cd: { type: String },
    process_nm: { type: String },
    valuation: { type: Number, default: 0 },
    valuation_content: { type: String },
    approval_gbn: { type: String },
    modify_yn: { type: String, default: 'N' },
    sharing_content: { type: String },
    delete_flag: { type: String, default: 'N' },
    attach_file: [{ fieldname: { type: String },
            originalname: { type: String },
            encoding: { type: String },
            mimetype: { type: String },
            destination: { type: String },
            filename: { type: String },
            path: { type: String },
            size: { type: Number }
        }],
    hold_content: { type: String },
    hold_date: { type: String, default: '' },
    nc_content: { type: String },
    nc_date: { type: String, default: '' },
    created_at: { type: String },
    updated_at: { type: Date },
    deleted_att: { type: Date }
});
IncidentSchema.pre("save", setCreateAt);
IncidentSchema.virtual('getDate').get(function () {
    var date = new Date(this.createdAt);
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
    };
});
IncidentSchema.pre("save", setCreateAt);
function setCreateAt(next) {
    var schema = this;
    var m = moment();
    var date = m.format("YYYY-MM-DD HH:mm:ss");
    schema.created_at = date;
    schema.register_date = date;
    schema.register_yyyy = m.format("YYYY");
    schema.register_mm = m.format("MM");
    schema.register_dd = m.format("DD");
    return next();
}
autoIncrement.initialize(mongoose.connection);
IncidentSchema.plugin(autoIncrement.plugin, { model: "incident", field: "register_num", startAt: 51100 });
var Incident = mongoose.model('Incident', IncidentSchema);
exports.default = Incident;
//# sourceMappingURL=Incident.js.map