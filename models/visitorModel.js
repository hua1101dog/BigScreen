
var mongoose = require("mongoose");  //  顶会议用户组件
var schema = new mongoose.Schema({
    visitDate:{type : Date},
    visitor:{type : String},
    creator:{
        type : mongoose.Schema.ObjectId,
        ref : 'user'    // clazz的Model名
    },
    createTime : {type : Date, default: Date.now}
});

exports.visitorModel = mongoose.model('visitor', schema);

