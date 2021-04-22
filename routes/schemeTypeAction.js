var express = require('express');
var router = express.Router();
var common = require('../util/common')
var schemeTypeModel = require('../models/schemeTypeModel').schemeTypeModel;

router.post('/save', function(req, res, next){
    var schemeType = req.body;
    common.saveOrUpdate(schemeTypeModel,schemeType,function(err){
        res.json(common.result(err));
    })
});

router.get('/list', function(req, res, next){
    schemeTypeModel.find({},function (error,result) {
        res.json(common.success(result));
    })
});

router.get('/del', function(req, res, next){
    common.deleteById(schemeTypeModel,req.query.id,function(err,result){
        res.json(common.result(err,result));
    })
});

module.exports = router;
