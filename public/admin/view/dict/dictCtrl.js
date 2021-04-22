/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('dictCtrl', function ($scope, $http,$uibModal,fac) {
        $scope.search = {};
        $scope.pageModel = {};
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("../dict/list",$scope.search,function(data){
                $scope.pageModel = data;
                data.data.forEach(n=>n.list = eval(n.jsonStr)||[]);
            });
        };
        $scope.find();

        //添加与保存instance
        $scope.edit = function(item){
            var copy = angular.extend({},item);
            var modal = $uibModal.open({
                animation: false,
                size:'',
                templateUrl: 'view/dict/dict.modal.html',
                controller: 'dictModalCtrl'
                ,resolve: {item: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

    });

    app.controller('dictModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$q,fac,item) {

        $scope.item = item;

        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            item.jsonStr = JSON.stringify(angular.copy(item.list));
            $http.post("../dict/save", item).success(function (resp, status, headers, config) {
                if (resp.code === 0) {
                    $rootScope[item.type] = item.list;
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })
        }
    });

})();