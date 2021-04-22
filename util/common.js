var fs = require('fs');
var archiver = require('archiver');
var async = require('async');
var path = require('path');

function result(msg,data){
    var code = 0;
    if(msg){
        console.log(msg);
        code =-1;
    }
    return {code:code,data:data,msg:msg}
}
function error(msg){
    return result(msg,undefined);
}
function success(data){
    return result(undefined,data);
}

function geneTree(list){
   var topList = list.filter(n=>n.code.length==2);
    topList.forEach(f=> f.nodes = getChildren(f,list));
    return topList;
}

function getChildren(record,list){
    var pcode = record.code;
    var children = [];
    let reg = eval("/^"+pcode+"..$/");
    list.forEach(node =>{
        if(reg.test(node.code)){
            node.ptexts = (record.ptexts?(record.ptexts+">"):"") + record.text;
            node.nodes = getChildren(node,list);
            children.push(node);
        }
    })
    return children.length?children:undefined;
}


function page(query){
    let page = {limit:10,skip:0,pageSize:10,pageIndex:0};
    page.setCount = function(count){
        this.totalCount = count;
        this.pageTotal = (Math.floor(this.totalCount / this.pageSize) + (this.totalCount % this.pageSize > 0 ? 1 : 0));

        if (this.pageTotal < 1)
            this.pageTotal = 1;

    }
    if(!isNaN(query.pageSize)){
        page.pageSize = page.limit = parseInt(query.pageSize);
    }
    if(!isNaN(query.pageIndex)){
        page.pageIndex = parseInt(query.pageIndex);
        page.skip = page.limit*page.pageIndex;
    }
    return page;
}

var saveOrUpdate = function(Model,bean,cb){
    if(bean._id){
        Model.findOneAndUpdate({_id:bean._id},bean,cb)
    }else{
        var beanEntity = new  Model(bean);
        beanEntity.save(cb);
    }
}

var parseJson = function(str){
    let ret;
    try{
        ret = JSON.parse(str);
    }catch (e) {
        console.log(e)
    }
    return ret;
}

var deleteById = function(Model,id,cb){
    Model.deleteOne({_id:id},cb);
}

var getById = function(Model,id,cb){
    Model.findOne({_id:id},cb);
}

var pageQuery = function (Model,fields,where,pageInfo,sortParams,populate,callback) {

    let $page = {pageSize:10,pageIndex:0};

    if(!isNaN(pageInfo.pageSize)){
        $page.pageSize = parseInt(pageInfo.pageSize);
    }
    if(!isNaN(pageInfo.pageIndex)){
        $page.pageIndex = parseInt(pageInfo.pageIndex);
    }

    var start = $page.pageIndex* $page.pageSize;
   /* var $page = {
        pageNumber: page
    };*/
  
    async.parallel({
        count: function (done) {  // 查询数量
            Model.countDocuments(where).exec(function (err, count) {
                done(err, count);
            });
        },
        records: function (done) {   // 查询一页的记录
           if(!populate)
           Model.find(where).select(fields).skip(start).limit($page.pageSize).sort(sortParams).exec(function (err, doc) {
               done(err, doc);
           });
            else
           Model.find(where).select(fields).skip(start).limit($page.pageSize).populate(populate).sort(sortParams).exec(function (err, doc) {
               done(err, doc);
           });
        }
    }, function (err, results) {
        $page.totalCount = results.count;
        $page.pageTotal = Math.floor((results.count - 1) / $page.pageSize) + 1;
        $page.data = results.records;
        callback(err, $page);
    });
};

var zipFiles = function(files,fn){
    var zipPath = path.join(__dirname, '../upload_tmp/temp.zip');
    var archive = archiver('zip', {
        // Sets the compression level.
        zlib: {level: 9}
    });
    //创建临时zip文件
    var output = fs.createWriteStream(zipPath);
    archive.pipe(output);
    files.forEach(n=>archive.append(fs.createReadStream(n.path),{'name':n.name}))
    archive.finalize();
    archive.on('end', function (err) {
        fn(null, {name:"pic.zip",path:zipPath});
    });
    archive.on('error', function (err) {
        fn(new Error("压缩文件异常"), null);
    });
}

var keyToValue = function(dictList,input){
    if (Array.isArray(dictList[0])) {
        var pair = dictList && dictList.find(function (n) {
            return n[0] == input
        });
        if (pair) {
            return pair[1];
        } else {
            return "未定义";
        }
    } else {
        key = key || "id";
        text = text || "text";
        var obj = dictList.find(function (n) {
            return n[key] == input
        });
        if(text=='ptexts'){
            return obj && (obj.ptexts+" > "+obj.text);
        }else{
            return obj && obj[text];
        }
    }
}

module.exports ={
    result:result,
    error:error,
    success:success,
    geneTree:geneTree,
    pageQuery:pageQuery,
    saveOrUpdate:saveOrUpdate,
    deleteById:deleteById,
    getById:getById,
    zipFiles:zipFiles,
    keyToValue:keyToValue,
    parseJson:parseJson
}