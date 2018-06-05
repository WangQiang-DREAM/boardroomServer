const { db: mongoose, Schema } = require('../dbconfig/mongoose');

const roomSchema = new Schema(
    {
        roomId: { type: String },
        creator: { type: String },
        direction: { type: String },
        roomStatus: { type: String },
        userNum: { type: Number },
        totalNum: { type: Number },
        commentNum: { type: Number },
        status: { type: String},
        roomOrder:{type: Number},
        createTime: { type: Number },
        image:{type: Object},
        area:{type:Number},
        price:{type:String},
        roomType:{type:String}
    },
    {
        collection: 'roomInfos',
        versionKey: false,
    }
);

module.exports = roomSchema;