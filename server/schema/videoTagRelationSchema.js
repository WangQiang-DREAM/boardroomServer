const { Schema } = require('../dbconfig/mongoose');

const videoTagSchema = new Schema(
    {
        guid: { type: String },
        creator: { type: String },
        insertTime: { type: Number },
        tags: { type: Object },
        newtags: { type: Object },
        videoPlayUrl: { type: String },
        modifier: { type: String },
        modifyTime: { type: Number },
        musicInfo: { type: String },
        musicUrl: { type: String },
        musicCover: { type: String },
    },
    {
        collection: 'videoTagRelation',
        versionKey: false,
    }
);

module.exports = videoTagSchema;