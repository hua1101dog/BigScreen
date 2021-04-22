/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('visitorCtrl', function ($scope,$rootScope, $http,$uibModal,fac,$timeout) {
        $scope.search = {};
        $scope.pageModel = {};

        $scope.find  = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("../visitor/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();
        $scope.del = function(item){
            //todo
            confirm("确认删除该接口吗？",function(){
                $http.get("../visitor/del?id="+item._id).success(resp=>{
                  if(resp.code === 0){
                   $scope.find();
                   msg(resp.msg)
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
                templateUrl: 'view/intelliDept/visitor.modal.html',
                controller: 'visitorEditCtrl'
                ,resolve: {item: $.extend(true,{},item)}
            });
            modal.result.then(function (data) {
                $scope.find();
            });
        }
    });


    app.controller('visitorEditCtrl', function($scope,$http,$uibModalInstance,fac,item) {
        $scope.item = item;

        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.post("../visitor/save",item).success(function(resp, status, headers, config) {
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