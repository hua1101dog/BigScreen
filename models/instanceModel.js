var mongoose = require("mongoose");
var schema = new mongoose.Schema({
    name:{type:String, default:''},
    params : [],
    scene:{
        type : mongoose.Schema.ObjectId,
        ref : 'scene'
    },
    createTime : {type : Date, default: Date.now}
});

exports.instanceModel = mongoose.model('instance', schema);
