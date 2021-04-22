var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var common = require('../util/common')
var spaceModel = require('../models/spaceModel').spaceModel;

router.post('/save', function(req, res, next){
    var item = req.body;
    if(item.code){
        //当前空间已有编码
        common.saveOrUpdate(spaceModel,item,function(err){
            res.json(common.result(err));
        })
    }else{
        let pcode = item.pcode||"";
        spaceModel.geneCode(pcode).then(obj =>{
            if(obj){
                let subCode =(parseInt(obj.code.substr(pcode.length,2), 36)+1).toString(36);
                let pad = new Array(3-subCode.length).join("0");
                item.code = pcode +pad + subCode ;
            }else{
                item.code = pcode +"01";
            }
            common.saveOrUpdate(spaceModel,item,function(err){
                res.json(common.result(err));
            })
        })
    }
});

router.get('/del', function(req, res, next){
    spaceModel.deleteOne({_id:req.query.id},function (error,data) {
        res.json(common.result(error,data));
    })
});

router.get('/spaceTree', function(req, res, next){
    spaceModel.find({},function (error,result) {
        let list = result.map(n=>n.toJSON());
        res.json(common.success(common.geneTree(list)));
    })
});


module.exports = router;
