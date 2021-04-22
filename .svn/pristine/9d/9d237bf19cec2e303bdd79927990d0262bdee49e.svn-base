var express = require('express');
var router = express.Router();
var common = require('../util/common')
var timeUtil = require('../util/timeUtil')

var schemeModel = require('../models/schemeModel').schemeModel;
var instanceModel = require('../models/instanceModel').instanceModel;
var interfaceModel = require('../models/interfaceModel').interfaceModel;

var ws = require('./webSocket')
var apiService = require('./apiService')

router.get('/cacheTree/:instanceId', function(req, res, next){
    let instanceId = req.params['instanceId'];
    apiService.getCacheTree(instanceId,tree=>res.json(common.success(tree)))
});

router.get('/cacheNode/:instanceId/:code', function(req, res, next){
    let instanceId = req.params['instanceId'];
    let code = req.params['code'];
    apiService.getCacheData(instanceId,code,resp=>res.json(resp))
});

router.post('/httpProxy', function(req, res, next){
    let url = req.body.url;

    let params =  timeUtil.fillParams(req.body.params);
    if(url.startsWith("http://")){
        apiService.httpProxy(req.body.url,req.body.method,params,{},resp=>res.json(resp));
    }else{
        interfaceModel.findOne({url:url},{},{lean: true ,populate:{path:'urlPrefix',select:'prefix'}},function(err,iface){
            if(err) {
                res.json(common.error(err));
                console.log(err);
            } else if(!iface){
                res.json(common.error("无法确定服务器路径!"+url));
            }else{
                let prefix = iface.urlPrefix.prefix;
                apiService.httpProxy(prefix+url,req.body.method,params,{},resp=>{
                    iface.lastParam = req.body.params;
                    iface.lastResp = resp;
                    iface.lastReqTime = new Date();
                    interfaceModel.findOneAndUpdate({_id:iface._id.toJSON()},iface,(e,r)=>{
                        console.log(e);
                        console.log(r);
                    });
                    res.json(resp)
                });
            }
        })
    }
});

function getSpaceCode(mac,cb){
    schemeModel.find({'markers.mac':mac},{spaceCode:1,markers:1},(err,result)=>{
        result.forEach(n=>{
            cb&&cb(n.spaceCode);
        })
    })
}

router.post('/pushSensorWorkunit', function(req, res, next){
    let mac = req.body.sensor.mac;
    getSpaceCode(mac,(spaceCode)=>{
        console.log("spaceCode:"+spaceCode);
        let clientIndex = spaceCode.substr(0,2);
        ws.send(clientIndex,"sensorWorkunit",req.body);
        /*let clients = ws.getClients(clientIndex);
        console.log("clients length:"+clients.length);
        clients.forEach(socket=>{
            socket.emit("sensorWorkunit",req.body);
        })*/
    })
    res.json(common.success())
});

router.get('outwork/list', function(req, res, next){
    var where = {};
    if(req.query.name){
        where.name = eval("/"+req.query.name+"/i");
    }
    if(req.query.date){
        where.startTime = {"$lte":req.query.date};
        where.endTime = {"$gte":req.query.date};
    }
    var fields = {};
    common.pageQuery(outworkModel,fields,where,req.query,{},{path:'creator', select: 'account'},function (error,page) {
        res.json(common.success(page));
    })
});

router.post('/pushSensorData', function(req, res, next){
    let mac = req.body.mac;
    let locationNo = req.body.locationNo;

    instanceModel.find({'params.key':'parkNo','params.value':locationNo},{},(err,result)=>{
        result.forEach(n=>{
            ws.send(n._id.toJSON(),"sensorData",req.body);
        })
    })
    res.json(common.success())
});

router.get('/visitor/list', function(req, res, next){
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


router.all('/megviiReg', function(req, res, next){
    console.log("megviiReg--:"+new Date().toLocaleDateString())
    console.log("#################################################")
    console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(req.params));
    console.log(JSON.stringify(req.query));
    res.json(common.success(req.query));
});

module.exports = router;
