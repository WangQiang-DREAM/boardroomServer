const router = require('koa-router')();
const roomController = require('../server/controllers/roomController');

// 返回房间信息接口
router.get('/queryRoomInfo', roomController.queryRoomInfo);

// 修改房间状态接口
router.get('/updateStatus', roomController.changeRoomStatus);

module.exports = router;