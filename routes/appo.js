const router = require('koa-router')();
const appoController = require('../server/controllers/appoController');

// 分页返回预约信息接口
router.get('/queryAppoInfo', appoController.queryAppoInfo);

router.get('/queryAppoInfoDetail',appoController.queryAppoInfoDetail)
//添加预约信息
router.post('/addAppo',appoController.addAppo);

//判断预约冲突
router.post('/judgeAppoConflict',appoController.judgeAppoConflict)

//删除预约信息
router.get('/deleteAppo',appoController.deleteAppo);

module.exports = router;