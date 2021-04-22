/**
 * Created by Administrator on 2016/1/20.
 */
var mongoose = require("mongoose");  //  顶会议用户组件
var common = require("../util/common");
var schema = new mongoose.Schema({
    name:{type:String, default:''},
    spaceCode:{type:String, default:''},
    comment:{type:String},
    geojson:{type:Object},
    creator:{
        type : mongoose.Schema.ObjectId,
        ref : 'user'    // clazz的Model名
    },
    createTime : {type : Date, default: Date.now}


});

schema.statics = {
    listPage:function(search,page,cb){
        this.find(search, {name: 1, spaceCode: 1, comment: 1}, page, function (err,list) {
            if(err){
                console.log(err);
            }else{
                page.data = list;
                cb(err,page);
            }
        })
    },
    query: function (query, cb) {
        let search = {};
        let page = common.page(query);
        page.sort = {createTime: -1}

        if(query.pageIndex != 0){
            this.listPage(search,page,cb);
        }else{
            this.countDocuments(search, (err, count) => {
                page.setCount(count);
                this.listPage(search,page,cb);
            })
        }
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};
exports.del = function (req,res) {
    var id = req.query.id;
    if (id) {

    }
};

 //  定义了一个新的模型，但是此模式还未和maps集合有关联
exports.birdMapModel = mongoose.model('birdMap', schema);

