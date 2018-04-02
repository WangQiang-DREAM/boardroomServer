const { db: mongoose, Schema } = require('../dbconfig/mongoose');

const roomSchema = new Schema(
    {
        roomId: { type: String },
        creator: { type: String },
        createTime: { type: Number },
        direction: { type: String },
        roomStatus: { type: Number },
        userNum: { type: Number },
        totalNum: { type: Number },
        commentNum: { type: Number },
        enterTime: {type: Number},
    },
    {
        collection: 'roomInfos',
        versionKey: false,
    }
);

module.exports = roomSchema;