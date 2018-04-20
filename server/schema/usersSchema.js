const { db: mongoose, Schema } = require('../dbconfig/mongoose');

const tagsManagerSchema = new Schema(
    {
        uid: { type: Number },
        name: { type: String },
        email: { type: String },
        password: { type: String },
        avatar: { type: String},
        registerTime: {type: Number},
        checkInTime: {type: Number},
        sex:{type:Number},
        age:{type:Number},
        roomOrder:{type:Number},
        bedId: { type: Number },
        userType:{type:String},
        familyName: { type: String },
        familyAddress: { type: String },
        familyPhone: { type: Number },
        idCardNum: { type: String },
    },
    {
        collection: 'users',
        versionKey: false,
    }
);

module.exports = tagsManagerSchema;