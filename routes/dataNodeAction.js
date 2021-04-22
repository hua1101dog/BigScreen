var express = require('express');
var router = express.Router();
var common = require('../util/common')
var dataNodeModel = require('../models/dataNodeModel').dataNodeModel;
var sceneModel = require('../models/sceneModel').sceneModel;


router.get('/dataTree', function(req, res, next){
    let search = {scene:req.query.sceneId}
    dataNodeModel.find(search,{},{populate:[{path:'interface', select: ['name']}]},function (error,result) {
        let list = result.map(n=>n.toJSON());
        res.json(common.success(common.geneTree(list)));
    })
});

router.get('/existDataTree', function(req, res, next){
    let search = {scene:req.query.sceneId}
    dataNodeModel.findOne(search,{_id:1},function (err,result) {
        res.json(common.result(err,result?1:0));
    })
});


router.post('/save', function(req, res, next){
    var item = req.body;
    if(item.code){
        //当前空间已有编码
        common.saveOrUpdate(dataNodeModel,item,function(err){
            res.json(common.result(err));
        })
    }else{
        let pcode = item.pcode||"";
        dataNodeModel.geneCode(pcode).then(obj =>{
            if(obj){
                let subCode =(parseInt(obj.code.substr(pcode.length,2), 36)+1).toString(36);
                let pad = new Array(3-subCode.length).join("0");
                item.code = pcode +pad + subCode ;
            }else{
                item.code = pcode +"01";
            }
            common.saveOrUpdate(dataNodeModel,item,function(err){
                res.json(common.result(err));
            })
        })
    }
});

router.get('/del', function(req, res, next){
    dataNodeModel.deleteOne({_id:req.query.id},function (error,data) {
        res.json(common.result(error,data));
    })
});

router.get('/definedParams', function(req, res, next){
    let search = {scene:req.query.sceneId,interface:{$exists:true}}
    dataNodeModel.find(search,{},{populate:[{path:'interface', select: ['params']}]},function (error,result) {
        let params = result.reduce((ret,n)=>{
            let params = n.interface.params;
            params.forEach( m=> {if(!ret.find(k=>k.key == m.key))ret.push(m)});
            return ret;
        },[])
        res.json(common.success(params));
    })
});

router.get('/existDataNode', function(req, res, next){
    let interfaceId = req.query.interfaceId;
    dataNodeModel.findOne({interface:interfaceId},{_id:1},function(err,result){
        res.json(common.result(err,result?1:0));
    })
});


module.exports = router;
