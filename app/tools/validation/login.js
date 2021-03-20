const Validator = require('validator');
const isEmpty = require('./is-empty.js');
module.exports = function validateLoginInput(data) {
    let errors = {}
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!Validator.isEmail(data.email)) {
        errors.msg = '邮箱不合法'
        errors.code = 1;
    }

    if (Validator.isEmpty(data.email)) {
        errors.msg = '邮箱不能为空'
        errors.code = 1;
    }

    if (Validator.isEmpty(data.password)) {
        errors.msg = '密码不能为空'
        errors.code = 1;
    }
    if (!Validator.isLength(data.password, { min: 6, max: 16 })) {
        errors.msg = '密码长度应在6~16位'
        errors.code = 1;
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}