(function () {
    //"use strict";
    window.confirm = function (message, fn, noEncodeHtml) {
        if (!noEncodeHtml) {
            // 先转义HTML标签
            var htmlUtil = new HTMLUtil();
            message = htmlUtil.encodeHtml(message);
        }
        layer.confirm(message, { btn: ['确定', '取消'], title: false }, function (index) {
            fn && fn();
            layer.close(index);
        }, function () {
        });
    };
    window.msg = function (tip, noEncodeHtml) {
        tip = tip || "操作成功！";
        if (!noEncodeHtml) {
            // 先转义HTML标签
            var htmlUtil = new HTMLUtil();
            tip = htmlUtil.encodeHtml(tip);
        }
        layer.msg(tip, { time: 2000, icon: 1 });
    };
    window.alert = function (tip, noEncodeHtml) {
        if (tip && !noEncodeHtml) {
            // 先转义HTML标签
            var htmlUtil = new HTMLUtil();
            tip = htmlUtil.encodeHtml(tip);
        }
        layer.msg(tip || '操作失败！', { time: 2000, icon: 5 });
    };

    // 转义HTML 标签 的一个工具
    var HTMLUtil = function () {

        this.REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;

        this.REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;

        this.REGX_TRIM = /(^\s*)|(\s*$)/g;

        this.HTML_DECODE = {
            "&lt;": "<",
            "&gt;": ">",
            "&amp;": "&",
            "&nbsp;": " ",
            "&quot;": "\"",
            "&copy;": "",

            // Add more
        };

        this.encodeHtml = function (s) {
            s = (s != undefined) ? s : this.toString();
            return (typeof s != "string") ? s :
                s.replace(this.REGX_HTML_ENCODE,
                    function ($0) {
                        var c = $0.charCodeAt(0),
                            r = ["&#"];
                        c = (c == 0x20) ? 0xA0 : c;
                        r.push(c);
                        r.push(";");
                        return r.join("");
                    });
        };

        this.decodeHtml = function (s) {
            var HTML_DECODE = this.HTML_DECODE;

            s = (s != undefined) ? s : this.toString();
            return (typeof s != "string") ? s :
                s.replace(this.REGX_HTML_DECODE,
                    function ($0, $1) {
                        var c = HTML_DECODE[$0];
                        if (c == undefined) {
                            // Maybe is Entity Number
                            if (!isNaN($1)) {
                                c = String.fromCharCode(($1 == 160) ? 32 : $1);
                            } else {
                                c = $0;
                            }
                        }
                        return c;
                    });
        };

        this.trim = function (s) {
            s = (s != undefined) ? s : this.toString();
            return (typeof s != "string") ? s :
                s.replace(this.REGX_TRIM, "");
        };

        this.hashCode = function () {
            var hash = this.__hash__,
                _char;
            if (hash == undefined || hash == 0) {
                hash = 0;
                for (var i = 0, len = this.length; i < len; i++) {
                    _char = this.charCodeAt(i);
                    hash = 31 * hash + _char;
                    hash = hash & hash; // Convert to 32bit integer
                }
                hash = hash & 0x7fffffff;
            }
            this.__hash__ = hash;

            return this.__hash__;
        };

    };

    function treeToFlat(treeData) {
        var list = [];

        function pushNode(nodes) {
            nodes && nodes.forEach(function (n) {
                list.push(n);
                if (n.nodes && n.nodes.length) {
                    pushNode(n.nodes);
                }
            })
        }

        pushNode(treeData);
        return list;
    }

    var app = angular.module("angularApp");
    //用于状态由key 转为对应名称: 如1 指 草稿.
    app.filter("keyToValue", function () {
        return function (input, dictList, key, text) {
            if (!input && input != '0') return "";
            if (!dictList) return "";
            if(angular.isString(input)&&input.indexOf(",")>-1){
               var list = dictList.reduce(function(ret,n){input.indexOf(n[key])>-1 && ret.push(n[text]);return ret },[]);
               return list && list.join("，");
            }
            if (angular.isArray(dictList[0])) {
                var pair = dictList && dictList.find(function (n) {
                    return n[0] == input
                });
                if (pair) {
                    return pair[1];
                } else {
                    dictList[0][1];
                }
            } else {
                key = key || "id";
                text = text || "text";
                var obj = dictList.find(function (n) {
                    return n[key] == input
                });
                if(text=='ptexts'){
                    return obj && (obj.ptexts+" > "+obj.text);
                }else{
                    return obj && obj[text];
                }

            }
        }
    });

    app.filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);

    app.filter("notIn", function () {
        return function (list, options,curItem) {
            if(!list){
                return;
            }
            if(!options){
                return list;
            }
            return list.filter(function (n){
                return curItem.id == n.id ||!options.find(function(m){return m.id == n.id})
            })
        }
    });
    //多选框由key转为对应名称 如 1,2 => 名称1,名称2
    app.filter("checkboxKeyToValue", function () {
      return function (input, checkList) {
        if (!input) return "";
        if (!checkList) return "";
        var inputArr = input.split(",");
        var returnArr = [];
        inputArr.forEach(function (i) {
          checkList.forEach(function (e) {
            if(parseInt(i)===e.id){
              returnArr.push(e.text);
            }
          });
        });
        return returnArr.join();
      }
    });
    app.filter("timePart", function () {
        return function (input) {
            if (!input || input == "null" || input.length < 11) return "";
            return input.substr(11);
        }
    });
    app.filter("filterEllips", function () {
      return function (text,isEdit) {
        var len=isEdit?12:16;
        if(text.length<=len){
          return text;
        }
        return text.substring(0,len-3)+"...";
      }
    });
    app.directive("treeView", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: '=',
                host: '<?',
                config:'<?',
                selectNode:'<?',
                getDataClass:'<?'
            },
            templateUrl: 'common/tree.html',
            controller: function ($scope,fac) {
                //勾选
                function defaultCheck(node){
                    node.state = node.state||{};
                    node.state.checked = !node.state.checked;
                    function checkSons(node,status){
                        node.state = node.state||{};
                        node.state.checked = status;
                        if(node.nodes && node.nodes.length){
                            node.nodes.forEach(function(n){checkSons(n,status);})
                        }
                    }
                    function uncheckFather(node){
                        var father = $scope.flatTree.find(function(n){return n.id == node.pid});
                        if(father){
                            father.state = father.state||{};
                            father.state.checked = false;
                            uncheckFather(father);
                        }
                    }
                    if(node.state.checked){
                        checkSons(node,true);
                    }else{
                        checkSons(node,false);
                        uncheckFather(node);
                    }
                };
                if(!$scope.config||!$scope.config.hasOwnProperty("edit")){
                    $scope.config = { edit: true, sort: false };
                }
                $scope.flatTree = !$scope.$parent.nodeList?fac.treeToFlat($scope.nodeList):$scope.$parent.flatTree;
                $scope.selectNode = $scope.selectNode ||$scope.$parent.selectNode;
                $scope.sort = $scope.$parent.sort;
                $scope.undo = $scope.$parent.undo;
                $scope.save = $scope.$parent.save;
                $scope.delNode = $scope.$parent.delNode;
                $scope.addSon = $scope.$parent.addSon;
                $scope.check = $scope.$parent.check?$scope.$parent.check:defaultCheck;
                $scope.editNode = $scope.$parent.editNode;
                $scope.getDataClass = $scope.$parent.getDataClass;
            }
        };
    });
    app.directive("page", function () {
        return {
            restrict: "E",
            scope: {
                pageModel: '<?',
                find:'<?'
            },
            templateUrl: 'common/pager.html',
            controller: function ($scope,fac) {
                //勾选
                $scope.find = $scope.find ||$scope.$parent.find;
            }
        };
    });
    app.directive("thCheck", function () {
        return {
            restrict: "A",
            scope: {
                items: '<?',
            },
            templateUrl: 'thCheckAll.html',
            controller: function ($scope,$rootScope) {
                //勾选
                $scope.checkAll = $rootScope.checkAll;
                $scope.allChecked = $rootScope.allChecked;
            }
        };
    });
    app.directive("tdCheck", function () {
        return {
            restrict: "A",
            scope: {
                item: '<?',
            },
            templateUrl: 'tdCheckOne.html',
            controller: function ($scope,$rootScope) {
                //勾选
                $scope.checkOne = $rootScope.checkOne;
            }
        };
    });

    app.directive("colorEdit", function () {
        return {
            restrict: "A",
            scope: {
                host: '<?',
                need:'<?',
                key:'<?'
            },
            templateUrl: 'colorSelect.html',
            controller: function ($scope) {
                $scope.$on('colorPicked', function(event, color) {
                    $scope.host[$scope.key] = color;
                });
            }
        };
    });

    app.controller('iconSelectCtrl', function($scope,$http,$uibModalInstance,fac,host) {
        $scope.host = host;
        $scope.icons = angular.extend([],host.icons);
        $scope.search = {};

        $http.get("../icon/listFolder").success(function(resp){
            if(resp.code === 0){
                $scope.folders = resp.data;
                $scope.selectFolder($scope.folders[0]);
            }else{
                alert(resp.msg);
            }
        })

        $scope.checkOne = function(icon){
            if(icon.checked){
                let toDel = $scope.icons.find(m=>m.url == icon.url);
                $scope.icons.splice($scope.icons.indexOf(toDel),1);
            }else{
                $scope.icons.push(angular.extend({},icon));
            }
            icon.checked=!icon.checked;
        }
        $scope.remove = function(icon){
            $scope.icons.splice($scope.icons.indexOf(icon),1);
            let toDel = $scope.curFolder.list.find(m=>m.url == icon.url);
            toDel&&(toDel.checked = false);
        }

        $scope.selectFolder = function(folder){
            if($scope.curFolder==folder){
                return;
            }
            $scope.curFolder = folder;
            $scope.find();
        }

        $scope.find = function(){
            let curFolder = $scope.curFolder;
            $http.get("../icon/listIcons?folder="+curFolder.text).success(function(resp){
                if(resp.code === 0){
                    curFolder.list = resp.data;
                    curFolder.list.forEach(n=>{
                        if($scope.icons.find(m=>m.url == n.url)){
                            n.checked = true;
                        }
                    })
                }
            })
        };
        $scope.save = function () {
            host.icons = $scope.icons;
            $uibModalInstance.close();
        }
    });


    app.directive("layerSelect", function () {
        return {
            restrict: "E",
            scope: {
                host: '=',
                nodeList: '=',
                selectMethod: '=',
                pnode: "="
            },
            templateUrl: 'common/layerSelect.html',
            controller: function ($scope) {
                $scope.selectNode = $scope.$parent.selectNode;
                if ($scope.selectMethod) {
                    $scope.selectNode = $scope.selectMethod;
                }
            },
            link: function (scope, $element, $attrs) {
                $element[0].style.marginBottom = "450px";
                // $element[0].style.marginRight = "25px";
            }
        };
    });

    app.directive("layerSelector", function () {
        return {
            restrict: "E",
            scope: {
                host: '=',
                hostKey: '=',
                hostText: '=',
                nodeList: '=',
                leafOnly:'=',
                callback:'='
            },
            templateUrl: 'common/layerSelector.html',
            controller: function ($scope,fac) {
                $scope.state = {};
                var key = $scope.hostKey;
                var leafOnly = $scope.leafOnly;
                if($scope.host[key]&&!$scope.host[$scope.hostText]){
                    var flatList = fac.treeToFlat($scope.nodeList);
                    var node = flatList.find(function(n){return $scope.host[key] == n.id})
                    if(node){
                        $scope.host[$scope.hostText] = (node.ptexts ? node.ptexts + " > " : "") + node.text;
                    }
                }
                $scope.selectNode = function(node,host){
                    if(leafOnly && node.nodes){
                        alert("请选择叶子节点！");
                        return;
                    }
                    if (angular.isDefined(node.id) && node.id != host[key]) {
                        host[key] = node.id;
                        host[$scope.hostText] = (node.ptexts ? node.ptexts + " > " : "") + node.text;
                        $scope.state.hover = $scope.state.focus = false;
                        $scope.callback && $scope.callback($scope.host,node);
                        //$scope.$apply();
                    }
                }
                $scope.clear = function(){
                    $scope.host[$scope.hostText] = ""
                    delete $scope.host[key];
                    $scope.callback && $scope.callback($scope.host);
                }
            },
            link: function (scope, $element, $attrs) {
              //  $element[0].style.marginBottom = "450px";
                // $element[0].style.marginRight = "25px";
            }
        };
    });

    app.directive("treeSelector", function () {
        return {
            restrict: "E",
            scope: {
                need:"=",
                host: '=',
                tipText:"=",
                hostKey: '=',
                hostText: '=',
                nodeList: '=',
                leafOnly:'=',
                callback:'='
            },
            templateUrl: 'common/selectorTree.html',
            controller: function ($scope,fac) {
                $scope.state = {};
                $scope.host = $scope.host||{};
                var key = $scope.hostKey;
                var leafOnly = $scope.leafOnly;
                if($scope.host[key]&&!$scope.host[$scope.hostText]){
                    var flatList = fac.treeToFlat($scope.nodeList);
                    var node = flatList.find(function(n){return $scope.host[key] == n.code})
                    if(node){
                       //$scope.host[$scope.hostText] = (node.ptexts ? node.ptexts + " > " : "") + node.text;
                        $scope.host[$scope.hostText] = node.text;
                    }
                }
                $scope.selectNode = function(node,host){
                    if(leafOnly && node.nodes){
                        alert("请选择叶子节点！");
                        return;
                    }
                    var oldNode = fac.getSelectedNode($scope.nodeList);
                    if (oldNode && oldNode != node) {
                        oldNode.state.selected = false;
                    }
                    node.state = node.state || {};
                    node.state.selected = true;

                    if (angular.isDefined(node.code) && node.code != host[key]) {
                        host[key] = node.code;
                        //host[$scope.hostText] = (node.ptexts ? node.ptexts + " > " : "") + node.text;
                        host[$scope.hostText] = node.text;
                        $scope.state.hover = $scope.state.focus = false;
                        $scope.callback && $scope.callback($scope.host,node);
                        //$scope.$apply();
                    }
                }
                $scope.clear = function(){
                    $scope.host[$scope.hostText] = ""
                    delete $scope.host[key];
                    $scope.callback && $scope.callback($scope.host);
                }
                 $scope.$watch('host.'+$scope.hostText, function (text, oldText) {
                    if(!$scope.nodeList) return;
                    if($scope.host){
                         var node = $scope.host[key]?(fac.getNodeByCode($scope.nodeList,$scope.host[key])):null;
                         if(node && node.text == text){
                             fac.filterTree($scope.nodeList,'code',$scope.host[key],false);
                         }else if(text){
                             fac.filterTree($scope.nodeList,'text',text);
                             delete $scope.host[key];
                         }else {
                             $scope.nodeList && $scope.nodeList.forEach(function(n){ fac.setTreeState(n,'hide',false); });
                             delete $scope.host[key];
                         }
                     }
                })
            },
            link: function (scope, $element, $attrs) {
                //  $element[0].style.marginBottom = "450px";
                // $element[0].style.marginRight = "25px";
            }
        };
    });


    app.directive('imageLoad', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('load', function () {
                    //call the function that was passed
                    scope.$apply(attrs.imageLoad);
                });
            }
        };
    })
    app.directive('ensureUnique', ['$http', function ($http) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, c) {
                scope.$watch(attrs.ngModel, function (v) {
                    if (v === undefined||v===""||v === null) {
                        return;
                    }
                    switch (attrs.ensureUnique){
                        case 'iconName':
                            if(scope.$parent.items.find(function(n){return n.id != attrs.id && n.newName == v})){
                                c.$setValidity("pattern", false);
                                return;
                            }else {
                                c.$setValidity("pattern", true);
                            }
                            var idList = scope.$parent.items.reduce(function(ret,n){ret.push(n.id);return ret },[]);
                            var pack = { ids: idList.join() }
                            pack[attrs.ensureUnique] = v;
                            pack.folderId = scope.$parent.items[0].typeId;
                            $http({
                                method: 'POST',
                                url: attrs.api,
                                params: pack
                            }).success(function (data, status, headers, cfg) {
                                c.$setValidity('unique', data.isUnique);
                            }).error(function (data, status, headers, cfg) {
                                c.$setValidity('unique', false);
                            });break;
                        case 'iconFolder':
                            if(scope.$parent.folders.find(n=>n.text == v && !n.edit)){
                                c.$setValidity("pattern", false);
                                return;
                            }else {
                                c.$setValidity("pattern", true);
                            }break;
                        case 'dictName':
                            if(scope.$parent.type.data && scope.$parent.type.data.find(function(n){return n.id!= attrs.id && n.name == v})){
                                c.$setValidity("pattern", false);
                                return;
                            }else {
                                c.$setValidity("pattern", true);
                            }break;
                        case  'communityName':
                            if(scope.flatTree.find(function(n){return n.id != scope.item.id && n.text == v})){
                                c.$setValidity("pattern", false);
                                return;
                            }else {
                                c.$setValidity("pattern", true);
                            }break;
                        case  'sceneCode':
                            var pNode = scope.flatTree.find(function(n){return scope.item.pids.indexOf(n.id)==0});
                            var flatList = treeToFlat([pNode]);
                            if(flatList.find(function(n){return n != scope.item && !n.nodes && n.code == v})){
                                c.$setValidity("pattern", false);
                                return;
                            }else {
                                c.$setValidity("pattern", true);
                            }break;
                        default:
                            var pack = { id: attrs.id }
                            pack[attrs.ensureUnique] = v;
                            $http({
                                method: 'POST',
                                url: attrs.api,
                                params: pack
                            }).success(function (resp, status, headers, cfg) {
                                c.$setValidity('unique', resp.data==0);
                            }).error(function (resp, status, headers, cfg) {
                                c.$setValidity('unique', false);
                            });break;
                    }
                });
            }
        }
    }]);

    app.factory("httpInterceptor", ['$log', '$q', '$location', function ($log, $q, $location) {
        var layerIndex;
        var httpInterceptor = {
            'responseError': function (response) {
                layer.close(layerIndex);
                if (response.status == 401) {
                    top.location.href='login.html';
                    return $q.reject(response);
                }else if (response.status === 404) {
                    alert("404!");
                    return $q.reject(response);
                } else if (response.status === 500) {
                    alert("500!");
                  /*  $("#ajaxBody").removeClass("hide");
                    //异步加载模式
                    $("#ajaxBody").load("/view/error/500.html", function (response, status, xhr) {
                        if (status == "error") {
                            $(this).html(response);
                        }
                    });*/
                    return $q.reject(response);
                }
            },
            'response': function (response) {

                var url = response.config && response.config.url;
                if (/_mute/.test(url) || /.html/.test(url) ||
                    /.svg/.test(url) || /getNewWorkunit.do/.test(url)) {
                    return response;
                }
                if(response.config.data&&response.config.data.hasOwnProperty('config')){
                    return response;
                }
                layer.close(layerIndex);
                return response;
            },
            'request': function (config) {
                var url = config.url;
                var contentType = config.headers["Content-Type"];
                //form data parse data to string
                if (contentType == 'form') {
                    config.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
                    if (angular.isDefined(config.data)) {
                        config.data = angular.element.param(config.data);
                    }
                }
                if (/_mute/.test(url) || /.html/.test(url) ||
                    /.svg/.test(url) || /getNewWorkunit.do/.test(url)  )
                    {
                    return config;
                }
                layerIndex = layer.load(1, {
                    shade: [0.2, '#000'] //0.1透明度的白色背景
                });
                return config;
            }
            //	'requestError' : function(config){         ......         return $q.reject(config);       }
        }
        return httpInterceptor;
    }]);

    app.config(['$httpProvider', function ($httpProvider) {
        var explorer = window.navigator.userAgent;
        //ie,如果为ie，则强制清除缓存。规避ie的get方法强行缓存的坑
        if ((explorer.toLowerCase().indexOf("trident") > -1 && explorer.indexOf("rv") > -1) ||
            explorer.indexOf("MSIE") >= 1) {
            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {};
            }

            // Answer edited to include suggestions from comments
            // because previous version of code introduced browser-related errors

            //disable IE ajax request caching
            $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
            // extra
            $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
            $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        }


        $httpProvider.interceptors.push('httpInterceptor');

    }]);

    app.factory("fac", function ($http, $q, $rootScope, $uibModal, $compile) {

        function isHasImg(pathImg) {
            var ImgObj = new Image();
            ImgObj.src = pathImg;
            if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
                return true;
            } else {
                return false;
            }
        };
        $rootScope.download = function(url){
            try{
                var elemIF = document.createElement("iframe");
                elemIF.src = url;
                elemIF.style.display = "none";
                document.body.appendChild(elemIF);
            }catch(e){

            }
        };
        function upload(options, fn) {
            if (typeof (options.params) != "object") {
                options.params = {};
            }
            if (!options.url) {
                options.url = '/ovu-base/uploadImg.do';
            }
            var index;
            if (options.nowait) {
                options.onSubmit = function () {
                };
            } else {
                options.onSubmit = function () {
                    index = layer.load(1, {
                        shade: [0.2, '#000'] //0.1透明度的白色背景
                    });
                };
            }
            options.onComplate = function (resp) {
                layer.close(index);
                if(resp.code == 401){
                    confirm("会话已过期，请重新登录！",function(){
                        top.location.href='/admin/login.html';
                    })
                }else{
                    fn && fn(resp);
                }
            };
            // 上传方法
            $.upload(options);
        }

        function isEmpty(value) {
            return angular.isUndefined(value) || value == null || (angular.isString(value) && value == "") || value.length == 0;
        }

        function isNotEmpty(value) {
            return !this.isEmpty(value);
        }

        function compare ( x, y ) {
// If both x and y are null or undefined and exactly the same
            if ( x === y ) {
                return true;
            }
// If they are not strictly equal, they both need to be Objects
            if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) {
                return false;
            }
//They must have the exact same prototype chain,the closest we can do is
//test the constructor.
            if ( x.constructor !== y.constructor ) {
                return false;
            }
            for ( var p in x ) {
                if(["scale","$$hashKey","id","edit","copy","checked"].indexOf(p)>-1||p.startsWith("dict")){
                    continue;
                }
                //Inherited properties were tested using x.constructor === y.constructor
                if ( x.hasOwnProperty( p ) ) {
                    // Allows comparing x[ p ] and y[ p ] when set to undefined
                    if ( ! y.hasOwnProperty( p ) ) {
                        return false;
                    }
                    // If they have the same strict value or identity then they are equal
                    if ( x[ p ] === y[ p ] ) {
                        continue;
                    }else{
                        return false;
                    }
                }
            }
            for ( p in y ) {
                if(["scale","$$hashKey","id","edit","copy","checked"].indexOf(p)>-1||p.startsWith("dict")){
                    continue;
                }
                // allows x[ p ] to be set to undefined
                if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) {
                    return false;
                }
            }
            return true;
        }

        //人员模糊搜索
        $rootScope.searchPerson=function(val,parkId,deptId){
            if(val && val.indexOf(" (")>0){
                val = val.substring(0,val.indexOf(" ("));
            }
            parkId=parkId?parkId:null;
            deptId=(deptId && deptId!=0)?deptId:null;
            var param={
                pageIndex:0,
                pageSize:10,
                name:val,
                parkId:parkId,
                deptId:deptId
            };
            return $http.post("../ovu-base/pcos/person/search.do",param,postConfig).then(function(resp){
                return resp.data;
            })
        }
        $rootScope.selectIcon = function(host){
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: 'view/icon/icon.select.html',
                controller: 'iconSelectCtrl'
                ,resolve: {host: function(){return host;}}
            });
            modal.result.then(function (data) {
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //显示图片
        $rootScope.showPhoto = function (src) {
            var src;
            if(event){
                src = event.srcElement.getAttribute("src");
            }
            src  = src|| photoUrl;
            if (src && src.indexOf("_min.") > -1) {
                src = src.replace("_min.",".");
            }
            $rootScope.curPic = { url: src, on: true };
        },
        $rootScope.addFile = function (item, urlField, nameField) {
            upload({ url: "/ovu-base/uploadFile.do", accept: "*" }, function (resp) {
                if (resp.success && resp.data) {
                    item[urlField] = resp.data.url;
                    item[nameField] = resp.data.name;
                    $rootScope.$apply();
                } else {
                    alert(resp.error);
                }
            })
        }

        $rootScope.addLimitFile = function (item, urlField, nameField,accepts) {
            upload({ url: "/ovu-base/uploadFile.do", accept: "*" }, function (resp) {
                if (resp.success && resp.data) {
                	var fileUrl = resp.data.url;
                	var express = fileUrl.substring(fileUrl.lastIndexOf("."));
                    if(accepts.length > 0 && accepts.indexOf(express) == -1){
                    	alert("只允许上传格式为:["+accepts.join("、")+"]的文件");
                    	return
                    }
                    item[urlField] = fileUrl;
                    item[nameField] = resp.data.name;
                    $rootScope.$apply();
                    //console.log(item);
                } else {
                    alert(resp.error);
                }
            })
        };
        $rootScope.addLimitFiles = function (item, urlField, nameField,accepts,fileList) {
            if(fileList.length>1){
                alert("最多只允许上传2个文件");
                return
           }
            upload({ url: "/ovu-base/uploadFile.do", accept: "*" }, function (resp) {
                if (resp.success && resp.data) {

                	var fileUrl = resp.data.url;
                	var express = fileUrl.substring(fileUrl.lastIndexOf("."));
                    if(accepts.length > 0 && accepts.indexOf(express) == -1){
                    	alert("只允许上传格式为:["+accepts.join("、")+"]的文件");
                    	return
                    }

                    if(fileList.length>0){
                        if(fileList[0].name==resp.data.name){
                            alert("不允许上传重复文件");
                            return
                        }
                        fileList.push({path:fileUrl,name:resp.data.name})

                        $rootScope.$apply();
                    }else{
                        item[urlField] = fileUrl;
                        item[nameField] = resp.data.name;
                        fileList.push(item);
                     $rootScope.$apply();
                    }


                } else {
                    alert(resp.error);
                }
            })
        }
        $rootScope.addPhoto = function (item, field, original) {
            upload({ url: "/ovu-base/uploadImg.do",params:{original:original || false} }, function (resp) {
                if (resp.success && resp.list.length) {
                    item[field] = resp.list[0].url;
                    $rootScope.$apply();
                } else {
                    alert(resp.error);
                }
            })
        }

        $rootScope.clearPhoto = function (item, field) {
            confirm("确定清除照片吗？", function () {
                item[field] = '';
                $rootScope.$apply();
            })
        }
        $rootScope.delPhoto = function (picList, pic) {
            confirm("确定删除照片吗？", function () {
                picList.splice(picList.indexOf(pic), 1);
                $rootScope.$apply();
            })
        }

        //可指定宽度 缩略图 图片url
        $rootScope.processImgUrl = function (imgUrl, width) {
            if(!imgUrl){
                return "images/detail.png";
            }else if(imgUrl && imgUrl.indexOf("http") == 0) {
                if ('origin' == width) {
                    return imgUrl;
                } else if (width && !isNaN(width)) {
                    if(imgUrl.indexOf("?")>-1){
                        return imgUrl.replace("?","?imageView2/2/w/" + width+"&")
                    }else{
                        //指定了宽度
                        return imgUrl + "?imageView2/2/w/" + width;
                    }
                }
                return imgUrl;
                //return imgUrl + "?imageView2/2/w/100";
            }else if(imgUrl && width=='min') {
                return ".."+imgUrl.replace(".","_min.");
            } else{
                return ".."+imgUrl;
            }
        }
        //新版:是否有某项操作权限
        $rootScope.hasPower = function (action,instanceId) {
            if(!app.user){
                return false;
            }
           if(app.user.account == "admin"){
               return true;
           }
           if("style"==action){
               if(app.user.writeInstanceIds && app.user.writeInstanceIds.split(",").indexOf(instanceId.toString())>-1){
                   return true;
               }
           }else if (app.user.power && app.user.power.indexOf(action) > -1) {
               return true;
           }
           return false;
        }

        $rootScope.wheel = function () {
            wheelzoom(event.target);
        }

        $rootScope.checkAll = function (items) {
            if(items){
                items.checked = !items.checked;
                items.forEach(function (n) {
                    n.checked = items.checked
                });
            }
        }
        $rootScope.allChecked = function (items) {
           return  items && items.length && items.every(function (n) {
                return n.checked;
            });
        }
        $rootScope.hasChecked = function (items) {
            return items && items.length && items.find(function (n) {
                return n.checked
            });
        }

        $rootScope.unCheckAll = function (items) {
            items.forEach(function (n) {
                 n.checked = false;
            });
        }
        $rootScope.expandAll = function (tree) {
            var list = treeToFlat(tree);
            tree.expanded = !tree.expanded;
            list.forEach(function (n) {
                n.state = n.state || {};
                n.state.expanded = tree.expanded;
            })
        }
        $rootScope.checkOne = function (item) {
            item.checked = !item.checked;
        }

        var postConfig = {
            transformRequest: function (obj) {
                var str = [];
                if (typeof obj === 'object' && !obj.length) {
                    for (var p in obj) {
                        //debugger
                        //obj[p] === null || obj[p] === undefined || obj[p] === ""
                        if (obj[p] === null || obj[p] === undefined || obj[p] ==='undefined')  {
                            continue;
                        } else if(obj[p] === ""){
                            str.push(encodeURIComponent(p) +"=");
                        }else if (typeof obj[p] === 'object' && obj[p].length === undefined) {
                            continue;
                        } else if (angular.isArray(obj[p])) {
                            continue;
                        } else {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                    }
                } else if (typeof obj === 'object' && obj.length > 0) {
                    for (var p in obj) {
                        str.push(encodeURIComponent(obj[p].name) + "=" + encodeURIComponent(obj[p].value));
                    }
                }
                return str.join("&");
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };


        function getSelectedNode(treeData) {
            var list = treeToFlat(treeData);
            return list.find(function(n){return n.state &&n.state.selected})
        }

        /**
         * 获得选中的ids
         */
        function getCheckedIds(idList,treeData) {
            treeData.forEach(function(n){
                if(n.state && n.state.checked){
                    idList.push(n.id);
                }
                if(n.nodes){
                    getCheckedIds(idList,n.nodes);
                }
            })
        }

        function match(node,key,val,hide){
            var ret = false;
            if(key == "code" && angular.isArray(val) && val.indexOf(node[key])>-1){
                ret = true;
            }else if(key == "code" && !angular.isArray(val) && node[key]==val){
                node.state = {selected:true};
                ret = true;
            }else if(key != "code" && node[key].indexOf(val)>-1){
                ret = true;
            }else if(node.nodes){
                var list = node.nodes.filter(function(n){return match(n,key,val,hide)});
                if(list.length>0){
                    ret = true;
                }
            }
            node.state = node.state||{};
            if(hide){
                node.state.hide = !ret;
            }
            node.state.expanded = ret;
            return ret;
        }

        function filterTree(tree, key, val,hide) {
            var flatTree = treeToFlat(tree);
            flatTree.forEach(function(n){
                n.state =  n.state||{};
                if(val!='' && key == "text" && n[key].indexOf(val) > -1){
                    n.state.highLight = true;
                }else{
                    n.state.highLight = false;
                }
            })
            if (val=='') return tree;
            return tree.filter(function (n) {
                return match(n, key, val,hide);
            });
        }

        function execTreeNode(tree,fn) {
            tree.forEach(node => {fn && fn(node);if(node.nodes && node.nodes.length){execTreeNode(node.nodes,fn)}});
        }

        function setTreeState(node,stateKey, val) {
            node.state = node.state||{};
            node.state[stateKey] = val;
            if(node.nodes){
                node.nodes.forEach(function(n){setTreeState(n,stateKey,val)  });
            }
        }
        function copyTreeState(oriTree,newTree){
            var newTreeFlat = treeToFlat(newTree);
            var oriTreeFlat = treeToFlat(oriTree);
            newTreeFlat.forEach(function(node){
                var oriNode = oriTreeFlat.find(function(n){return n._id == node._id});
                if(oriNode && oriNode.state){
                    node.state = oriNode.state;
                }
            })
        }
        function isAncestorNode(parent, son) {
            if(!parent.nodes||parent.nodes.length == 0){
                return false;
            }else if(parent.nodes.indexOf(son)>-1){
                return true;
            }else if(parent.nodes.find(n=>isAncestorNode(n,son))){
                  return true;
            }else{
                return false;
            }
        }

        return {
            postConfig: postConfig,
            localSplitData:function(allData,param,fn){
                function setPages(data){
                    /**
                     * 始终得有第一页和最后一页.当前页 ,前一页,后一页.
                     */
                    var list = [1, data.currentPage - 1, data.currentPage, data.currentPage + 1, data.totalPage];
                    var pages = [];
                    var hash = {};
                    list.forEach(function (v) {
                        if (!hash[v] && v <= data.totalPage && v > 0) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    })
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, '······');
                    }
                    if (pages.length > 2 && pages.indexOf(data.totalPage - 1) == -1) {
                        pages.splice(pages.length - 1, 0, '······');
                    }
                    data.pages = pages;
                }
                //虚拟分页
                if(allData){
                    var filterData = allData.filter(function(n){
                        var ret = true;
                        if(angular.isDefined(param.code) && param.code!=null){
                            ret = (n.code == param.code||n.textStyleID == param.code);
                        }
                        if(angular.isDefined(param.name) && param.name.trim().length){
                            ret = ret&&((n.name && n.name.includes(param.name.trim()))
                                        ||(n.text &&  n.text.includes(param.name.trim()))
                                        ||(n.textName &&  n.textName.includes(param.name.trim())));
                        }
                        return ret;
                    })
                    var data ={pageSize:param.pageSize,currentPage:param.currentPage}
                    data.totalRecord = filterData.length;
                    if (data.pageSize != 0) {
                        data.totalPage = (Math.floor(data.totalRecord / data.pageSize) + (data.totalRecord % data.pageSize > 0 ? 1 : 0));
                    }
                    if (data.totalPage < 1)
                        data.totalPage = 1;
                    setPages(data);
                    data.data = filterData.slice(data.pageSize*(data.currentPage-1),data.pageSize*data.currentPage)
                    data.data.length && (data.data[0].showTitle = true);

                    fn && fn(data);
                }
            },
            //获取分页查询结果
            getPageResult: function (url, param, fn) {

                param.pageIndex = param.currentPage && param.currentPage - 1;

                //$.get(url,param)
                $http.get(url, {params:param}).success(function (resp, status, headers, config) {
                    var data = resp.data;
                    data.currentPage = data.pageIndex + 1;
                    data.totalPage = data.pageTotal;
                    param.totalCount = data.totalRecord = data.totalCount;
                    if (data.data && data.data.length >= 0) {
                        data.list = data.data;
                    }

                    /**
                     * 始终得有第一页和最后一页.当前页 ,前一页,后一页.
                     */
                    var list = [1, data.currentPage - 1, data.currentPage, data.currentPage + 1, data.totalPage];
                    var pages = [];
                    var hash = {};
                    list.forEach(function (v) {
                        if (!hash[v] && v <= data.totalPage && v > 0) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    })
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, '······');
                    }
                    if (pages.length > 2 && pages.indexOf(data.totalPage - 1) == -1) {
                        pages.splice(pages.length - 1, 0, '······');
                    }
                    data.pages = pages;
                    fn && fn(data);
                }).error(function (data, status, headers, config) {
                    console.log("获取列表异常");
                });
            },
            isHasImg: isHasImg,
            // 本地导入
            upload: upload,
            isEmpty: isEmpty,
            isNotEmpty: isNotEmpty,
            treeToFlat: treeToFlat,
            isAncestorNode:isAncestorNode,
            execTreeNode:execTreeNode,
            getSelectedNode:getSelectedNode,
            filterTree:filterTree,
            getCheckedIds:getCheckedIds,
            setTreeState:setTreeState,
            copyTreeState:copyTreeState,
            compare:compare,
            //reveal:是否显示此节点及其父节点
            getNodeByCode: function (treeData, code) {
                var list = treeToFlat(treeData);
                var target = list.find(function (n) {
                    return (n.code == code)
                });
                return target;
            }
        }
    });

    app.factory('locals', ['$window', function ($window) {
        return { //存储单个属性
            set: function (key, value) {
                $window.localStorage[key] = value;
            }, //读取单个属性
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            }, //存储对象，以JSON格式存储
            clear: function (key) {
                $window.localStorage[key] = null;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value); //将对象以字符串保存
            }, //读取对象
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}'); //获取字符串并解析成对象
            }

        }
    }]);


})();
