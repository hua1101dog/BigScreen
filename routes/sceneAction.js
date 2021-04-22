var express = require('express');
var router = express.Router();
var common = require('../util/common')
var sceneModel = require('../models/sceneModel').sceneModel;

router.post('/save', function(req, res, next){
    var scene = req.body;
    common.saveOrUpdate(sceneModel,scene,function(err){
        res.json(common.result(err));
    })
});

router.get('/list', function(req, res, next){
    sceneModel.find({},function (error,result) {
        res.json(common.success(result));
    })
});

router.get('/del', function(req, res, next){
    common.deleteById(sceneModel,req.query.id,function(err,result){
        res.json(common.result(err,result));
    })
});

module.exports = router;
