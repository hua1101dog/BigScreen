var common = require('../util/common')
var request = require('request');
var mongoose = require('mongoose');

var instanceModel = require('../models/instanceModel').instanceModel;
var cacheModel = require('../models/cacheModel').cacheModel;
var dataNodeModel = require('../models/dataNodeModel').dataNodeModel;
var interfaceModel = require('../models/interfaceModel').interfaceModel;
var sceneModel = require('../models/sceneModel').sceneModel;


function getInstancePromiss(instanceId){
    return instanceModel.findOne({_id:instanceId},{}).exec();
}

function allDataNodesPromiss(sceneId){
    let search = {scene:sceneId}
   return dataNodeModel.find(search,{}).populate({path:'interface',populate: { path: 'urlPrefix' }}).exec()
}

function httpProxy(url,method,qs,form,cb){
    let options = {
        headers: {"Connection": "close"},
        url: url,
        qs:qs,
        form:form,
        method: method||"GET",
        json: true,
        body: {}
    };
    function callback(error, response, data) {
        if (!error && response.statusCode == 200) {
            console.log('------接口数据------',data);
            cb&& cb(data);
        }else{
            cb&& cb(error);
        }
    }
    request(options,callback);
}

function getCacheData(instanceId,code,cb){
    cacheModel.findOne({instance:instanceId,code:code},{},function (error,resp) {
            let cache = resp.toJSON();
            let data;
            if(cache.useFake ){
                data = common.parseJson(cache.fakeData);
            }else if(!cache.useFake){
                data = common.parseJson(cache.realData);
            }
         cb&& cb(data);
    })
}

function getCacheTree(instanceId,cb){

    let instancePromiss = getInstancePromiss(instanceId);
    instancePromiss.then(instance=>allDataNodesPromiss(instance.scene).then(dataNodeList=>{

        cacheModel.find({instance:instanceId},{},{populate:[{path:'interface',populate: { path: 'urlPrefix' }}]},function (error,result) {
            //删除已不在模板中的缓存
            for(var i=result.length-1;i>=0;i--){
                let cache = result[i];
                if(!dataNodeList.find(dataNode=>dataNode.code == cache.code)){
                    result.splice(i,1);
                    cacheModel.deleteOne({_id:cache._id});
                    continue;
                }
                for(let j = i+1;j<=result.length-1;j++){
                    let otherCache =  result[j];
                    if(otherCache.code == cache.code){
                        result.splice(i,1);
                        cacheModel.deleteOne({_id:cache._id});
                        continue;
                    }
                }
            }

            let list = result.map(n=>n.toJSON());

            dataNodeList.forEach(dataNode=>{
                let cache = list.find(n=>n.code == dataNode.code);
                if(!cache){
                    cache = {code:dataNode.code,text:dataNode.text,interface:dataNode.interface,instance:instanceId}
                    if(cache.interface){
                        if(cache.interface.url){
                            cache.useFake = false;
                        }else{
                            cache.useFake = true;
                        }
                        cache._id = mongoose.Types.ObjectId();
                        var cacheEntity = new cacheModel(cache);
                        cacheEntity.save();
                    }
                    list.push(cache);
                }else if(!dataNode.interface|| !cache.interface || (cache.interface && cache.interface._id.toJSON() != dataNode.interface._id.toJSON())){
                    cache.interface = dataNode.interface;
                    delete cache.params;
                    delete cache.fakeData;
                    delete cache.realData;
                    delete cache.realTime;
                    delete cache.fakeTime;
                    delete cache.useFake;
                    delete cache.fetchCnt;
                    if(cache.interface && cache.interface.url){
                        cache.useFake = false;
                    }else{
                        cache.useFake = true;
                    }
                }
                if(cache.text != dataNode.text){
                    cache.text = dataNode.text;
                }
            })

            list.forEach(cache=>{
                if(cache.interface){
                    if(cache.useFake ){
                        cache.data = common.parseJson(cache.fakeData);
                    }else if(!cache.useFake){
                        cache.data = common.parseJson(cache.realData);
                    }
                    if(cache.data && cache.data.code == 0){
                        cache.status = 1;
                    }else{
                        cache.status = 2;
                    }
                    cache.url = "/api/cacheNode/"+instanceId+"/"+cache.code;

                    //设置cacheNode的params
                    let paramList = cache.interface.params;
                    cache.params =  cache.params||[];
                    for(let i = cache.params.length-1;i>=0;i--){
                        if(!paramList.find(param=>cache.params[i].key == param.key)){
                            cache.params.splice(i,1);
                        }
                    }
                    paramList.forEach(param =>{
                        if(!cache.params.find(n=>n.key==param.key)){
                            cache.params.push(param);
                        }
                    })
                    //设置默认值
                    cache.params.forEach(n=>{
                            let defaultParam = instance.params.find(m=>m.key == n.key);
                             if(defaultParam){
                                 n.defVal = defaultParam.value;
                             }
                    })
                }
                return cache;
            });

            cb && cb(common.geneTree(list));
        })
    }))

}


module.exports = {
    getCacheTree:getCacheTree,
    getCacheData:getCacheData,
    httpProxy:httpProxy
};