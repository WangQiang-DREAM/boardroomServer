const { db: mongoose, Schema } = require('../dbconfig/mongoose');

const videoTagSchema = new Schema(
    {
        key: { type: String },
        title: { type: String },
    },
    {
        collection: 'videoTags',
        versionKey: false,
    }
);

module.exports = videoTagSchema;