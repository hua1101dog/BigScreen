(function() {
    "use strict";
    var app = angular.module("showApp");

    app.component("menu", {
            restrict: "E",
            bindings: {
                nodeList: '<',
                showScheme:"&"
            },
            templateUrl: 'v1/menu.html',
            controller: function($scope) {
                var $ctrl = this;

                $ctrl.$onInit = function () {
                }
                $ctrl.$onChanges = function (changes) {
                    if(changes.nodeList.currentValue){
                        $ctrl.selectCate(changes.nodeList.currentValue[0]);
                    }
                };

                $ctrl.selectCate = function(cate){
                    $ctrl.curCate = cate;
                    //概况
                    if(cate.birdMap){
                        $ctrl.showScheme({scheme:cate});
                    }else if($ctrl.curCate.curSpace){
                        $ctrl.selectSpace($ctrl.curCate.curSpace);
                    }
                }
                $ctrl.selectSpace = function(space){
                    $ctrl.curCate.curSpace = space;
                    if(space.nodes && space.nodes[0].spaceCode){
                        //当前空间下还有楼层,显示室内地图!
                        if(space.birdMap){
                            $ctrl.showScheme({scheme:space});
                        }
                        if(space.curFloor){
                            $ctrl.selectFloor(space.curFloor);
                        }
                    }else{
                        $ctrl.curSite = space;
                        selectSite($ctrl.curSite);
                    }
                }
                function selectSite(site){
                    site.nodes.forEach(n=>n.iconfont = n.iconfont||"icon-top-service")
                    if(site.curSchemeType){
                        if(site.curSchemeType.curTag){
                            $ctrl.selectTag(site.curSchemeType.curTag);
                        }else{
                            $ctrl.selectTag(site.curSchemeType.nodes[0]);
                        }
                    }else{
                        //选择某一空间时,先显示地图
                        let fakeScheme = {birdMap:site.nodes[0].nodes[0].nodes[0].birdMap};
                        $ctrl.showScheme({scheme:fakeScheme});
                    }
                }

                $ctrl.selectFloor = function(floor){
                    $ctrl.curCate.curSpace.curFloor = floor;
                    $ctrl.curSite = floor;
                    selectSite($ctrl.curSite);
                }

                $ctrl.selectSchemeType = function(schemeType){

                    if($ctrl.curSite.curSchemeType == schemeType){
                        //反选当前的方案，仅显示地图
                        delete $ctrl.curSite.curSchemeType;
                        $ctrl.showScheme({scheme:{birdMap:schemeType.nodes[0].nodes[0].birdMap}});
                    }else{
                        $ctrl.curSite.curSchemeType = schemeType;
                        if(schemeType.curTag){
                            $ctrl.selectTag(schemeType.curTag);
                        }else{
                            $ctrl.selectTag(schemeType.nodes[0]);
                        }
                    }
                }

                $ctrl.selectTag = function(tag){
                    $ctrl.curSite.curSchemeType.curTag = tag
                    $ctrl.showScheme({scheme:tag.nodes[0]});
                }
            }
    });

    // 控制器
    app.controller('showController', function($scope, $rootScope, $location, $q, $http,fac) {
        $scope.pconfig = {};
        $scope.showScheme = function(scheme){
            console.log(scheme);
            $scope.pconfig.scheme = scheme;
        }

        $rootScope.videoPrefix = "http://47.96.87.173/view/video.html?&cameraCode="
        var menuData;
        function getSchemeMenu() {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            let url = "/free/getMenus?spaceCode="+app.spaceCode;
            $http.get(url).success(function(resp){
                if(resp.code==0){
                    menuData =  $scope.schemeMenu = resp.data;
                    deferred.resolve(resp.data);
                }
            })
            return deferred.promise; // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        }

        //获取所有枚举
        app.menuPromise = getSchemeMenu();
        $rootScope.sensorParamDict ={
            codes:['temperatureValue','humidity','energy','IA','IB','IC','UA','UB','UC','pressureValue',
                'waterLevel','doorState','alertState','smoke','directionInt','elevatorState','floorInt','digitalWaterLevel','elecLevel','gasState',
                'enterType'],
            names:['温度','湿度','能耗','电流A','电流B','电流C','电压A','电压B','电压C','压力',
            '集水井液位','门磁状态','报警状态','烟感','方向','电梯状态','楼层','生活水箱液位','电流阈值','报警状态',
                '进出类型']
        }

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

           /*     var urls = node.url.split('/');
                if (urls.length === 2) {
                    $state.go('admin', { folder: urls[0], page: urls[1] });
                } else if (urls.length === 3) {
                    $state.go('three', { folder: urls[0], catalogue: urls[1], page: urls[2] });
                }*/

                $scope.curMenu = node;
                document.body.scrollTop = document.documentElement.scrollTop = 0;

            }
        }

        //app.ws = new WebSocket("ws://bigscreen.ovuems.com");
        app.ws = new ReconnectingWebSocket("ws://bigscreen.ovuems.com", null, {debug: true, reconnectInterval: 5000})
        //app.ws = new WebSocket("ws://localhost:3000");
        app.ws.onopen = function() {
            console.log("连接状态", app.ws);
            let message = {spaceCode: app.spaceCode ,type:"login"};
            app.ws.send(JSON.stringify(message));
            console.log("open");
        };

        //app.socket = io('http://bigscreen.ovuems.com');
     /*   app.socket = io('http://localhost:3000');
        app.socket.on('connect', function (data) {
            console.log(data);
            app.socket.emit('daPingConnect', {spaceCode: app.spaceCode });
        });*/
       /* */

        $(document).bind("keydown keypress", function (event) {
            if(event.which === 13) {
                console.log(13);
                event.preventDefault();
            }else if(event.which === 27){
                console.log(27);
            }
        });
    });
})();
