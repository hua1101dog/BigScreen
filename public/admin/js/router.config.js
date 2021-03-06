(function() {
	"use strict";

    // 路由
	app.config(function($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {
		$stateProvider
		.state('welcome',{
			url: "/", // root route
			templateUrl:"view/welcome.html"
		})
		.state('a', {
            url: '/:folder/:page?:id',
			views:{
				a:{templateUrl : function($stateParams) {
                        return "view/"+$stateParams.folder+"/"+$stateParams.page+".html";
                    },
                    //cache: false,
                    resolve:{
                        loadMyCtrl:function($ocLazyLoad,$stateParams){
                            return $ocLazyLoad.load("view/"+$stateParams.folder+"/"+$stateParams.page+"Ctrl.js");
                        }
                    }
                    }
			}
				/*url: '/:folder/:page?:id',
				templateUrl : function($stateParams) {
                    return "view/"+$stateParams.folder+"/"+$stateParams.page+".html";
				},
				//cache: false,
				resolve:{
					loadMyCtrl:function($ocLazyLoad,$stateParams){
						return $ocLazyLoad.load("view/"+$stateParams.folder+"/"+$stateParams.page+"Ctrl.js");
					}
				}*/
		})
		.state('a.b', {
			url: '/:folder/:page?:id',
			views:{
				b:{templateUrl : function($stateParams) {
						return "view/"+$stateParams.folder+"/"+$stateParams.page+".html";
					},
					//cache: false,
					resolve:{
						loadMyCtrl:function($ocLazyLoad,$stateParams){
							return $ocLazyLoad.load("view/"+$stateParams.folder+"/"+$stateParams.page+"Ctrl.js");
						}
					}}
			}
		})
		.state('three', {
			url: '/:folder/:catalogue/:page:params',
			templateUrl : function($stateParams) {
				return "view/"+$stateParams.folder+"/"+$stateParams.catalogue+"/"+$stateParams.page+".html";
			},
			//cache: false,
			resolve:{
				loadMyCtrl:function($ocLazyLoad,$stateParams){
                        return $ocLazyLoad.load("view/"+$stateParams.folder+"/"+$stateParams.catalogue+"/"+$stateParams.page+"Ctrl.js");
				}
			}
		})
		$urlRouterProvider.otherwise("welcome");

	});
})();

/**
 * treeView 在刷新后,保持之前的展开, 选中状态
 * @param treeSelector   treeView 的 jquery 选择器,比如 "#treeviewDiv"
 * @param data  异步获取的 treeView数据
 * @param keys  data中数据的主键名称数组,以叶子->父节点顺序排序,比如["postId","postTypeId"]
 */
function expandTree(treeSelector,data,keys){
	function _addDefaultState(nodes){
		nodes.forEach(function(n){
			n.state = {expanded : false	};
			if(n.nodes && n.nodes.length>0){
				_addDefaultState(n.nodes);
			}
		})
	}
	_addDefaultState(data);

	var treeView = $(treeSelector).data('treeview');
	if(!treeView||!Array.isArray(keys)){
		return;
	}
	var oriList = treeView.getUnchecked();
	function _addState(node){
		for(var i=0;i<keys.length;i++){
			if(node.hasOwnProperty(keys[i])){
				var key = keys[i];
				var oldNode = oriList.find(function(n){return n[key] == node[key]});
				oldNode && (node.state = oldNode.state);
				break;
			}
		}
		if(node.nodes && node.nodes.length>0){
			node.nodes.forEach(function(n){
				_addState(n);
			})
		}
	}
	data.forEach(function(n){
		_addState(n);
	});
}