const { db: mongoose, Schema } = require('../dbconfig/mongoose');

const appoSchema = new Schema(
    {
        appoId: { type: String },
        name: {type: String},
        uid: {type: Number},
        avatar: {type:String},
        appoTime: {type:Number},
        contactWay: {type:Number},
        receptionist: {type: String},
        status:{type: String}
    },
    {
        collection: 'appointment',
        versionKey: false,
    }
);

module.exports = appoSchema;