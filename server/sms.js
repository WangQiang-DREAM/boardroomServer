/**
 * 短信发送
 */
const SMSClient = require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET
const accessKeyId = 'LTAIghBLAyjLNPiW'
const secretAccessKey = '5P6fBJBYtD4dRGbcTqe68FgWdv5aq8'
//初始化sms_client
let smsClient = new SMSClient({
    accessKeyId,
    secretAccessKey
});

/**
 * @param {*} phone
 * @param {*} TemplateCode
 * @param {*} code
 * @description 发送短信验证码方法
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
            let {
                Code
            } = res
            if (res.Code === 'OK') {
                //处理返回参数
                console.log(res)
            }
        }, function (err) {
            console.log(err)
        })
}

/**
 * @param {*} phone 
 * @param {*} TemplateCode 
 * @description 发送短信提示消息
 */
module.exports.sendSms = (phone, TemplateCode) => {
    const time = getTime(); //获取时间
    smsClient
        .sendSMS({
            PhoneNumbers: phone,
            SignName: '王强',
            TemplateCode: TemplateCode,
            TemplateParam: JSON.stringify({
                mtname: "吉林民众托老所",
                submittime: time
            })
        })
        .then(function (res) {
            let {
                Code
            } = res
            if (res.Code === 'OK') {
                //处理返回参数
                console.log(res)
            }
        }, function (err) {
            console.log(err)
        })
}

/**
 * @description 获取短信发送时间
 */
function getTime(){
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    h < 10 ? h = '0' + h : h;
    m < 10 ? m = '0' + m : m;
    const Time = h + '点' + m + '分';
    return Time;
}