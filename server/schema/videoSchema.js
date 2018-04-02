const { db: mongoose, Schema } = require('../dbconfig/mongoose');

const videoSchema = new Schema(
    {
        guid: { type: String },
        creator: { type: String },
        insertTime: { type: Number },
        tags: { type: Object },
        videoPlayUrl: { type: String },
        musicInfo: { type: String },
        musicUrl: { type: String },
        musicCover: { type: String },

    },
    {
        collection: 'video',
        versionKey: false,
    }
);

module.exports = videoSchema;