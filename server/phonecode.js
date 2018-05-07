/**
 * @param
 * @description 手机验证码方法
 */
phoneCode = function () {
    let Code = [];
    return {
        // 设置验证码
        setCode(phone) {
            const newCode = {
                phone: phone,
                newphonecode: getRandomCode()
            };
            Code.push(newCode);
        },
        // 获取验证码
        getCode(phone) {
            let phonecode = ''
            Code.forEach(elem => {
                if (elem.phone == phone) {
                    console.log(elem.newphonecode);
                    phonecode = elem.newphonecode;
                }
            });
            return phonecode;
        },
        // 删除验证码
        deleteCode(phone) {
            for (let i = 0, len = Code.length; i < len; i++) {
                if (Code[i].phone == phone) {
                    Code.splice(i, 1);
                    break;
                }
            }
        }
    };
};

/**
 * @param
 * @description 随机获取验证码
 */
getRandomCode = (code = '') => {
    for (let i = 0; i < 6; i++) {
        if (i == 0) {
            code += Math.floor(Math.random() * 9 + 1)
        } else {
            code += Math.floor(Math.random() * 10)
        }
    };
    return code;
};

module.exports = new phoneCode()