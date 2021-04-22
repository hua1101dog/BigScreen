(function() {
	"use strict";
	var app = angular.module("phoneApp");
	// 控制器
	app.controller('roleListController', function($scope,$rootScope,$uibModal, $http,appData) {
		var parent = $scope.$parent;
		$scope.search={};
		$scope.items = {};
      //获取球员信息
		$scope.find = function(pageNo){
		   $.extend($scope.search,{currentPage:pageNo||1,pageSize:$scope.items.pageSize||10});
		   appData.getPageResult("../callRole/list",$scope.search,function(data){
		 	  $scope.items = data;
		   });
	   };
		   $scope.find();
		   
		 //显示添加角色
        $scope.showModal = function(role){
				   var modal = $uibModal.open({
					      animation: true,
					      size: 'lg',
					      templateUrl: 'view/system/roleAdd.html',
					      controller: 'roleAddController',
					      resolve: {role: function(){	
					    	  role = $.extend({},role);
					    	  role.menus ||(role.menus =[]);
						    	  return role;
					    	  }
					    }});

				   modal.result.then(function () {
					   $scope.find();
					   
					  }, function () {
						  $scope.find();
					      console.info('Modal dismissed at: ' + new Date());
					  });
				   
			   }
			 $scope.pageChanged = $scope.find;
			   $scope.find();
//			   $scope.showModal();
			// 删除
			   $scope.del = function(role){
					  var url = "../callRole/del/"+role.id;
					  $scope.confirm(url,'DEL_MSG',function(data){
							if (data.success==false) {
								$scope.find();
								$scope.tips('DEL_ADMIN', '#delRole'+role.id+'');
							}else {
								$scope.find();
								$rootScope.countryIdArrayPromise = appData.getDicts().then(function(data){
									$rootScope.roleList = data.roleList||[];
								})
							}
					  });
			   
			   };
	});
	   
	//添加管理员
	app.controller('roleAddController', function($scope,$http,$uibModal,$uibModalInstance,$rootScope,role,appData) {
		$scope.role = role;
		role.menus.each(function(menu){
			 if(/^\[[\s\S]*\]$/.test(menu.access)){
				try{
					menu.accessList =JSON.parse(menu.access)||[];
				}catch(e){
				}
			 }else{
				 menu.accessList = [];
			 }
	   })
		 
		$scope.curMenus = $.extend(true,[],$scope.menus);
		 
		 //将当前角色的菜单权限赋予菜单, 用于显示在页面中
		 $scope.curMenus.each(function(menu){
			 //获取当前role 在一级菜单上的权限
			 var ace = role.menus.find(function(n){
				 return menu.id == n.menuId;
			 })
			 if(ace){
				 menu.accessList = ace.accessList;
			 }else{
				 menu.accessList = [];
			 }
			 
			 menu.items.each(function(submenu){
				 ace = role.menus.find(function(n){
					 return submenu.id == n.menuId;
				 })
				 if(ace){
					 submenu.accessList = ace.accessList;
				 }else{
					 submenu.accessList = [];
				 }
			 })	
		 })
		 
		 $scope.getSubmenuLength = function(items){
			 return items.findAll(function(n){return n.power!=-1}).length;
		 }
		 
		 
		 $scope.saveRole=function(){
			//点击后 校验不通过的会变红
			   $scope.form.$setSubmitted(true);
			   if(!$scope.form.$valid){
				  return;
			   }
			 $scope.curMenus.each(function(menu){
				 var ace = role.menus.find(function(n){
					 return menu.id == n.menuId;
				 })
				  //添加role 在一级菜单上的权限
				 if(ace){
					 ace.access = JSON.stringify(menu.accessList);
				 }else{
					 role.menus.push({menuId:menu.id,access:JSON.stringify(menu.accessList)});
				 }
				
				 menu.items.each(function(submenu){
					 //添加role 在二级菜单上的权限
					 var ace = role.menus.find(function(n){
						 return submenu.id == n.menuId;
					 })
					  //添加role 在一级菜单上的权限
					 if(ace){
						 ace.access = JSON.stringify(submenu.accessList);
					 }else{
						 role.menus.push({menuId:submenu.id,access:JSON.stringify(submenu.accessList)});
					 }
				 })	
			 })
				$http.post("../callRole/saveOrUpdate",role).success(function(data, status, headers, config) {
					$rootScope.countryIdArrayPromise = appData.getDicts().then(function(data){
						$rootScope.roleList = data.roleList||[];
					})
					$uibModalInstance.dismiss('ok');
				})
		};
	
		$scope.getCheckClass = function(accessList,code){
			var checked = accessList.indexOf(code)!=-1;
			 return	{'green':checked,'glyphicon-check':checked,'red':!checked,'glyphicon-unchecked':!checked}; 
		} 
		
		/**
		 * 给角色的某菜单按钮添加或删除权限
		 */
		$scope.toggleAccess = function(accessList,code){
			if(accessList.indexOf(code)==-1){
				accessList.push(code);
			}else{
				accessList.remove(code);
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
				menu.powerList.each(function(n){menu.accessList.push(n.code)})
				menu.all = 1;
			}
		}
		
		//有相应权限时显示编辑项	
		$scope.getPower = function(menu,digi){
			if(!(menu.power&digi)){
				return {"visibility":"hidden"};
			}
		}
		
		$scope.cancel = function () {
	       $uibModalInstance.dismiss('cancel');
	    };
	    
	    //显示添加按钮
		   $scope.editAction = function(menu){
			 var modal = $uibModal.open({
					      animation: false,
					      size: 'min',
					      templateUrl: 'view/system/actionModal.html',
					      controller: 'actionModalController',
					      resolve: {menu: $.extend(true,{},menu)}
					    });
			       modal.result.then(function (ret) {
			    	   menu.powerList = ret.powerList;
				  }, function () {
				      console.info('Modal dismissed at: ' + new Date());
				  });
		   }
	});


    // 控制器
    app.controller('actionModalController', function($scope,$http,$uibModalInstance,$rootScope,appData,menu) {
        //左列表:
        var all = $.extend(true,[],$rootScope.actionList);
        $scope.leftList =  all.remove(function(n){return menu.powerList.some(function(m){return m.code == n.code}) });
        $scope.rightList =menu.powerList;
        //选中的向右移
        $scope.moveRight = function(item){
            $scope.rightList.push(item);
            $scope.leftList = $scope.leftList.remove(function(n){return n.code == item.code});
        }
        //全部的向右移
        $scope.moveAllRight = function(){
            $scope.rightList.add($scope.leftList);
            $scope.leftList = [];
        }

        //选中的向左移
        $scope.moveLeft = function(item){
            $scope.leftList.push(item);
            $scope.rightList = $scope.rightList.remove(function(n){return n.code == item.code});
        }
        //全部的向左移
        $scope.moveAllLeft = function(){
            $scope.leftList.add($scope.rightList);
            $scope.rightList = [];
        }

//		function deActive(list){
//			list.each(function(n){
//				n.active = false;
//			})
//		}

        $scope.ok = function () {
            menu.power = JSON.stringify(menu.powerList||[]);
            $http.post("../callMenu/saveOrUpdate",menu).success(function(resp){
                if(resp.success){
                    $uibModalInstance.close(menu);
                    appData.getMenus(function(menus){
                        $rootScope.menus = menus;
                    })
                }
            })
        };

        $scope.cancel = function (){
            $uibModalInstance.dismiss('cancel');
        };

    });
	
})();