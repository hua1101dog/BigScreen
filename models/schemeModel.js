/**
 * Created by Administrator on 2016/1/20.
 */
var mongoose = require("mongoose");  //  顶会议用户组件
var schema = new mongoose.Schema({
    name:{type:String, default:''},
    schemeType:{
        type : mongoose.Schema.ObjectId,
        ref : 'schemeType'    // clazz的Model名
    },
    spaceCode:{type:String, default:''},
    tag:String,
    birdMap:{
        type : mongoose.Schema.ObjectId,
        ref : 'birdMap'    // clazz的Model名
    },
    policyList:[],
    markers:[],
    creator:{
        type : mongoose.Schema.ObjectId,
        ref : 'user'    // clazz的Model名
    },
    createTime : {type : Date, default: Date.now}

});


 //  定义了一个新的模型，但是此模式还未和maps集合有关联
exports.schemeModel = mongoose.model('scheme', schema);

