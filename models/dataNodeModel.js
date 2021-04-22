var mongoose = require("mongoose");
var schema = new mongoose.Schema({
    text:{type:String, default:''},
    code:{type:String, default:''},
    scene:{
        type : mongoose.Schema.ObjectId,
        ref : 'scene'
    },
    interface:{
        type : mongoose.Schema.ObjectId,
        ref : 'interface'
    },
    createTime : {type : Date, default: Date.now}
});


schema.statics = {
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
    }

};

exports.dataNodeModel = mongoose.model('dataNode', schema);

