const { db: mongoose, Schema } = require('../dbconfig/mongoose');

const roomUserRelationSchema = new Schema(
    {
        roomId: { type: String },
       
    },
    {
        collection: 'roomAndUserRelation',
        versionKey: false,
    }
);

module.exports = roomUserRelationSchema;