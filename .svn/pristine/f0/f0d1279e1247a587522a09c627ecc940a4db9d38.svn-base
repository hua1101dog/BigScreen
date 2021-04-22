/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('iconCtrl', function ($scope,$rootScope, $http,$uibModal,fac,$timeout) {
        $scope.search = {};
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

        $scope.find = function(){
                let curFolder = $scope.curFolder;
                $http.get("../icon/listIcons?folder="+curFolder.text).success(function(resp){
                    if(resp.code === 0){
                        curFolder.list = resp.data;
                        $(".iconScroll").css("height",window.innerHeight-190);
                    }
                })
        };

        $http.get("../icon/listFolder").success(function(resp){
            if(resp.code === 0){
                $scope.folders = resp.data;
                $scope.selectFolder($scope.folders[0]);
                $("#folderScroll").css("height",window.innerHeight-90);
            }else{
                alert(resp.msg);
            }
        })
        // icons.unshift(0,0);
       //  picList.splice.apply(picList,icons);
        $scope.addPhotos = function (params) {
            fac.upload({ url: "/icon/upload" ,multiple:true,params:params,accept:"image/*" }, function (resp) {
                if (resp.code == 0 ) {
                    $scope.find();
                }else{
                    alert(resp.msg);
                }
            })
        }
        $scope.delAll = function(){

            let param = {folder:$scope.curFolder.text,files:$scope.curFolder.list.reduce((ret,n)=>{n.checked && ret.push(n.name);return ret;},[])}
            confirm("确认删除选中的 " + param.files.length + " 个图标吗?",function(){
                $http.post("../icon/del", param).success(function (resp) {
                    if (resp.code == 0) {
                        param.files.forEach(name=>
                            {
                                let tar = $scope.curFolder.list.find(n=>n.name==name);
                                $scope.curFolder.list.splice($scope.curFolder.list.indexOf(tar),1);
                            }
                        )
                    } else {
                        alert(resp.msg);
                    }
                })
            })
        }

        $scope.downloadZip = function(){
            let param = {folder:$scope.curFolder.text,files:$scope.curFolder.list.reduce((ret,n)=>{n.checked && ret.push(n.name);return ret;},[])}
            confirm("确认打包下载选中的 " + param.files.length + " 个图标吗?",function(){
                try{
                    var elemIF = document.createElement("iframe");
                    elemIF.src = "/icon/download?str="+encodeURI(JSON.stringify(param));
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                }catch(e){

                }

            })
        }

        $scope.selectFolder = function(folder){
            if($scope.curFolder==folder){
                return;
            }
            $scope.curFolder = folder;
            $scope.find();
        }

        $scope.editFolder = function(folder){
            folder.textCopy = folder.text;
            folder.edit = true;
            let li = $(event.target).parents("li");
            $timeout(()=>{
                var input = li.find("input");
                input.select();})
        }
        $scope.delFolder = function(folder){
            $http.get("../icon/existImage?folder="+folder.text).success(function(resp){
                if(resp.code ==0){
                    if(resp.data ==1){
                        alert(folder.text+"文件夹下存在图标，请清空后再删除！");
                    }else{
                        confirm("确认删除图标文件夹"+folder.text+"？",function(){
                            if($scope.curFolder == folder){
                                delete $scope.curFolder;
                            }
                            $http.get("../icon/delFolder?folder="+folder.text).success(function(resp){
                                if(resp.code === 0){
                                    $scope.folders.splice($scope.folders.indexOf(folder),1);
                                }else{
                                    alert(resp.msg);
                                }
                            })
                        });
                    }
                }
            })
        }
        $scope.saveFolder = function(form,folder){
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if(!folder.text){
                $http.get("../icon/mkDir?folder="+folder.textCopy).success(function(resp){
                    if(resp.code === 0){
                        folder.edit = false;
                        folder.text = resp.data;
                    }else{
                        alert(resp.msg);
                    }
                })
            }else if(folder.text && folder.text!=folder.textCopy){
                $http.post("../icon/renameDir",{oriFolder:folder.text,folder:folder.textCopy}).success(function(resp){
                    if(resp.code === 0){
                        folder.edit = false;
                        folder.text = resp.data;
                    }else{
                        alert(resp.msg);
                    }
                })
            }else{
                folder.edit = false;
            }
        }
        $scope.cancelEdit = function(folder){
            if(folder.text){
                folder.edit = false;
            }else{
                $scope.folders.splice($scope.folders.indexOf(folder),1);
            }
        }

    });

})();