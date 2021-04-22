var schedule = require('node-schedule')
var apiService = require('./apiService')
var timeUtil = require('../util/timeUtil');

var interfaceModel = require('../models/interfaceModel').interfaceModel;
var cacheModel = require('../models/cacheModel').cacheModel;
var ws = require('./webSocket')

var tasks = {};

function startAllJob (){
    interfaceModel.find({url:{$exists:true}},{},{populate: {path:'urlPrefix'}},function (error,interfaceList) {
        interfaceList.forEach(n=>addTask(n.toJSON()));
    })
}

/**
 * @param taskDef 任务定义（interface）
 */
function addTask ( taskDef){
    let taskId ;
    if(typeof taskDef._id === 'object'){
        taskId = taskDef._id.toJSON();
    }else{
        taskId = taskDef._id;
    }
    let existTask = tasks[taskId];
    //如果任务已存在，停止任务！
    if(existTask){
        existTask.cancel();
    }
    var job = schedule.scheduleJob(taskDef.fetchInvl, function(){
        cacheModel.find({interface:taskDef._id},{},{populate:'instance'},function(err,caches){
            caches.forEach(m=>{
                let cache = m.toJSON();
                if(!cache.instance){
                    return;
                }
                //设置默认值
                cache.params &&  cache.params.forEach(n=>{
                    let defaultParam =  cache.instance.params && cache.instance.params.find(m=>m.key == n.key);
                    if(defaultParam){
                        n.defVal = defaultParam.value;
                    }
                })
                let params = {};
                cache.params && cache.params.forEach(param=>{
                    let key = param["key"];
                    params[key] = param.value;
                    if(param.value === undefined||param.value === ''){
                        params[key] = param.defVal;
                    }
                })
                let url;
                if(taskDef.urlPrefix && taskDef.urlPrefix.prefix){
                    let a = taskDef.urlPrefix.prefix;
                    let b = taskDef.url;
                    if(a.endsWith("/") && b.startsWith("/")){
                        url = a.substr(0,a.length-2)+b;
                    }else if(!a.endsWith("/") && !b.startsWith("/")){
                        url = a+"/"+b;
                    }else{
                        url = a+b;
                    }
                }else{
                    url = taskDef.url;
                }

                apiService.httpProxy(url,taskDef.method,timeUtil.fillParams(params),{},resp=>{
                    if(resp){
                        if(resp.code == 0){
                            cache.realData = JSON.stringify(resp,null,4);
                            cache.realTime = new Date();
                            cache.fetchCnt = cache.fetchCnt||0;
                            cache.fetchCnt++;
                            cacheModel.findOneAndUpdate({_id:cache._id.toJSON()},cache,(error,data)=>{
                                console.log(error);
                            });
                            //推送给前端：
                            if(!cache.useFake){
                                resp.code=cache.code;
                                resp.fetchCnt = cache.fetchCnt;
                                resp.realTime = cache.realTime;
                                ws.send(cache.instance._id.toJSON(),"dataSync",resp);
                            }
                        }else{
                            console.error(url+":"+JSON.stringify(resp));
                        }
                    }else{
                        console.error(url+":无法访问！");
                    }
                })
            })
        })
        console.log('The answer to life, the universe, and everything!');
    });
    tasks[taskId] = job;
    console.log(taskDef.url);
}

function delTask(taskId){
    let existTask = tasks[taskId];
    //如果任务已存在，停止任务！
    if(existTask){
        existTask.cancel();
    }
}

module.exports = {
    startAllJob:startAllJob,
    addTask:addTask,
    delTask:delTask
};