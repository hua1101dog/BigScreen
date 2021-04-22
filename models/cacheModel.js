/**
 * Created by Administrator on 2016/1/20.
 */
var mongoose = require("mongoose");  //  顶会议用户组件
var schema = new mongoose.Schema({
    interface:{
        type : mongoose.Schema.ObjectId,
        ref : 'interface'
    },
    instance:{
        type : mongoose.Schema.ObjectId,
        ref : 'instance'
    },
    code:String,//与对应 dataNode的code保持一致
    text:String,//与对应 dataNode的text保持一致
    params : [],
    fakeData: {type:Object},
    fakeTime: {type : Date},
    realData: {type:Object},
    realTime: {type : Date},
    fetchCnt: {type : Number},
    useFake:{type : Boolean, default: true},
    createTime : {type : Date, default: Date.now}
});

exports.cacheModel = mongoose.model('cache', schema); //  与users集合关联
