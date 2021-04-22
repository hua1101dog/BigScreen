(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.directive("treeMenu", function() {
        return {
            restrict: "E",
            scope: {
                nodeList: '=',
                pnode: "=",
                config:"<?"
            },
            templateUrl: 'common/treeMenu.html',
            controller: function($scope) {
                $scope.selectMenu = $scope.$parent.selectMenu;
            }
        };
    });

    app.config(['$uibModalProvider', function($uibModalProvider) {
        $uibModalProvider.options = { backdrop: 'static', keyboard: true };
    }]);

    // 控制器
    app.controller('mainController', function($scope, $rootScope, $location, $q, $http, $uibModal,$ocLazyLoad,fac) {
        //$scope.menus = appData.menus;
        var menuData;
        $rootScope.scene = {};
        $rootScope.videoPrefix = "http://beta.ovuems.com/view/video.html?&cameraCode="

        $scope.menuConfig = $scope.menuConfig||{collapse:localStorage.getItem("menuCollapse")=="true"||false};
        $scope.toggleCollapse = function(){
            $scope.menuConfig.collapse = !$scope.menuConfig.collapse;
            localStorage.setItem("menuCollapse",$scope.menuConfig.collapse);
        }

        $http.get("/free/dateDict").success(resp=>{
            if(resp.code == 0){
                $rootScope.dateDict = resp.data;
            }
        })

        function getLoginUser() {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            $http.get("../free/getUserInfo").success(function(resp) {
                 if(resp.code == 0){
                     app.user = $rootScope.user = resp.data.user;
                     $rootScope.menus = resp.data.menus;
                     angular.extend($rootScope, resp.data.dicts);
                     //resp.data.allDict.forEach(dict=>$rootScope[dict.type]=eval(dict.jsonStr));
                     menuData = fac.treeToFlat($rootScope.menus);
                     deferred.resolve(resp.data);
                 }  else {
                     location.href = "login.html";
                 }
            })
            return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        }
        $rootScope.sensorParamDict =[{code:'temperatureValue',text:'温度',unit:"℃"},{code:'humidity',text:'湿度',unit:"%rh"},{code:'energy',text:'能耗',unit:"KWH"},
            {code:'IA',text:'电流A',unit:"mA"},{code:'IB',text:'电流B',unit:"mA"},{code:'IC',text:'电流C',unit:"mA"},
            {code:'UA',text:'电压A',unit:"V"},{code:'UB',text:'电压B',unit:"V"},{code:'UC',text:'电压C',unit:"V"},{code:'pressureValue',text:'压力',unit:"KPa"},
            {code:'waterLevel',text:'集水井液位'},{code:'doorState',text:'门磁状态'},{code:'alertState',text:'报警状态'},{code:'smoke',text:'烟感'},
            {code:'directionInt',text:'方向'},{code:'elevatorState',text:'电梯状态'},{code:'floorInt',text:'楼层',unit:"层"},
            {code:'digitalWaterLevel',text:'生活水箱液位',unit:"m"},{code:'elecLevel',text:'电流阈值'},{code:'gasState',text:'报警状态'},
            {code:'enterType',text:'进出类型'}]
        //退出
        $scope.logout = function() {
            $http.get("../free/logout").success(function(resp) {
                location.href = "login.html";
            })
        };

        //获取所有枚举
        app.loginPromise = getLoginUser();
        function getSpaceTree(){
            $http.get("../space/spaceTree").success(function (resp) {
                if(resp.code == 0){
                    var tree = resp.data || [];
                    $rootScope.spaceTree = tree;
                    $rootScope.flatSpaceTree = fac.treeToFlat(tree);
                }else{
                    alert(resp.msg);
                }
            })
        }
        function openLastUrl(){
            let hash = location.hash ;
            if(hash && hash.indexOf("#/")==0){
                let url = hash.substr(2);
                let menu = menuData.find(n=>n.url == url)
                if(menu){
                    openPage(menu);
                }
            }
        }

        app.loginPromise.then(function(){
            getSpaceTree();
            openLastUrl();
            /*if("/welcome" == $location.$$url){
                $location.url("/icon/icon");
            }*/
        })

      //  app.modulePromiss = $q.all([app.loginPromise]);
        //  app.modulePromiss =
        //app.modulePromiss = $q.all([deferModule, deferParkTree.promise]);
        $rootScope.$on('$stateChangeSuccess', function (evt, toState, toParams, fromState, fromParams) {
            var newUrl = toState.url;
            function toMenu (){
                var item;
                //如果是三级菜单
                if (toParams.catalogue) {
                    item = menuData.find(function (n) {
                        return n.url == toParams.folder + "/" + toParams.catalogue + "/" + toParams.page
                    });
                } else {
                    item = menuData.find(function (n) {
                        return n.url == toParams.folder + "/" + toParams.page
                    });
                }
                if (item) {
                    $scope.selectMenu(item);
                    if (!$rootScope.hasPower('编辑')) {
                        $rootScope.config = {edit: true};
                    } else {
                        $rootScope.config = {edit: true};
                    }
                }
            }
            if (toParams.folder && toParams.page) {
                // zg 避免权限验证 begin
                $rootScope.config = {edit: true};
                // end
                app.loginPromise.then(function(user){
                    toMenu();
                })
            }
            $rootScope.$broadcast('destory');  //销毁video实例
        })

        $scope.selectMenu = function (node) {

            var otherExpandMenu = menuData.find(function (n) {
                return n.expanded == true && n != node && !fac.isAncestorNode(n, node)
            })
            otherExpandMenu && (otherExpandMenu.expanded = false);

            if (node.nodes && node.nodes.length) {
                node.expanded = !node.expanded;
            } else {
                //展开父节点
                menuData.forEach(function (n) {
                    if (fac.isAncestorNode(n, node)) {
                        n.expanded = true;
                    }
                })
                //叶子节点
                if ($scope.curMenu && $scope.curMenu != node) {
                    $scope.curMenu.selected = false;
                }
                node.selected = true;
                //$location.url(node.url);
                app.powers = node.powers;
                //$state.go(node.url);
                openPage(node);
                $scope.curMenu = node;
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
        }


        $rootScope.pages = [];
        function openPage(node){
            node.selected = true;
            $scope.curMenu = node;
            var pathinfo = node.url.split('?');
            var path =pathinfo[0];
            $ocLazyLoad.load("/admin/view/" + path + "Ctrl.js").then(() => {
                let pageUrl = "/admin/view/" + path + ".html";
                let page = $rootScope.pages.find(n => n.url == pageUrl);
                if (!page) {
                    $rootScope.pages.push({text: node.text,oriUrl:node.url, url: pageUrl})
                }else{
                    page.hide = false;
                }
                setTimeout(() => {
                    $rootScope.pages.active = pageUrl;
                    $scope.$applyAsync();
                })
            })
        }

        $scope.selectPage = function(page){
            location.hash = page.oriUrl;
        }

        $scope.closePage = function(page,$event){
            let openedPages = $rootScope.pages.filter(n=>!n.hide);
            let index = openedPages.indexOf(page);
            if($rootScope.pages.active == page.url){
                let iframes = $(".tab-pane.active iframe");
                if(iframes.length){
                    for(var i=0;i<iframes.length;i++){
                        if(iframes[i].contentWindow.closePlayer){
                            iframes[i].contentWindow.closePlayer();
                        }
                    }
                }
                if(openedPages.length>1){
                    let toBeActivePage = index==0?openedPages[1]:openedPages[index-1];
                    $rootScope.pages.active = toBeActivePage.url;
                    toBeActivePage.hide = false;
                }else{
                    $rootScope.pages.active = null;
                }
            }
            page.hide = true;
            $event.preventDefault();

        }


        //展示个人信息
        $scope.showinfo = function (user) {
            var modal = $uibModal.open({
                component: 'userInfoModelComponent',
                resolve: {
                    param: user
                }
            });
            modal.result.then(function (node) {
                user.nickname=node.nickname;
                user.userIcon=node.userIcon;
            }, function () {
            });
        }
        //修改密码
        $scope.changePwd = function () {
            var modal = $uibModal.open({
                component: 'changePasswordModelComponent'
            });
            modal.result.then(function (node) {
            }, function () {
            });
        }

        $(document).bind("keydown keypress", function (event) {
            if(event.which === 13) {

                if($("#content").length <= 0 && $("textarea:focus,:button:focus,.btn:focus").length <= 0) {
                    var buttons = $(".btn:contains('查询')");
                    for(var i=0;i<buttons.length;i++){
                        var button = buttons[i];
                        if($(button).closest('*:hidden').length){
                            continue;
                        }
                        $(button).trigger("click");
                        break;
                    }
                    event.preventDefault();
                }
            }else if(event.which === 27){
                $("#closePopPhoto").trigger("click");
                layer.closeAll('loading');
            }
        });
    });
})();
