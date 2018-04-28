const { db: mongoose, Schema } = require('../dbconfig/mongoose');

const logsSchema = new Schema(
    {
        name: { type: String },
        uid: { type: Number },
        avatar: { type: String },
        operator:{type:String},
        operatorAvatar: { type: String },
        operateTime: { type: Number },
        status:{type:String}
    },
    {
        collection: 'operateLogs',
        versionKey: false,
    }
);

module.exports = logsSchema;