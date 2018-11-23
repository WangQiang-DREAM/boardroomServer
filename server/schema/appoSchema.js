const {
    db: mongoose,
    Schema
} = require('../dbconfig/mongoose');

const appoSchema = new Schema({
    appoId: {
        type: String
    },
    name: {
        type: String
    },
    uid: {
        type: String
    },
    department: {
        type: String
    },
    appoTime: {
        type: Object
    },
    roomId:{
        type:String
    },
    createTime:{
        type:Number
    },
    status:{
        type:String
    },
    date:{
        type:String
    },
    title:{
        type:String
    }
}, {
    collection: 'appointment',
    versionKey: false,
});

module.exports = appoSchema;