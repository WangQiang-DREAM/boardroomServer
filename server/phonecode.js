/**
 * 手机验证码方法
 */
phoneCode = function () {
    let Code = [];
    return {
        setCode(uid) {
            const newCode = {
                uid: uid,
                newphonecode: getRandomCode()
            };
            Code.push(newCode);
        },
        getCode(uid) {
            Code.forEach(elem => {
                if (elem.uid == uid) {
                    console.log(elem.newphonecode)
                    return elem.newphonecode;
                }
            })
        },
        deleteCode(uid) {
            for (let i = 0, len = Code.length; i < len; i++) {
                if (Code[i].uid == uid) {
                    Code.splice(i, 1);
                    break;
                }
            }
        }
    };
};

/**
 * 随机获取验证码
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
