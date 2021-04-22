var express = require('express');
var router = express.Router();
var common = require('../util/common')

var projectModel = require('../models/projectModel').projectModel;

router.get('/list', function(req, res, next){
    var where = {};
    if(req.query.name){
        where.name = eval("/"+req.query.name+"/i");
    }
    var fields = {};
    common.pageQuery(projectModel,fields,where,req.query,{},{path:'creator', select: 'account'},function (error,page) {
        res.json(common.success(page));
    })
});

router.get('/all', function(req, res, next){
    projectModel.find({},{},(err,result)=>{
        res.json(common.result(err,result));
    })
});


router.post('/save', function(req, res, next){
    var interface = req.body;
    common.saveOrUpdate(projectModel,interface,function(err){
        res.json(common.result(err));
    })
});

router.get('/del', function(req, res, next){
    projectModel.deleteOne({_id:req.query.id},function (error,data) {
        res.json(common.result(error,data));
    })
});

module.exports = router;
