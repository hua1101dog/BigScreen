var express = require('express');
var router = express.Router();
var common = require('../util/common');
var timeUtil = require('../util/timeUtil');

var userModel = require('../models/userModel').userModel;
var schemeModel = require('../models/schemeModel').schemeModel;
var spaceModel = require('../models/spaceModel').spaceModel;
var birdMapModel = require('../models/birdMapModel').birdMapModel;

var ws = require('./webSocket');

/* GET users listing. */
router.post('/login', function(req, res, next) {

    var user = {account:req.body.account,password : req.body.password}
    // new 一个新对象，名叫 kitty
// 接着为 kitty 的属性们赋值
    //res.json({success:true,username:username,password:password});
    userModel.findOne(user,function(error,result){
        if(error) {
            res.json(common.error(error));
            console.log(error);
        }else if(!result){
            //数据库连接失败 : error 与result 皆为空
            res.json(common.error("user doesn't exist or password wrong!"));
        }else{
            req.session.user = result;
            res.json(common.success(req.session.user));
        }
    });
// 基于静态方法的查询
 /*   userModel.find({account:username},function(error, result){
        //关闭数据库链接
        //  db.close();

    });*/
});

router.get("/logout",function (req,res) {
    req.session.user = null;
    res.json(common.success());
})

router.get("/getUserInfo",function (req,res) {
    let data = {user:req.session.user};
    data.dicts = global.config.dicts;
    data.menus = global.config.menus;
    res.json(common.success(data));
})

router.get('/getScheme', function(req, res, next){
    schemeModel.findOne({_id:req.query.id},{},{populate:[{path:'schemeType', select: ['types','name']},{path:'creator', select: 'account'}]},function(err,result){
        if(err)
            res.json(common.error(err));
        else if(!result){
            res.json(common.error("方案已不存在！"));
        }else if(result.spaceCode)
            spaceModel.getPtexts(result.spaceCode,function(ptexts){
                let scheme = result.toJSON();
                scheme.schemeType.types.forEach(n=>{
                    n.title = common.keyToValue(global.config.dicts.markerTypeDict,n.type);
                });
                scheme.spacePtexts =ptexts;
                res.json(common.success(scheme));
            })
    })
});

router.get('/mapDetail.json', function(req, res, next){
    birdMapModel.findOne({_id:req.query.id},function (err,data) {
        if(!data)  res.json(common.error("无地图"));
        else{
            res.set({
                'Content-Type': '"application/json"',
                'cache-Control': 'max-age=500 '
            });
            res.end(JSON.stringify(data.geojson));
        }
    })
});

//获取所有方案
function extracted(ret,reg, spaceDict, res) {
    schemeModel.find({spaceCode: reg}, {
        name: 1,
        schemeType: 1,
        spaceCode: 1,
        tag: 1,
        birdMap: 1
    }, {sort: {spaceCode: 1}, populate: [{path: 'schemeType', select: ['category', 'name','iconfont']}]}).exec((err, data) => {

        global.config.dicts.categoryDict.forEach(cate => {
            let cataList = data.filter(scheme => scheme.schemeType.category == cate[0])
            if (cataList.length) {
                let topMenu = {"text": cate[1], category: cate[0]};
                let spaces = cataList.reduce((ret, n) => {
                    let space = ret.find(s => s.spaceCode == n.spaceCode);
                    if (!space) {
                        space = {spaceCode: n.spaceCode, nodes: []};
                        space.text = spaceDict.find(m => m.code == space.spaceCode).text;
                        ret.push(space);
                    }
                    let schemeType = space.nodes.find(s => s._id == n.schemeType._id.toJSON());
                    if (!schemeType) {
                        schemeType = n.schemeType.toJSON();
                        schemeType.text = schemeType.name;
                        schemeType.nodes = [];
                        space.nodes.push(schemeType);
                    }
                    let tagNode = schemeType.nodes.find(g => g.tag == n.tag);
                    if (!tagNode) {
                        tagNode = {
                            tag: n.tag||"标准",
                            nodes: [],
                            text: n.tag||"标准"
                        }
                        schemeType.nodes.push(tagNode);
                        //schemeType.nodes.sort((a,b)=>a.grade-b.grade);
                    }
                    let scheme = n.toJSON();
                    scheme.text = scheme.name;
                    tagNode.nodes.push(scheme);
                    return ret
                }, [])
                //将三级空间放至它们的父节点中,三级以下(4级等)暂不考虑:
                let builds = spaces.filter(b=>b.spaceCode.length == 6);
                builds.forEach(b=>{
                    let p = spaces.find(s=>s.spaceCode.length==4&&b.spaceCode.startsWith(s.spaceCode));
                    if(!p){
                        p = {spaceCode: b.spaceCode.substr(0,4), nodes: []};
                        p.text = spaceDict.find(m => m.code == p.spaceCode).text;
                        spaces.push(p);
                    }
                    if(!p.birdMap && ret.length){
                        p.birdMap = ret[0].birdMap;
                    }
                    p.nodes = p.nodes||[];
                    p.nodes.push(b);
                    spaces.splice(spaces.indexOf(b),1);
                })
                topMenu.nodes = spaces;
                ret.push(topMenu);
            }
        })
        res.json(common.result(err, ret));
    });
}

/**
 * 自定义大屏,获取菜单
 */
router.get("/getMenus",function (req,res) {
    let spaceCode = req.query.spaceCode;
    if(!/^[0-9a-zA-Z]{2,}$/i.test(spaceCode)){
        res.json(common.error("空间编码错误!"));
    }
    //获取所有的方案
    let reg = eval("/^"+spaceCode+"/");
    let spaceDictPromiss = spaceModel.find({code:reg},{"text":1,'policyList':1,code:1}).exec();

    spaceDictPromiss.then(spaceDict=>{
        birdMapModel.findOne({spaceCode:reg},{_id:1,spaceCode:1},function(err,result){
            let ret = [];
            if(result){
                let mapJson = result.toJSON();
                let space = spaceDict.find(m => m.code == mapJson.spaceCode);
                if(space.policyList && space.policyList.length){
                    mapJson.text = space.text+"概况";
                    mapJson.policyList = space.policyList;
                    mapJson.birdMap = mapJson._id;
                    delete mapJson._id;
                    ret.push(mapJson);
                }
            }
            extracted(ret,reg, spaceDict, res);
        })
    });
})

router.get("/dateDict",function (req,res) {
    res.json(common.success(timeUtil.dateDict));
});

router.post("/personSync",function (req,res) {
    res.json(common.success());
    ws.send('5cbe82ca3c8b2c584595fa8e',"personSync",req.body);
})


router.get("/registerCompanyNum",function (req,res) {
    req.session.user = null;
    res.json(common.success());
})

module.exports = router;
