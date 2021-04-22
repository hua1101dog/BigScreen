var express = require('express');
var router = express.Router();
var common = require('../util/common')
var dayjs = require('dayjs');

var outworkModel = require('../models/outworkModel').outworkModel;

router.get('/list', function(req, res, next){
    var where = {};
    if(req.query.name){
        where.name = eval("/"+req.query.name+"/i");
    }
    if(req.query.date){
    	where.startTime = {"$lte":dayjs(req.query.date).add(1,'day')};
        where.endTime = {"$gte":req.query.date};
    }
    var fields = {};
    common.pageQuery(outworkModel,fields,where,req.query,{},{path:'creator', select: 'account'},function (error,page) {
        res.json(common.success(page));
    })
});

router.get('/all', function(req, res, next){
    outworkModel.find({},{},(err,result)=>{
        res.json(common.result(err,result));
    })
});


router.post('/save', function(req, res, next){
    var interface = req.body;
    common.saveOrUpdate(outworkModel,interface,function(err){
        res.json(common.result(err));
    })
});

router.get('/del', function(req, res, next){
    outworkModel.deleteOne({_id:req.query.id},function (error,data) {
        res.json(common.result(error,data));
    })
});

module.exports = router;
