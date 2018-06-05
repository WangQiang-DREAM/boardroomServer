const router = require('koa-router')();
const wechatController = require('../server/controllers/wechatController');
const multer = require('koa-multer');

router.get('/queryUserWechat', wechatController.queryUserWechat);

router.get('/getScanCode', wechatController.sendScanCode)

router.get('/confirmUser',wechatController.confirmUser)

router.get('/getUserInfo', wechatController.getUserInfo)

module.exports = router;