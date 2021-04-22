/**
 * 
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('bigScreenPathCtrl', function ($scope,$rootScope, $http,$uibModal,fac,$timeout) {
        $scope.search = {};
        $scope.pageModel = {};

         $scope.find  = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("../bigScreenPath/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();
        $scope.del = function(item){
            
               confirm("确认删除该接口吗？",function(){
                   $http.get("../bigScreenPath/del?id="+item._id).success(resp=>{
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
                templateUrl: 'view/bigScreenPath/bigScreenPath.modal.html',
                controller: 'bigScreenPathEditCtrl'
                ,resolve: {item: $.extend(true,{},item)}
            });
            modal.result.then(function (data) {
                $scope.find();
            });
        }
    });


    app.controller('bigScreenPathEditCtrl', function($scope,$http,$uibModalInstance,fac,item) {
        $scope.item = item;

        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.post("../bigScreenPath/save",item).success(function(resp, status, headers, config) {
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