const router = require('koa-router')();
const roomController = require('../server/controllers/roomController');

// 返回会议室信息接口
router.get('/queryRoomInfo', roomController.queryRoomInfo);

module.exports = router;