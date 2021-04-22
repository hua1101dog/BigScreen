/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('interfaceCtrl', function ($scope,$rootScope, $http,$uibModal,fac,$timeout) {
        $scope.search = {};
        $scope.pageModel = {};

         $scope.find  = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("../interface/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();
        $scope.del = function(item){
            $http.get("../dataNode/existDataNode?interfaceId="+item._id).success(resp=>{
                if(resp.code ==0){
                    if(resp.data ==1){
                        alert(item.name+"接口已被使用！");
                    }else{
                        confirm("确认删除该接口吗？",function(){
                            $http.get("../interface/del?id="+item._id).success(resp=>{
                                if(resp.code === 0){
                                    $scope.find();
                                }else{
                                    alert(resp.msg);
                                }
                            })
                        });
                    }
                }
            })
         }

        $scope.edit = function(item){
            var modal = $uibModal.open({
                animation: true,
                size:'',
                templateUrl: 'view/interface/interface.modal.html',
                controller: 'interfaceEditCtrl'
                ,resolve: {item: $.extend(true,{},item)}
            });
            modal.result.then(function (data) {
                $scope.find();
            });
        }
    });


    app.controller('interfaceEditCtrl', function($scope,$http,$uibModalInstance,fac,item) {

        $http.get("../urlPrefix/all").success(resp=>{
            $scope.urlPrefixList = resp.data;
        })
        item.params = item.params||[];
        $scope.item = item;

        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.post("../interface/save",item).success(function(resp, status, headers, config) {
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