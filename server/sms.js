/**
 * 短信发送
 */
const SMSClient = require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET
const accessKeyId = 'LTAIghBLAyjLNPiW'
const secretAccessKey = '5P6fBJBYtD4dRGbcTqe68FgWdv5aq8'
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey});

/**
 *
 * @param {*} phone
 * @param {*} TemplateCode
 * @param {*} code
 * 发送短信验证码
 */
module.exports.sendCode = (phone, TemplateCode, code) => {
    smsClient
        .sendSMS({
            PhoneNumbers: phone,
            SignName: '王强',
            TemplateCode: TemplateCode,
            TemplateParam: '{"code":' + code + '}'
        })
        .then(function (res) {
            let {Code} = res
            if (res.Code === 'OK') {
                //处理返回参数
                console.log(res)
            }
        }, function (err) {
            console.log(err)
        })
}

/**
 *
 * @param {*} phone
 * @param {*} TemplateCode
 * @param {*} code
 *  发送短信提示
 */
module.exports.sendSms = (phone, TemplateCode, time) => {
    smsClient
        .sendSMS({
            PhoneNumbers: phone,
            SignName: '王强',
            TemplateCode: TemplateCode,
            TemplateParam: JSON.stringify({mtname: "民众托老所", submittime: time})
        })
        .then(function (res) {
            let {Code} = res
            if (res.Code === 'OK') {
                //处理返回参数
                console.log(res)
            }
        }, function (err) {
            console.log(err)
        })
}