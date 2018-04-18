const router = require('koa-router')();
const roomController = require('../server/controllers/roomController');
const multer = require('koa-multer');
const exportConfig = require('../config/exportConfig');

// 返回房间信息接口
router.get('/queryRoomInfo', roomController.queryRoomInfo);

// 修改房间状态接口
router.get('/updateStatus', roomController.changeRoomStatus);

//添加房间信息
router.get('/addRoomInfo', roomController.addRoomInfo);

//查询房间图片
router.get('/queryRoomImgByRoomOrder',roomController.queryRoomImgByRoomOrder)

//删除房间图片
router.get('/deleteRoomPhoto', roomController.deleteRoomPhoto)

//修改房间情况
router.get('/change_RoomStatus', roomController.change_RoomStatus)

//修改房间入住人数
router.get('/changeRoomUserNum', roomController.changeRoomUserNum)

//修改房间评论数
router.get('/changeRoomCommentNum', roomController.changeRoomCommentNum)


/**
 * 上传图片
 *
 */
var storage = multer.diskStorage({
    //文件保存路径  
    destination: function (req, file, cb) {
        cb(null, 'public/img/house')
    },
    //修改文件名称  
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        // var fileFormat = (file.originalname).split(".");
        // console.log(fileFormat)
        // cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
var upload = multer({ storage: storage });  

// 上传图片接口
router.post('/upload', upload.single('file'), async(ctx, next) => {
    //console.log(ctx.req.file.filename)
    console.log(ctx.req.body)
    let returnRoomInfo = await roomController.changeRoomPhoto(ctx.req.body, ctx.req.file.filename);
    let resImg = {
        status: '修改成功',
        data: returnRoomInfo
    }
    if (returnRoomInfo.ok == 1) {
        exportConfig(ctx, 'success', resImg);
    } else {
        exportConfig(ctx, 'error', returnRoomInfo);
    }
    return next;
}) 


module.exports = router;