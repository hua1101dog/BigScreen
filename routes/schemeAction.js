var express = require('express');
var router = express.Router();
var common = require('../util/common')
var schemeModel = require('../models/schemeModel').schemeModel;
var spaceModel = require('../models/spaceModel').spaceModel;


router.post('/save', function(req, res, next){
    var scheme = req.body;
    common.saveOrUpdate(schemeModel,scheme,function(err){
        res.json(common.result(err));
    })
});

router.get('/copy', function(req, res, next){
    var schemeId = req.query.schemeId;
    schemeModel.findOne({_id:schemeId},{},function(err,result){
        if(err)
            res.json(common.error(err));
        if(result){
            var scheme = result.toJSON();
            delete scheme._id;
            delete scheme.createTime;
            scheme.name  +="(copy)";
            common.saveOrUpdate(schemeModel,scheme,function(err){
                res.json(common.result(err));
            })
        }
    })
});



router.get('/getById', function(req, res, next){
    common.getById(schemeModel,req.query.id,function(err,result){
        if(result.spaceCode){
            spaceModel.getPtexts(result.spaceCode,function(ptexts){
                let scheme = result.toJSON();
                scheme.spacePtexts =ptexts;
                res.json(common.success(scheme));
            })
        }
    })
});
router.get('/list', function(req, res, next){
    var where = {};
    if(req.query.schemeTypeId){
        where.schemeType = req.query.schemeTypeId
    }
    if(req.query.name){
        where.name = eval("/"+req.query.name+"/i");
    }
    if(req.query.spaceCode){
        where.spaceCode = eval("/^"+req.query.spaceCode+"/i");
    }
    var fields = {};
    common.pageQuery(schemeModel,fields,where,req.query,{},[{path:'schemeType', select: 'name'},{path:'birdMap', select: 'name'},{path:'creator', select: 'account'}],function (error,page) {
        res.json(common.success(page));
    })
});

router.get('/existScheme', function(req, res, next){
    let typeId = req.query.typeId;
    schemeModel.findOne({schemeType:typeId},{_id:1},function(err,result){
        res.json(common.result(err,result?1:0));
    })
});

router.get('/del', function(req, res, next){
    schemeModel.deleteOne({_id:req.query.id},function (error,data) {
        res.json(common.result(error,data));
    })
});

module.exports = router;
