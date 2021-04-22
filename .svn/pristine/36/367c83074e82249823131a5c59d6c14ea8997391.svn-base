var mongoose = require("mongoose");  //  顶会议用户组件
var schema = new mongoose.Schema({
    name:{type:String, default:''},
    url:{type:String},
    method:{type:String},
    params:[],
    tags:{type:String},
    fetchInvl:{type:String},
    demoParam:{type:Object},
    demoResp:{type:Object},
    lastParam:{type:Object},
    lastResp:{type:Object},
    lastReqTime:{Type:Date},
    urlPrefix:{
        type : mongoose.Schema.ObjectId,
        ref : 'urlPrefix'    // clazz的Model名
    },
    creator:{
        type : mongoose.Schema.ObjectId,
        ref : 'user'    // clazz的Model名
    },
    createTime : {type : Date, default: Date.now}
});

exports.interfaceModel = mongoose.model('interface', schema);

