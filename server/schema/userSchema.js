const { db: mongoose, Schema } = require('../dbconfig/mongoose');

const tagsManagerSchema = new Schema(
    {
        uid: { type: String },
        username: { type: String },
        photo: {type: String},
        name: {type: String},
        password: {type: String},
        roles: { type: Object },
    },
    {
        collection: 'manager',
        versionKey: false,
    }
);

module.exports = tagsManagerSchema;