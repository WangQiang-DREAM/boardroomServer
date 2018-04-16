const { db: mongoose, Schema } = require('../dbconfig/mongoose');

const commentsSchema = new Schema(
    {
        uid: { type: Number },
        roomOrder: { type: Number },
        commentId: { type: String },
        content: { type: String },
        createTime: { type: Number },
        status: { type: String },
    },
    {
        collection: 'comments',
        versionKey: false,
    }
);

module.exports = commentsSchema;