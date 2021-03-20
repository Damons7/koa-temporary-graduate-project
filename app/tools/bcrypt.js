const bcrypt = require('bcryptjs');//引入bcryptjs

module.exports = {
    //密码加密操作
    enbcrypt(password) {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        return hash ; 
    },
    //密码解密操作
    compareSync(newPassword,oldPassword){
       return bcrypt.compareSync(newPassword,oldPassword)
    }

}
