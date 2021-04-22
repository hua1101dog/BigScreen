var express = require('express');
var router = express.Router();
var common = require('../util/common')

var visitorModel = require('../models/visitorModel').visitorModel;

router.get('/list', function(req, res, next){
    var where = {};
    if(req.query.visitor){
        where.visitor = eval("/"+req.query.visitor+"/i");
    }
    if(req.query.visitDate){
        where.visitDate = {"$gte":req.query.visitDate};
    }

    var fields = {};
    common.pageQuery(visitorModel,fields,where,req.query,{},{path:'creator', select: 'account'},function (error,page) {
        res.json(common.success(page));
    })
});


router.post('/todayVisitor', function(req, res, next){
    let date = req.body.visitDate;

    visitorModel.find({'params.key':'visitDate','params.value':date},{},(err,result)=>{
        result.forEach(n=>{
            ws.send(n._id.toJSON(),"visitor",req.body);
        })
    })
    res.json(common.success())
});


router.get('/all', function(req, res, next){
    visitorModel.find({},{},(err,result)=>{
        res.json(common.result(err,result));
    })
});


router.post('/save', function(req, res, next){
    var interface = req.body;
    common.saveOrUpdate(visitorModel,interface,function(err){
        res.json(common.result(err));
    })
});

router.get('/del', function(req, res, next){
    visitorModel.deleteOne({_id:req.query.id},function (error,data) {
        res.json(common.result(error,data));
    })
});

module.exports = router;
