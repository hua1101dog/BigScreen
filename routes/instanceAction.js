var express = require('express');
var router = express.Router();
var common = require('../util/common')

var instanceModel = require('../models/instanceModel').instanceModel;

router.get('/list', function(req, res, next){
    var where = {};
    if(req.query.name){
        where.name = eval("/"+req.query.name+"/i");
    }
    var fields = {};
    common.pageQuery(instanceModel,fields,where,req.query,{},{path:'scene', select: 'name'},function (error,page) {
        res.json(common.success(page));
    })
});


router.post('/save', function(req, res, next){
    var instance = req.body;
    common.saveOrUpdate(instanceModel,instance,function(err){
        res.json(common.result(err));
    })
});

router.get('/del', function(req, res, next){
    instanceModel.deleteOne({_id:req.query.id},function (error,data) {
        res.json(common.result(error,data));
    })
});




module.exports = router;
