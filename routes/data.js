const router = require('koa-router')();
const videoTagController = require('../server/controllers/videoTagController');

/**
 * 重新灌标签数据的接口
 */
router.get('/queryAllTags', videoTagController.queryAllTags);

/**
 * 重新灌视频数据的接口
 */
router.get('/saveNewVideoInfo', videoTagController.moveVideoToNewCollect);

/**
 * 从日志文件中导入视频数据
 */
router.get('/importData', videoTagController.addNewVideoFromLog);

router.get('/checkTestNum', videoTagController.checkTestNum);

module.exports = router;