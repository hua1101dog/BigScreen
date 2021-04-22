/**
 * 
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('projectCtrl', function ($scope,$rootScope, $http,$uibModal,fac,$timeout) {
        $scope.search = {};
        $scope.pageModel = {};

         $scope.find  = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("../project/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();
        $scope.del = function(item){
            
               confirm("确认删除该条数据吗？",function(){
                   $http.get("../project/del?id="+item._id).success(resp=>{
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
                templateUrl: 'view/intelliDept/project.modal.html',
                controller: 'projectEditCtrl'
                ,resolve: {item: $.extend(true,{},item)}
            });
            modal.result.then(function (data) {
                $scope.find();
            });
        }
    });


    app.controller('projectEditCtrl', function($scope,$http,$uibModalInstance,fac,item) {
        $scope.item = item;

        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.post("../project/save",item).success(function(resp, status, headers, config) {
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