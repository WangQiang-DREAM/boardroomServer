const { db: mongoose, Schema } = require('../dbconfig/mongoose');

const roomSchema = new Schema({
    roomId: {
        type: String
    },
    roomName: {
        type: String
    },
    roomFloor: {
        type: Number
    },
    peopleNum: {
        type: Number
    },
    status: {
        type: String
    },
    equipment: {
        type: Object
    }
}, {
    collection: 'roomDetail',
    versionKey: false,
});

module.exports = roomSchema;