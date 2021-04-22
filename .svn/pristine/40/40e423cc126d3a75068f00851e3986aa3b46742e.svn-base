/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('localApiCtrl', function ($scope,$rootScope, $http,$uibModal,fac,$timeout) {
        $scope.search = {};
        $scope.pageModel = {};
        $scope.curPark = {};
         function getMenus(spaceCode){

             $scope.curPark.showUrl = "/show/"+spaceCode;
             $scope.curPark.menuUrl = "/free/getMenus?spaceCode="+spaceCode;
             $http.get($scope.curPark.menuUrl).success(function(resp){
                 if(resp.code==0){
                     fac.execTreeNode(resp.data,node=>{
                         if(node.nodes){
                             node.state = {expanded:true};
                         }
                     })
                     $scope.schemeMenu = resp.data;
                 }
             })
        };

        function getSpaceTree(){
            $http.get("../space/spaceTree").success(function (resp) {
                if(resp.code == 0){
                    var tree = resp.data || [];
                    fac.copyTreeState($scope.spaceTree,tree);
                    $scope.spaceTree = tree;
                    if(tree.length){
                        $scope.selectSpace(tree[0])
                    }
                }else{
                    alert(resp.msg);
                }
            })
        }
        getSpaceTree();

        $scope.selectSpace = function(node){
            var curNode = fac.getSelectedNode($scope.spaceTree);
            if (curNode && curNode != node) {
                curNode.state.selected = false;
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if(node.state.selected){
                $scope.curSpace = node;
                getMenus(node.code);
            }
        }

        $scope.selectScheme = function(node){
            var curNode = fac.getSelectedNode($scope.schemeMenu);
            if (curNode && curNode != node) {
                curNode.state.selected = false;
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if(node.state.selected && node.birdMap){
                $scope.curPark.schemeUrl = "/free/getScheme?id="+node._id;
                $scope.curPark.mapUrl = "/free/mapDetail.json?id="+node.birdMap;
            }else{
               delete  $scope.curPark.schemeUrl
                delete  $scope.curPark.mapUrl;
            }
        }
    });


    app.controller('localApiDetailCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,fac,item) {
        $scope.item = item;
        $scope.save = function(){

        }
       /* $uibModalInstance.opened.then(function(){
            var localApi = new AirocovMap.Map({
                //地图容器
                container: document.getElementById("canvas"),
                //地图楼层列表
                localApiList: [
                    {
                        name: "F1", //楼层名
                        //  localApiUrl: "/birdMap/localApiDetail?id="+item._id //地图路径
                        localApiUrl: "/admin/Change_CX.geojson" //地图路径
                    }
                ]
            });
        })*/

    });


})();