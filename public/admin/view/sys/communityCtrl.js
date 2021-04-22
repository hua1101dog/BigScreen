(function() {
    "use strict";
    var app = angular.module("angularApp");
    //项目架构ctl
    app.controller('communityTreeCtrl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="工作分类树";

        function getCommunityTree(){
            $http.get("../community/communityTree").success(function (resp) {
                if(resp.code == 0){
                    var tree = resp.data || [];
                    var flatTree = fac.treeToFlat(tree);
                    flatTree.forEach(function(n){
                        if(!n.nodes){
                            n.cnt = n.code;
                        }
                    })
                    fac.copyTreeState($scope.communityTree,tree);
                    $scope.communityTree = tree;
                }
            })
        }
        getCommunityTree();
        //添加一级分类


        //添加子分类
        $scope.addSon = function (node) {
            var community = {ptexts:(node.ptexts?node.ptexts+">":"")+node.text,pid:node.id,
                pids:(node.pids?node.pids+",":"")+node.id}
            var modal = $uibModal.open({
                animation: true,
                size:'',
                templateUrl: 'view/sys/community.modal.html',
                controller: 'communityCtrl'
                ,resolve: {community: function(){return community;},communityTree:function(){return $scope.communityTree}}
            });
            modal.result.then(function (data) {
                getCommunityTree();
            });

            /*$http.get("../ovu-pcos/pcos/workunit/listWorkitem.do?sceneId="+node.id).success(function(itemList){
                if(itemList.length){
                    alert("此工作分类下已存在"+itemList.length+"个工作事项,不可添加子分类！");
                }else{

                }
            })*/
        }
        //编辑分类
        $scope.addTopNode =  $scope.editNode = function(node){
            var modal = $uibModal.open({
                animation: true,
                size:'',
                templateUrl: 'view/sys/community.modal.html',
                controller: 'communityCtrl'
                ,resolve: {community: angular.extend({},node),communityTree:function(){return $scope.communityTree}}
            });
            modal.result.then(function (data) {
                getCommunityTree();
            });
        }

        //选中分类项
        $scope.selectNode= function (node) {
            var curNode = fac.getSelectedNode($scope.communityTree);
            if (curNode && curNode != node) {
                curNode.state.selected = false;
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
        }

        //删除分类项
        $scope.delNode = function(node){
            if(node.nodes && node.nodes.length){
                alert("此节点有下级节点,不能删除！")
            }else{
                confirm("确定删除分类["+node.text+"]吗?",function(){
                    $http.get("../community/del",{params:{communityId:node.id}}).success(function(resp){
                        if(resp.code ==0){
                            getCommunityTree();
                        }else{
                            alert(resp.msg);
                        }
                    });
                })
            }
        }

    });

    app.controller('communityCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,fac,community,communityTree) {
        $scope.item = community;
        $scope.flatTree = fac.treeToFlat(communityTree);
        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.post("../community/save",item).success(function(resp, status, headers, config) {
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
