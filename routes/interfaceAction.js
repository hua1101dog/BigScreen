var express = require('express');
var router = express.Router();
var common = require('../util/common')
var scheduleService = require('./scheduleService')


var interfaceModel = require('../models/interfaceModel').interfaceModel;

router.get('/list', function(req, res, next){
    var where = {};
    if(req.query.name){
        let name = eval("/"+req.query.name+"/i");
        where.$or=[{"name":name},{url:name},{tags:name}];
    }
    var fields = {};
    common.pageQuery(interfaceModel,fields,where,req.query,{},[{path:'creator', select: 'account'},{path:'urlPrefix', select: ['name','prefix']}],function (error,page) {
        res.json(common.success(page));
    })
});

router.get('/existInterface', function(req, res, next){
    let search = {urlPrefix: req.query.urlPrefixId};
    interfaceModel.findOne(search,{_id:1},function(err,result){
        res.json(common.result(err,result?1:0));
    })
});

router.post('/existUrl_mute', function(req, res, next){
    let search = {};
    search.url = req.query.url;
    if(req.query.id){
        search._id = {$ne:req.query.id}
    }
    interfaceModel.findOne(search,{_id:1},function(err,result){
        res.json(common.result(err,result?1:0));
    })
});

router.post('/save', function(req, res, next){
    var interface = req.body;
    common.saveOrUpdate(interfaceModel,interface,function(err){
        scheduleService.addTask(interface);
        res.json(common.result(err));
    })
});

router.get('/del', function(req, res, next){
    interfaceModel.deleteOne({_id:req.query.id},function (error,data) {
        scheduleService.delTask(req.query.id);
        res.json(common.result(error,data));
    })
});

module.exports = router;
