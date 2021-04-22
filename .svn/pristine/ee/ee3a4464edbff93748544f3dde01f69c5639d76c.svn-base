var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var common = require('../util/common')
var userModel = require('../models/userModel').userModel;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/save', function(req, res, next){
    var user = req.body;
    userModel.findOne({account:user.account},function(error, result){
        //关闭数据库链接
        //  db.close();
        if(error) {
            res.json(common.error(error));
            console.log(error);
        } else if(result){
            res.json(common.error("user exists!"));
        }else{
            var userEnitity = new userModel(user);
            userEnitity.save(function(error) {
                if(error) {
                    console.log(error);
                    res.json(common.error("system error,try later!"));
                } else {
                    console.log('saved OK!');
                    res.json(common.success());
                }
                // 关闭数据库链接
                // db.close();
            });
        }
    });
});

module.exports = router;
