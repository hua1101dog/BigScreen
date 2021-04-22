var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');
var common = require('../util/common')
var multer  = require('multer');
var urlencode = require('urlencode');
var upload = multer({dest: 'upload_tmp/'});



var birdMapModel = require('../models/birdMapModel').birdMapModel;

router.post('/save',upload.any(),  function(req, res, next){
    console.log(req.files[0]);  // 上传的文件信息

    var birdMap = req.body;
    birdMap.name = req.files[0].originalname;
    //birdMap.creator = req.session.user;
    fs.readFile( req.files[0].path, function (err, data) {
        birdMap.geojson =JSON.parse(data);
        var birdMapEnitity = new birdMapModel(birdMap);
        birdMapEnitity.save(function(error) {
            if(error) {
                console.log(error);
                res.json(common.error("system error,try later!"));
            } else {
                console.log('saved OK!');
                res.json(common.success());
            }
            // 关闭数据库链接
            // db.close();
        });
    })
});

router.post('/reUpload',upload.any(),  function(req, res, next){
    console.log(req.files[0]);  // 上传的文件信息

    common.getById(birdMapModel,req.body._id,function(err,result){
        if(result){
            var birdMap = result.toJSON();
            fs.readFile( req.files[0].path, function (err, data) {
                birdMap.geojson =JSON.parse(data);
                var birdMapEnitity = new birdMapModel(birdMap);
                common.saveOrUpdate(birdMapModel,birdMapEnitity,function(err){
                    res.json(common.result(err));
                })
            })
        }
    })
});



router.get('/list', function(req, res, next){
    var where = {"spaceCode":req.query.spaceCode};
    if(req.query.name){
        where.name = eval("/"+req.query.name+"/i");
    }
    var fields = {"geojson":0};
    common.pageQuery(birdMapModel,fields,where,req.query,{},{path:'creator', select: 'account'},function (error,page) {
        res.json(common.success(page));
    })
});

router.get('/existMap', function(req, res, next){
    let spaceCode = req.query.spaceCode;
    birdMapModel.findOne({spaceCode:spaceCode},{_id:1},function(err,result){
        res.json(common.result(err,result?1:0));
    })
});

router.get('/del', function(req, res, next){
    birdMapModel.deleteOne({_id:req.query.id},function (error,data) {
        res.json(common.result(error,data));
    })
});

router.get('/download', function(req, res, next){
    birdMapModel.findOne({_id:req.query.id},function (error,data) {
        res.set({
            'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件
            //'Content-Type': '"text/plain"', //告诉浏览器这是一个文本
            //'Content-Type': '"application/json"', //告诉浏览器这是一个文本
            'Content-Disposition': 'attachment; filename=' + urlencode(data.name) //告诉浏览器这是一个需要下载的文件
        });
            //,'Content-Length': data.size  //文件大小 JSON.stringify()
        res.json(data.geojson);
    })
});


module.exports = router;
