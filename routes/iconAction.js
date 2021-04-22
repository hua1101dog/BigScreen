var express = require('express');
var router = express.Router();
var fs = require('fs');
var common = require('../util/common')
var multer  = require('multer');
var urlencode = require('urlencode');
var upload = multer({dest: 'upload_tmp/'});

const PIC_FOLDER = 'public/pic/';
    router.get('/listFolder', function(req, res, next) {
            let dirs = fs.readdirSync(PIC_FOLDER).filter(n => fs.statSync(PIC_FOLDER + n).isDirectory())
            dirs.splice(0, 0, "/");
            res.json(common.success(dirs.map(n => {
                return {text: n}
            })))
    })

    router.get('/listIcons', function(req, res, next) {
        let folder = req.query.folder;
        let files = fs.readdirSync(PIC_FOLDER + folder).filter(n => fs.statSync(PIC_FOLDER + folder + "/" + n).isFile())
        let fileList = files.map(n => {
            return {name: n, url: folder == "/"?("/pic/"+n):("/pic/" + folder + "/" + n)}
        }).sort((a,b)=>{
            let pureNum = /^\d+\./;
            if(pureNum.test(a.name) && pureNum.test(b.name)){
                return parseInt(a.name)-parseInt(b.name);
            }else if(a.name.toString().toLowerCase()>b.name.toString().toLowerCase())
                return 1;
            return -1;
        })
        res.json(common.success(fileList));
    })

    router.get('/existImage', function(req, res, next) {
        let folder = req.query.folder;
        let file = fs.readdirSync(PIC_FOLDER + folder).find(n => fs.statSync(PIC_FOLDER + folder + "/" + n).isFile())
        res.json(common.success(file?1:0));
    });

    router.get('/delFolder', function(req, res, next) {
        let folder = req.query.folder;
        fs.rmdir(PIC_FOLDER+folder, err => {
            res.json(common.result(err,folder));
        });
    });

    router.get('/mkDir', function(req, res, next) {
        let folder = req.query.folder;
        fs.mkdirSync(PIC_FOLDER+folder);
        res.json(common.success(folder));
    });

    router.post('/renameDir', function(req, res, next) {
        let payload = req.body;
        fs.rename(PIC_FOLDER+payload.oriFolder,PIC_FOLDER+payload.folder,err=>res.json(common.result(err,payload.folder)));
    });

    router.post('/upload',upload.any(),  function(req, res, next){
        console.log(req.files[0]);  // 上传的文件信息
        var folder = req.body.folder;
        req.files.forEach(file=>{
            fs.renameSync(file.path,PIC_FOLDER+folder+"/"+file.originalname);
        })
        res.json(common.success());
    });

    router.post('/del', function(req, res, next){
        let param = req.body;
        param.files.forEach(file=>{
            fs.unlinkSync(PIC_FOLDER+param.folder+"/"+file);
        })
        res.json(common.success());
    });

    router.get('/download', function(req, res, next){
        let str = req.query.str;
        let param = JSON.parse(str);
        let list = param.files.map(file=> {return {name:file,path:PIC_FOLDER+param.folder+"/"+file}})
        common.zipFiles(list,(err,zip)=>{

            res.download(zip.path, zip.name);
           /* var f = fs.createReadStream(zip.path);
            res.writeHead(200, {
                'Content-Type': 'application/force-download',
                'Content-Disposition': 'attachment; filename='+ encodeURI(zip.name) + '.zip'
            });
            f.pipe(res);*/
        });
    });


module.exports = router;
