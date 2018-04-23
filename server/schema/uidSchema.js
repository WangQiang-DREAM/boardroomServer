const { db: mongoose, Schema } = require('../dbconfig/mongoose');

const uidSchema = new Schema(
    {
        uid: { type: Number },
    },
    {
        collection: 'uid',
        versionKey: false,
    }
);

module.exports = uidSchema;