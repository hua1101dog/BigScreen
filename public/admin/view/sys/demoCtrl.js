/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('communityCtrl', function ($scope, $http,$uibModal,fac) {
        $scope.search = {};
        $scope.pageModel = {};
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("../sys/listCommunity",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();
        //删除
        $scope.del = function(item){
            confirm("确认删除社区吗？",function(){
                $http.get("../sys/delCommunity?ids="+item.id).success(function(resp){
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
                templateUrl: 'view/sys/community.modal.html',
                controller: 'communityModalCtrl'
                ,resolve: {item: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

    });

    app.controller('communityModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$q,fac,item) {

        $scope.item = item;

        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("../sys/saveCommunity", item).success(function (resp, status, headers, config) {
                if (resp.code === 0) {
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })
        }
    });

})();