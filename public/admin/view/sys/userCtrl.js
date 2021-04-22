/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('userCtrl', function ($scope, $http,$uibModal,fac) {
        $scope.search = {};
        $scope.pageModel = {};
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("../sys/listUser",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();
        //删除
        $scope.del = function(item){
            confirm("确认删除用户吗？",function(){
                $http.get("../sys/delUser?ids="+item.id).success(function(resp){
                    if(resp.code === 0){
                        $scope.find();
                    }else{
                        alert(resp.msg);
                    }
                })
            });
        }

        //添加与保存instance
        $scope.editAccount = function(item){
            var copy = angular.extend({},item);
            var modal = $uibModal.open({
                animation: false,
                size:'',
                templateUrl: 'view/sys/user.modal.html',
                controller: 'userModalCtrl'
                ,resolve: {item: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };


        //添加与保存instance
        $scope.edit = function(item){
            var copy = angular.extend({},item);
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: 'view/sys/person.modal.html',
                controller: 'personModalCtrl'
                ,resolve: {item: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

    });

    app.controller('userModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$q,fac,item) {

        $scope.item = item;

        $http.get("../sys/allRoles").success(function(resp){
            if(resp.code === 0 ){
                $scope.getRoles =  resp.data;
            }
        })

        item.id&&$http.get("../sys/getUser?id="+item.id).success(function(resp){
            if(resp.code === 0 && resp.data){
                angular.extend(item,resp.data);
            }
        })

        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("../sys/saveUser", item).success(function (resp, status, headers, config) {
                if (resp.code === 0) {
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })
        }
    });


    app.controller('personModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$q,fac,item) {
        $scope.item = item;
        item.id&&$http.get("../person/getPerson?id="+item.id).success(function(resp){
            if(resp.code === 0){
                angular.extend(item,resp.data);
            }
        })

        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("../person/save", item).success(function (resp, status, headers, config) {
                if (resp.code === 0) {
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })
        }
    });

})();