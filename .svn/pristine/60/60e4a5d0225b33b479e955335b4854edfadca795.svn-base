/**
 * Created by Administrator on 2016/1/20.
 */
var mongoose = require("mongoose");  //  顶会议用户组件
var userSchema = new mongoose.Schema({
    account : String,
    password : String
    //,createTime : {type : Date, default: Date.now}
});
userSchema.methods.findbyaccount = function(account) {
    return this.model('user').findOne({account: account});
}

// assign a function to the "statics" object of our animalSchema
userSchema.statics.findByName = function (name, cb) {
    return this.find({ name: new RegExp(name, 'i') }, cb);
}

 //  定义了一个新的模型，但是此模式还未和users集合有关联
exports.userModel = mongoose.model('user', userSchema); //  与users集合关联



//userSchema.methods.findbyusername = function(username, callback) {
//    return this.model('user').find({username: username}, callback);
//}
//// model
//userModel = db.model('user', userSchema);