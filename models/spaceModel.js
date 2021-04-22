/**
 * Created by Administrator on 2016/1/20.
 */
var mongoose = require("mongoose");  //  顶会议用户组件
var schema = new mongoose.Schema({
    text:{type:String, default:''},
    code:{type:String, default:''},
    policyList:[],
    createTime : {type : Date, default: Date.now}
});


schema.statics = {
    //获取新的空间编码
    geneCode: function (pcode) {
         let curMaxCode;
         let reg = eval("/^"+(pcode?pcode:"")+"..$/");
        return this.findOne({code:reg},{code:1},{sort:{code:-1}}).exec();
    },

    getPtexts: function (code,cb) {
        let list = [];
        let index = 2;
        while(index<=code.length){
            list.push(code.substr(0,index));
            index = index +2;
        }
        this.find({code:{$in:list}},{text:1},{sort:{code:1}},function(err,objs){
            cb(objs.reduce((ret,n)=>{ret.push(n.text);return ret},[]).join(">"));
        });
     /*   this.aggregate([{$match:{code:{$in:list}}},{$}],function(a,b){
            console.log(a);
        })*/
    }

};

 //  定义了一个新的模型，但是此模式还未和users集合有关联
exports.spaceModel = mongoose.model('space', schema); //  与users集合关联

