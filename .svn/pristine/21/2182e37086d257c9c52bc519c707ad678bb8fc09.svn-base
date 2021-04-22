
var mongoose = require("mongoose");  //  顶会议用户组件
var schema = new mongoose.Schema({
    name:{type:String},
    path:{type:String},
    creator:{
        type : mongoose.Schema.ObjectId,
        ref : 'user'    // clazz的Model名
    },
    createTime : {type : Date, default: Date.now}
});

exports.bigsreenPathModel = mongoose.model('bigscreenPath', schema);

