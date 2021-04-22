var mongoose = require("mongoose");
var schema = new mongoose.Schema({
    name:{type:String, default:''},
    category:Number,
    iconfont:String,
    url:{type:String},
    types:[],
    creator:{
        type : mongoose.Schema.ObjectId,
        ref : 'user'
    },
    createTime : {type : Date, default: Date.now}
});
exports.schemeTypeModel = mongoose.model('schemeType', schema);

