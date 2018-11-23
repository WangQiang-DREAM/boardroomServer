const mongoose = require('mongoose');
mongoose
    // .connect('mongodb://39.106.173.244:27017')
    .connect('mongodb://localhost:27017')
    .then(() => {
        console.log('connected to DB');
    })
    .catch(err => console.log(err));
mongoose.Promise = global.Promise;
const db = mongoose.connection;
const Schema = mongoose.Schema;
db.on('error', function(error) {
    console.log('数据库连接失败：' + error);
});
db.once('open', function() {
    console.log('数据库连接成功!');
});

module.exports = { db, Schema };
