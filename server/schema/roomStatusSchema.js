const {
    db: mongoose,
    Schema
} = require('../dbconfig/mongoose');

const appoSchema = new Schema({
    roomId: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type:Object
    }
}, {
    collection: 'roomStatus',
    versionKey: false,
});

module.exports = appoSchema;