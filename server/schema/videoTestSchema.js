const { db: mongoose, Schema } = require('../dbconfig/mongoose');

const videoTestSchema = new Schema(
    {
        guid: { type: String },
        creator: { type: String },
        tags: { type: Object },
        newtags: { type: Object },
        videoPlayUrl: { type: String },
        modifier: { type: String },
    },
    {
        collection: 'videoTest',
        versionKey: false,
    }
);

module.exports = videoTestSchema;