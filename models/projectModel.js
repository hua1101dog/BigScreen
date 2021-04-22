
var mongoose = require("mongoose");  //  顶会议用户组件
var schema = new mongoose.Schema({
    name:{type:String, default:''},
    addr:{type:String, default:''},
    desc:{type:String, default:''}
});

exports.projectModel = mongoose.model('project', schema);

