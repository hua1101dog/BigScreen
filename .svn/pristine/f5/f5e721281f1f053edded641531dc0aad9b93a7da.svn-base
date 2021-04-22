/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('mapCtrl', function ($scope,$rootScope, $http,$uibModal,fac,$timeout) {
        $scope.search = {};
        $scope.pageModel = {};
      /*  $(document).on("resize","#iconScroll",function(){
            $(this).css("height",window.height-180);
        })*/
       /* $scope.find = function(pageNo){
            if($scope.curType){
                $scope.search.typeId = $scope.curType.id;
                $.extend($scope.search,{currentPage:pageNo||$scope.curType.pageModel.currentPage||1,pageSize:$scope.curType.pageModel.pageSize||20000});
                fac.getPageResult("../icon/list",$scope.search,function(data){
                    $scope.curType.pageModel = data;
                    $("#iconScroll").css("height",window.innerHeight-190);
                });
            }
        };*/

         $scope.find  = function(pageNo){
                if($scope.curSpace){
                    $scope.search.spaceCode = $scope.curSpace.code;
                }
                $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
                fac.getPageResult("../birdMap/list",$scope.search,function(data){
                    $scope.pageModel = data;
                });

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

        $scope.selectSpace = function(node,search){
            var curNode = fac.getSelectedNode($scope.spaceTree);
            if (curNode && curNode != node) {
                curNode.state.selected = false;
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            $scope.curSpace = node.state.selected?node:undefined;
            $scope.find(1);
        }

        //编辑分类
        $scope.addTopNode =  $scope.editNode = function(node){
            var modal = $uibModal.open({
                animation: true,
                size:'',
                templateUrl: 'view/space/space.modal.html',
                controller: 'spaceCtrl'
                ,resolve: {space: angular.extend({},node),spaceTree:function(){return $scope.spaceTree}}
            });
            modal.result.then(function (data) {
                getSpaceTree();
            });
        }

        //添加子分类
        $scope.addSon = function (node) {
            var space = {ptexts:(node.ptexts?node.ptexts+">":"")+node.text,pcode:node.code}
            var modal = $uibModal.open({
                animation: true,
                size:'',
                templateUrl: 'view/space/space.modal.html',
                controller: 'spaceCtrl'
                ,resolve: {space: space,spaceTree:function(){return $scope.spaceTree}}
            });
            modal.result.then(function (data) {
                getSpaceTree();
            });
        }

        //删除组织
        $scope.delNode = function(node){
            if(node.nodes && node.nodes.length>0){
                alert('存在下级节点，清勿删除！');
                return;
            }
            $http.get("../birdMap/existMap?spaceCode="+node.code).success(resp=>{
                if(resp.code ==0){
                    if(resp.data ==1){
                        alert(node.text+"空间下存在地图，请清空后再删除！");
                    }else{
                        confirm("确认删除空间"+node.text+"？",function(){
                            $http.get("../space/del?id="+node._id).success(function(resp){
                                if(resp.code === 0){
                                    getSpaceTree();
                                }else{
                                    alert(resp.msg);
                                }
                            })
                        });
                    }
                }
            })
        };

        // icons.unshift(0,0);
       //  picList.splice.apply(picList,icons);
        $scope.addFiles = function (params) {
            fac.upload({ url: "/birdMap/save" ,multiple:true,params:params,accept:".geojson" }, function (resp) {
                if (resp.code == 0 ) {
                    msg("上传成功！");
                    $scope.find(1);
                } else {
                    alert(resp.msg);
                }
            })
        }

        $scope.reUpload = function (birdMap) {
            fac.upload({ url: "/birdMap/reUpload" ,multiple:false,params:{_id:birdMap._id},accept:".geojson" }, function (resp) {
                if (resp.code == 0 ) {
                    msg("上传成功！");
                    $scope.find(1);
                } else {
                    alert(resp.msg);
                }
            })
        }



        $scope.mapDetail = function(item){
            $("#canvas").css("height",window.innerHeight-70);
            $("#canvas").html("");
            var map = new AirocovMap.Map({
                //地图容器
                container: document.getElementById("canvas"),
                themeUrl: "/res/theme/fillcolor2.json",
                logoSrc: "/pic/logo_ovu.png",
                //地图楼层列表
                mapList: [
                    {
                        name: "F1", //楼层名
                         mapUrl: "/free/mapDetail.json?id="+item._id //地图路径
                        //mapUrl: "/admin/Change_CX.geojson" //地图路径
                    }
                ]
            });
            $scope.showMap = true;
            /*var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: 'view/space/map.modal.html',
                controller: 'mapDetailCtrl'
                ,resolve: {item: function(){return item;}}
            });
            modal.result.then(function () {

            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });*/
        }


        $scope.delAll = function(){
            var ids = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.id);
                return ret
            }, []);
            confirm("确认删除选中的 " + ids.length + " 个文件吗?",function(){
                $http.post("../attachment/del", {
                    "ids": ids.join()
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        ids.forEach(function(id){
                            var toDel = $scope.pageModel.list.find(function(m){return m.id == id});
                            if(toDel){
                                $scope.pageModel.list.splice($scope.pageModel.list.indexOf(toDel),1);
                                $scope.pageModel.totalRecord --;
                            }
                        })
                    } else {
                        alert(resp.msg);
                    }
                })
            })
        }
        $scope.del = function(item){
            confirm("确认删除该地图吗？",function(){
                $http.get("../birdMap/del?id="+item._id).success(function(resp){
                    if(resp.code === 0){
                        $scope.find();
                    }else{
                        alert(resp.msg);
                    }
                })
            });
        }

        $scope.downloadZip = function(){
            var ids = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.id);
                return ret
            }, []);
            confirm("确认打包下载选中的 " + ids.length + " 个附件吗?",function(){
                try{
                    var elemIF = document.createElement("iframe");
                    elemIF.src = "/attachment/downloadZip?ids="+ids.join();
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                }catch(e){

                }
            })
        }
        $scope.editAll = function(){
            var items = $scope.iconTypes[0].pageModel.list.filter(function (n) {n.checked&&(n.newName = n.name);return n.checked;});
            items.push.apply(items,$scope.iconTypes[1].pageModel.list.filter(function (n) {n.checked&&(n.newName = n.name);return n.checked;}));
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: 'view/icon/icon.modal.html',
                controller: 'iconEditCtrl'
                ,resolve: {items: function(){return items;}}
            });
            modal.result.then(function () {

            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }



        $scope.editType = function(type){
            type.textCopy = type.text;
            type.edit = true;
            var input = $(event.target).parents("li").children("input");
            $timeout(function(){
                input.select();
            })
        }
        $scope.delType = function(type){
            $http.get("../attachment/existFile?folderId="+type.id).success(function(resp){
                if(resp.code ==0){
                    if(resp.data ==1){
                        alert(type.text+"文件夹下存在文件，请清空后再删除！");
                    }else{
                        confirm("确认删除分类"+type.text+"？",function(){
                            if($scope.curType == type){
                                delete $scope.curType;
                            }
                            $http.get("../attachment/delFolder?folderId="+type.id).success(function(resp){
                                if(resp.code === 0){
                                    $scope.typeList.splice($scope.typeList.indexOf(type),1);
                                }else{
                                    alert(resp.msg);
                                }
                            })
                        });
                    }
                }
            })
        }
        $scope.saveType = function(form,type){
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var copy = {};
            angular.extend(copy,type);
            copy.text = type.textCopy;
            $http.post("../attachment/saveFolder",copy).success(function(resp){
                if(resp.code === 0){
                    type.edit = false;
                    type.id = resp.data.id;
                    type.text = resp.data.text;
                }else{
                    alert(resp.msg);
                }
            })
        }
        $scope.cancelEdit = function(type){
            if(type.id){
                type.edit = false;
            }else{
                $scope.typeList.splice($scope.typeList.indexOf(type),1);
            }
        }
    });

    app.controller('spaceCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,fac,space,spaceTree) {
        $scope.item = space;
        space.policyList = space.policyList||[];

        $scope.flatTree = fac.treeToFlat(spaceTree);
        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.post("../space/save",item).success(function(resp, status, headers, config) {
                if(resp.code ==0){
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(resp.error);
                }
            })
        }
    });

    app.controller('mapDetailCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,fac,item) {
        $scope.item = item;
        $scope.save = function(){

        }
       /* $uibModalInstance.opened.then(function(){
            var map = new AirocovMap.Map({
                //地图容器
                container: document.getElementById("canvas"),
                //地图楼层列表
                mapList: [
                    {
                        name: "F1", //楼层名
                        //  mapUrl: "/birdMap/mapDetail?id="+item._id //地图路径
                        mapUrl: "/admin/Change_CX.geojson" //地图路径
                    }
                ]
            });
        })*/

    });


})();