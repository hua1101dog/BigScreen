/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('dataTreeCtrl', function ($scope,$rootScope, $http,$uibModal,fac,$timeout) {
        $scope.search = {};
        $scope.pageModel = {};

        function getDataTree(sceneId){
            $http.get("/dataNode/dataTree?sceneId="+sceneId).success(function(resp){
                if(resp.code==0){
                    fac.execTreeNode(resp.data,node=>{
                        if(node.nodes){
                            node.state = {expanded:true};
                        }
                    })
                    $scope.dataTree = resp.data;
                }
            })
        };

        $scope.selectType = function(type){
            if($scope.curType==type){
                return;
            }
            $scope.curType = type;
            getDataTree(type._id);
        }

        function getSceneList(){
            $http.get("../scene/list").success(function(resp){
                if(resp.code === 0){
                    $scope.typeList = resp.data;
                    if($scope.typeList.length){
                        if($scope.curType){
                            $scope.curType = $scope.typeList.find(n=>n._id == $scope.curType._id);
                        }else{
                            $scope.selectType($scope.typeList[0])
                        }
                    }
                    $("#folderScroll").css("height",window.innerHeight-90);
                }else{
                    alert(resp.msg);
                }
            })
        }
        getSceneList();

        $scope.editType = function(type){
            var modal = $uibModal.open({
                animation: true,
                size:'',
                templateUrl: 'view/interface/scene.modal.html',
                controller: 'sceneCtrl'
                ,resolve: {type: angular.extend({},type),typeList:function(){return $scope.typeList}}
            });
            modal.result.then(function (data) {
                getSceneList();
            });
        }

        $scope.delType = function(type){
            $http.get("../dataNode/existDataTree?sceneId="+type._id).success(function(resp){
                if(resp.code ==0){
                    if(resp.data ==1){
                        alert(type.name+"场景下存在数据树，请清空后再删除！");
                    }else{
                        confirm("确认删除场景"+type.name+"？",function(){
                            $http.get("../scene/del?id="+type._id).success(function(resp){
                                if(resp.code === 0){
                                    $scope.typeList.splice($scope.typeList.indexOf(type),1);
                                    if($scope.curType == type){
                                        $scope.typeList.length && ($scope.selectType($scope.typeList[0]))
                                    }
                                }else{
                                    alert(resp.msg);
                                }
                            })
                        });
                    }
                }
            })
        }

        //编辑分类
        $scope.addTopNode =  $scope.editNode = function(node){
            if(!$scope.curType){
                alert("请先择一个场景！");
                return;
            }
            var modal = $uibModal.open({
                animation: true,
                size:'',
                templateUrl: 'view/interface/dataNode.modal.html',
                controller: 'dataNodeCtrl'
                ,resolve: {dataNode: angular.extend({scene:$scope.curType._id},node),dataTree:function(){return $scope.dataTree}}
            });
            modal.result.then(function (data) {
                getDataTree($scope.curType._id);
            });
        }

        //添加子分类
        $scope.addSon = function (node) {
            var dataNode = {scene:$scope.curType._id,
                            ptexts:(node.ptexts?node.ptexts+">":"")+node.text,pcode:node.code}
            var modal = $uibModal.open({
                animation: true,
                size:'',
                templateUrl: 'view/interface/dataNode.modal.html',
                controller: 'dataNodeCtrl'
                ,resolve: {dataNode: dataNode,dataTree:function(){return $scope.spaceTree}}
            });
            modal.result.then(function (data) {
                getDataTree($scope.curType._id);
            });
        }

        //删除组织
        $scope.delNode = function(node){
            if(node.nodes && node.nodes.length>0){
                alert('存在下级节点，清勿删除！');
                return;
            }
            confirm("确认删除数据节点"+node.text+"？",function(){
                $http.get("../dataNode/del?id="+node._id).success(function(resp){
                    if(resp.code === 0){
                        getDataTree($scope.curType._id);
                    }else{
                        alert(resp.msg);
                    }
                })
            });
        }


    });

    app.controller('sceneCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,$uibModal,fac,type) {
        type.types = type.types||[];
        $scope.item = type;

        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.post("../scene/save",item).success(function(resp, status, headers, config) {
                if(resp.code ==0){
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(resp.error);
                }
            })
        }
    });

    app.controller('dataNodeCtrl', function($scope,$rootScope,$http,$uibModalInstance,$q,fac,dataNode,dataTree) {
        $scope.item = dataNode;

        $scope.findInterface = function(val){
            var deferred = $q.defer()
            var param = {name:val};
            $.extend(param,{currentPage:1,pageSize:10});
            fac.getPageResult("../interface/list",param,function(pageModel){
                deferred.resolve(pageModel.data);
            });
            return deferred.promise;
        };

        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.post("../dataNode/save",item).success(function(resp, status, headers, config) {
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