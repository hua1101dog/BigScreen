var mongoose = require("mongoose");
var schema = new mongoose.Schema({
    name:{type:String, default:''},
    creator:{
        type : mongoose.Schema.ObjectId,
        ref : 'user'
    },
    createTime : {type : Date, default: Date.now}
});
exports.sceneModel = mongoose.model('scene', schema);

