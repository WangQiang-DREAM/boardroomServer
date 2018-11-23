const { db: mongoose, Schema } = require('../dbconfig/mongoose');

const userSchema = new Schema(
    {
        uid: { type: String },
        phone: {type: Number},
        name: {type: String},
        department:{type:String},
        password: {type: String},
        floor:{type:Number}
    },
    {
        collection: 'users',
        versionKey: false,
    }
);

module.exports = userSchema;