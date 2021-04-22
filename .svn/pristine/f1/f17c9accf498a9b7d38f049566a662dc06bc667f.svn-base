/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('roleCtrl', function ($scope, $http,$uibModal,fac) {
        $scope.search = {};
        $scope.pageModel = {};
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("../sys/listRole",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();
        //删除
        $scope.del = function(item){
            confirm("确认删除角色吗？",function(){
                $http.get("../sys/delRole?ids="+item.id).success(function(resp){
                    if(resp.code === 0){
                        $scope.find();
                    }else{
                        alert(resp.msg);
                    }
                })
            });
        }

        //添加与保存instance
        $scope.edit = function(item){
            var copy = angular.extend({},item);
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: 'view/sys/role.modal.html',
                controller: 'roleModalCtrl'
                ,resolve: {item: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
    });

    app.controller('roleModalCtrl', function($scope,$http,$uibModalInstance,fac,item) {

        $http.get("../sys/allMenus",{params:{roleId:item.id}}).success(function(resp){
            if(resp.code === 0){
                $scope.allMenus = resp.data;
                fac.execTreeNode($scope.allMenus,n=>{
                    n.powerList = [];
                    n.accessList = [];
                    if(n.power){
                        n.powerList = n.power.split(",");
                    }
                    if(n.access){
                        n.accessList = n.access.split(",");
                    }
                })
            }
        })

        $scope.getCheckClass = function(powerList,power){
            var checked = powerList.indexOf(power)!=-1;
            return	{'green':checked,'glyphicon-check':checked,'red':!checked,'glyphicon-unchecked':!checked};
        }

        /**
         * 给角色的某菜单按钮添加或删除权限
         */
        $scope.toggleAccess = function(accessList,power){
            if(accessList.indexOf(power)==-1){
                accessList.push(power);
            }else{
                accessList.splice(accessList.indexOf(power),1);
            }
        }

        /**
         * 全选与反选某菜单的铵钮权限
         */
        $scope.checkAll = function(menu){
            if(menu.all==1){
                menu.accessList = [];
                menu.all = 0;
            }else{
                menu.accessList = [];
                menu.powerList.forEach(n => menu.accessList.push(n));
                menu.all = 1;
            }
        }
        $scope.role = item;

        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            item.menus = [];
            fac.execTreeNode($scope.allMenus,n=>{if(n.accessList.length){item.menus.push({roleId:item.id,menuId:n.id,access:n.accessList.join()})};});
            $http.post("../sys/saveRole", item).success(function (resp, status, headers, config) {
                if (resp.code === 0) {
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })
        }
    });

})();