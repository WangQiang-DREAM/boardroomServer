/**
 * 短信发送
 */
const SMSClient = require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 
const accessKeyId = 'LTAIghBLAyjLNPiW'
const secretAccessKey = '5P6fBJBYtD4dRGbcTqe68FgWdv5aq8'
//初始化sms_client
let smsClient = new SMSClient({ accessKeyId, secretAccessKey })
//发送短信
module.exports = sendSms =(phone,TemplateCode,code) =>{
    smsClient.sendSMS({
        PhoneNumbers: phone,
        SignName: '王强',
        TemplateCode: TemplateCode,
        TemplateParam: '{"code":'+code+'}'
    }).then(function (res) {
        let { Code } = res
        if (res.Code === 'OK') {
            //处理返回参数 
            console.log(res)
        }
    }, function (err) {
        console.log(err)
    })
}