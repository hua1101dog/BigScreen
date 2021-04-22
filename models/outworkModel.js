
var mongoose = require("mongoose");  //  顶会议用户组件
var schema = new mongoose.Schema({
    name:{type:String},
    startTime : {type : Date, default: Date.now},
    endTime : {type : Date, default: Date.now}
});

exports.outworkModel = mongoose.model('outwork', schema);

