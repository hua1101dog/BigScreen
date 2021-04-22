var express = require('express');
var router = express.Router();
var fs = require('fs');
var common = require('../util/common')
var multer  = require('multer');
var urlencode = require('urlencode');
var upload = multer({dest: 'upload_tmp/'});

const PIC_FOLDER = 'public/pic/'
const config = {
    "imageActionName": "uploadimage", /* 执行上传图片的action名称 */
    "imageFieldName": "file", /* 提交的图片表单名称 */
    "imageMaxSize": 10240000, /* 上传大小限制，单位B */
    "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 上传图片格式显示 */
    "imageCompressEnable": true, /* 是否压缩图片,默认是true */
    "imageCompressBorder": 1600, /* 图片压缩最长边限制 */
    "imageInsertAlign": "none", /* 插入的图片浮动方式 */
    "imageUrlPrefix": "", /* 图片访问路径前缀 */
    "imagePathFormat": "/pic/ueditor" + "/size*{yyyy}{mm}{dd}{time}{rand:6}"/* 上传保存路径,可以自定义保存路径和文件名格式 */
};

function uploadimage(req,res){
    console.log(req.files[0]);  // 上传的文件信息
    let file =     req.files[0];
    let nfileName = new Date().getTime()+file.originalname;
    if(!fs.existsSync(PIC_FOLDER+"ueditor")){
        fs.mkdirSync(PIC_FOLDER+"ueditor");
    }
    fs.renameSync(file.path,PIC_FOLDER+"ueditor/"+nfileName);
    ret = {"state":"SUCCESS","type":".jpg",original:file.originalname,"url":"/pic/ueditor/"+nfileName}
    res.json(ret);
}
router.all("/ueditor",upload.any(),function(req, res, next){
    let action = req.query.action;
    switch (action) {
        case "uploadimage":uploadimage(req, res);break;
        case "config": res.json(config);
    }
});

module.exports = router;
