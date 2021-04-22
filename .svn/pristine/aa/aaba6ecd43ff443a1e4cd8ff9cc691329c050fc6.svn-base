/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('instanceCtrl', function ($scope,$rootScope, $http,$uibModal,fac,$timeout) {
        $scope.search = {};
        $scope.pageModel = {};

         $scope.find  = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("../instance/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();
        $scope.del = function(item){
            confirm("确认删除该实例吗？",function(){
                $http.get("../instance/del?id="+item._id).success(function(resp){
                    if(resp.code === 0){
                        $scope.find();
                    }else{
                        alert(resp.msg);
                    }
                })
            });
         }

        $scope.edit = function(item){
            var modal = $uibModal.open({
                animation: true,
                size:'',
                templateUrl: 'view/interface/instance.modal.html',
                controller: 'instanceEditCtrl'
                ,resolve: {item: $.extend(true,{},item)}
            });
            modal.result.then(function (data) {
                $scope.find();
            });
        }

        var ws;
        $scope.selectInstance = function(instance){
            $scope.curInstance = instance;
            $http.get("/api/cacheTree/"+instance._id).success(function(resp){
                if(resp.code==0){
                    fac.execTreeNode(resp.data,node=>{
                        if(node.nodes){
                            node.state = {expanded:true};
                        }
                    })
                    $scope.cacheTree = resp.data;
                }
            })

            //app.ws = new WebSocket("ws://bigscreen.ovuems.com");
            if(ws){
                ws.close();
            }
           ws = new ReconnectingWebSocket($rootScope.wsUrl, null, {debug: true, reconnectInterval: 5000})
           // ws = new ReconnectingWebSocket("ws://localhost:3000", null, {debug: true, reconnectInterval: 5000})
            ws.onopen = function() {
                console.log("连接状态", ws);
                let message = {spaceCode: instance._id,type:"login"};
                ws.send(JSON.stringify(message));
                console.log("open");
            };
            ws.onmessage = function(evt) {
                let data = JSON.parse(evt.data);
                console.log(data);
                /*if(data && data.type == 'dataSync'){
                    alert("dataSync:"+evt.data);
                }
                if(data && data.type == 'sensorData'){
                    alert("sensorData:"+evt.data);
                }*/
            };
        }


        $scope.getDataClass=function(node){
            let dataClass= {'glyphicon-globe':!node.useFake,'glyphicon-wrench':node.useFake}
            dataClass["text-success"] = (node.status ==1);
            dataClass["text-danger"] = (node.status ==2);
            return dataClass;
        }

        $scope.selectDataCache = function(node){
            if(node.interface){
                var curNode = fac.getSelectedNode($scope.cacheTree);
                if (curNode && curNode._id != node._id) {
                    curNode.state.selected = false;
                }
                node.state = node.state || {};
                node.state.selected = true;
                $scope.curCache = $.extend(true,{},node);
            }
        }

        $scope.getRealData = function(cache){
            let params = {};
            cache.params.forEach(param=>{
                let key = param["key"];
                params[key] = param.value;
                if(param.value === undefined||param.value === ''){
                    params[key] = param.defVal;
                }
            })
            let url = cache.interface.urlPrefix.prefix+cache.interface.url;
            $http.post("/api/httpProxy",{url:url,method:cache.interface.method,params:params}).success(resp=>{
                 cache.realData = JSON.stringify(resp,null,4);
                 cache.realTime = new Date();
                cache.fetchCnt = cache.fetchCnt||0;
                cache.fetchCnt++;
            })
        }

        $scope. saveCacheData = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            if(item.useFake){
                try{
                    var fakeData = JSON.parse(item.fakeData);
                }catch (e) {
                    alert(e.message);
                    return;
                }
                if(fakeData.code != 0){
                    alert("请输入正常模拟数据！");
                    return;
                }
            }else{
                try{
                    var realData = JSON.parse(item.realData);
                }catch (e) {
                    alert(e.message);
                    return;
                }
                if(!realData ||realData.code != 0){
                    alert("请从接口获取数据！");
                    return;
                }
            }
            item.status = 1;
            $http.post("../cache/save",item).success(function(resp, status, headers, config) {
                if(resp.code ==0){
                     let node = fac.getSelectedNode($scope.cacheTree);
                     $.extend(node,item);
                    msg("保存成功!");
                } else {
                    alert(resp.error);
                }
            })
        }
    });


    app.controller('instanceEditCtrl', function($scope,$http,$uibModalInstance,$q,fac,item) {
        item.params = item.params||[];
        $scope.item = item;

        $scope.getDefinedParams = function(scene){
            let sceneId = scene._id;
            $http.get("/dataNode/definedParams?sceneId="+sceneId).success(function(resp){
                let paramList = resp.data;
                for(let i = item.params.length-1;i>=0;i--){
                    if(!paramList.find(param=>item.params[i].key == param.key)){
                        item.params.splice(i,1);
                    }
                }
                paramList.forEach(param =>{
                    if(!item.params.find(n=>n.key==param.key)){
                        item.params.push(param);
                    }
                })
            })
        }

        if(item.scene){
            $scope.getDefinedParams(item.scene);
        }

        $scope.findScene = function(val){
            var deferred = $q.defer()
            $http.get("../scene/list?name="+val).success(function(resp){
                deferred.resolve(resp.data);
            })
            return deferred.promise;
        };





        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.post("../instance/save",item).success(function(resp, status, headers, config) {
                if(resp.code ==0){
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(resp.error);
                }
            })
        }
    });

})();