(function() {
    "use strict";
    var app = angular.module("showApp");

    app.filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
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
    app.factory("fac", function ($http, $q, $rootScope, $uibModal, $compile) {
        //显示图片
        $rootScope.showPhoto = function (photoUrl) {
            var src;
            if(event){
                src = event.srcElement.getAttribute("src");
            }
            src  = src|| photoUrl;
            if (src && src.indexOf("_min.") > -1) {
                src = src.replace("_min.",".");
            }
            $rootScope.curPic = { url: src, on: true };
        }
        $rootScope.wheel = function () {
            wheelzoom(event.target);
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
            isAncestorNode:isAncestorNode
        }

    });
    app.component("schemeDetail",
        {
            restrict: "E",
            bindings: {
                scheme:'<',
                readyToShow:'&'
            },
            templateUrl: '/show/v1/schemeDetail.html',
            controller: function($scope,$rootScope, $http,$q) {

                var $ctrl = this;
                $ctrl.mapList = [];
                $ctrl.schemeCache = [];

                function getMap(mapId){
                    return $ctrl.mapList.find(n=>n.mapId == mapId);
                }
                function addMap(entity){
                    let canvas = document.createElement("div");
                    canvas.setAttribute("id",entity.mapId);
                    canvas.setAttribute("class","mapdiv");
                    document.getElementById("mapContainer").appendChild(canvas);
                    $(canvas).css("height",window.innerHeight);
                    $("#mapContainer>div.mapdiv:not([id='"+entity.mapId+"'])").css("display","none");
                    $ctrl.mapList.push(entity);
                }

                var markers = [];
                function drawMap(scheme){
                    let bridMapId = scheme.birdMap;
                    console.log("drawMap");
                    $("#mapContainer>div.mapdiv:not([id='"+bridMapId+"'])").css("display","none");
                    //现存地图中无此节点
                    let mapObj = getMap(bridMapId);
                    if(!mapObj){
                        mapObj = {mapId:bridMapId,scheme:scheme};
                        addMap(mapObj);
                        console.log(document.getElementById(bridMapId))
                        AirocovMap.Config.set({
                            showViewMode: "MODE_2D",
                            defaultDetectModels: ["logoGroup", "nameGroup"]
                        });
                        let map = new AirocovMap.Map({
                            //地图容器
                            container: document.getElementById(bridMapId),
                            themeUrl: "/res/theme/fillcolor2.json",
                            logoSrc: "/pic/logo_ovu.png",
                            zoom: 2.5,
                            theta: 0,
                            //地图楼层列表
                            mapList: [
                                {
                                    name: "F1", //楼层名
                                    mapUrl: "/free/mapDetail.json?id="+bridMapId //地图路径
                                }
                            ]
                        });


                        window.layerIndex = layer.load(1, { shade: [0.2, '#000'] });

                        mapObj.map = map;
                        mapObj.curMode = "2D";//初始为2D
                        addClickEvent(mapObj.map);
                        //mapObj.map.control.enableZoom = false;

                        mapObj.mapPromiss = $q((resolve, reject)=>  map.event.on("loaded", ()=> resolve()))
                    }else{
                        $("#"+bridMapId).css("display","");
                    }
                    mapObj.mapPromiss.then(()=>{

                        mapObj.map.control.enableRotate = false;
                        //    mapObj.map.control.enablePan = false; //禁止移动和翻转,只能缩放
                        layer.close(window.layerIndex);
                        $scope.$emit("schemeDetail","showMap");
                        if( $ctrl.curScheme != scheme){
                            /*$ctrl.curScheme && $ctrl.curScheme.markers.forEach(n=> mapObj.map.clearLayer("F1", n.objId))*/
                            mapObj.map.clearFloorLayer("F1", false);
                            $ctrl.curScheme = scheme;

                            if($ctrl.curScheme.policyList && $ctrl.curScheme.policyList.length){
                                if(!$ctrl.curScheme.policyList.find(n=>n.open)){
                                    $ctrl.curScheme.policyList[0].open = true;
                                }
                            }
                            $ctrl.curMapObj = mapObj;
                            delete  $ctrl.curMarker ;
                            scheme.markers && scheme.markers.forEach(n=>addMarker(mapObj.map,n))
                        }
                    });
                }



                function addMarker(map,marker,fn){
                    //若marker 已有描点，清除此描点
                    marker.objId && map.clearLayer("F1", marker.objId);

                    if( ($ctrl.curScheme.showVidicon ||$ctrl.curScheme.schemeType.isLight) &&marker.objId){
                        map.clearLayer("F1",  marker.objId+"_range")
                    }
                    if(!$ctrl.curScheme.schemeType.types.find(n=>n.type == marker.type)){
                        //方案分类上删除了某些覆盖物类型，对应marker 不再渲染，但不删除
                        return;
                    }
                    switch(marker.type){
                        case "text":
                            new AirocovMap.Markers.TextMarker({
                                text: marker.name, //图片路径
                                lnglat: marker.lnglat, //经纬度坐标
                                y: marker.height||100, //三维坐标系坐标y值,
                                zoom: 0.5,
                                mapCenter: map.getMapCenter("F1"), //地图中心点,
                                userData: marker,
                                callback: function (textMark) {
                                    //将图片标注添加到地图
                                    marker.objId = textMark.id;
                                    marker.position = textMark.position;
                                    map.addToLayer(textMark, "F1", textMark.id, true);
                                    fn && fn()
                                }
                            });break;
                        case "point":
                            new AirocovMap.Markers.ImageMarker({
                                imgMarker: marker.imgMarker, //图片路径
                                lnglat: marker.lnglat, //经纬度坐标
                                y:  marker.height||100, //三维坐标系坐标y值,
                                size: 1.8,
                                mapCenter: map.getMapCenter("F1"), //地图中心点,
                                userData: marker,
                                callback: function (imgMark) {
                                    //将图片标注添加到地图
                                    marker.objId = imgMark.id;
                                    map.addToLayer(imgMark, "F1", imgMark.id, true);
                                    if($ctrl.curScheme.schemeType.isLight){
                                        //如果当前节点是电灯
                                        let markType = $ctrl.curScheme.schemeType.types.find(m=>m.type == "point");
                                        if(markType.icons && markType.icons.length>=2){
                                            addCircuitry(map,marker,markType.icons[1]);
                                        }
                                        let light = $ctrl.curScheme.markers.find(n=>n.type=='point' && n.circuitry == marker.circuitry && n!=marker);
                                        if(light && light.lightOn){
                                            addVidicon(map,marker);
                                        }
                                    }else if($ctrl.curScheme.showVidicon){
                                        addVidicon(map,marker);
                                    }
                                    fn && fn()
                                }
                            });break;
                        case "path":
                            let PolyLine = new AirocovMap.Markers.PolyLine();
                            let points = marker.points;
                            if(points.length == 1){
                                points = points.concat(points);
                            }
                            let arr = [];
                            points.forEach(v => {
                                arr.push([v[0] * .02, v[1] * .02])
                            });
                            //创建路径
                            let config = {
                                //线段的高度
                                height: 5,
                                //路径的宽度
                                radius: 0.02,
                                //自定义贴图
                                imgUrl: marker.imgMarker,
                                //运动速度
                                speed: 1,
                                //单节长度
                                sinLength:0.2,
                                lineType: 'straight'
                            }
                            //创建路径
                            let path = PolyLine.drawPath(arr, config)
                            path.scale.x = 50;
                            path.scale.z = 50;
                            marker.objId = path.id;
                            //marker.objId  = "roadLayer"
                            //添加到对应楼层中图层 // marker.objId
                            map.addToLayer(path, "F1","roadLayer", true)
                            //每个转角添加了一个数字标注
                            $ctrl.curMarker && $ctrl.curMarker.points.forEach((point,index)=>addTextMark(map,$ctrl.curMarker.objId,{x:point[0],y:101,z:point[1]},index+1))

                            fn && fn();
                            break;
                        case "fence":{
                            //围栏的坐标
                            let points = marker.points;
                            if(points.length == 1){
                                return;
                            }
                            //创建画线类
                            let PolyLine = new AirocovMap.Markers.PolyLine();
                            let wordPosition = marker.points.reduce((ret,n)=>{
                                ret[0]+=n[0]/marker.points.length;
                                ret[1]+=n[1]/marker.points.length;
                                return ret;
                            },[0,0]);
                            //围栏的配置
                            let config = {
                                //围栏高度
                                height: 100,
                                //围栏平面颜色
                                color: marker.color||"#ffff00",
                                //围栏平面透明度
                                opacity: angular.isNumber(marker.opacity)?marker.opacity:1,
                                //在围栏上显示的文字,如文字为空将创建普通围栏
                                str: marker.name,
                                //文字大小
                                size: 90,
                                //文字坐标
                                wordsPosition: wordPosition,
                                //文字/图片到平面的距离
                                gap: 2,
                                //图片路径(为绝对路径)
                                /*  imgUrl: "./img/lyzn.png",
                                  //图片宽度
                                  imgWidth: 8,
                                  //图片高度
                                  imgHeight: 2,
                                  //图片坐标(图片中心点)
                                  imgPosition: [-19.827051162719723, 13.017148763123346],*/
                            }
                            //创建围栏，传入围栏坐标及配置，返回围栏对象
                            var fence = PolyLine.drawWordsFence(angular.extend([],points), config)
                            marker.objId = fence.id;
                            console.log(fence.id);
                            //添加到对应楼层中图层
                            let fenceId = map.addToLayer(fence, "F1", marker.objId, true)
                            console.log(fenceId);
                            //每个转角添加了一个数字标注
                            $ctrl.curMarker && $ctrl.curMarker.points.forEach((point,index)=>addTextMark(map,$ctrl.curMarker.objId,{x:point[0],y:101,z:point[1]},index+1))
                            //可无刷新操作场景中对象
                            //fence.position.setX(Math.random() * 100 - 50)
                            fn && fn();
                            break;
                        }
                    }
                }

                function addTextMark(map,layerName,position,text){
                    //生成文字标注
                    let textMark = new AirocovMap.Markers.TextMarker({
                        text: text,  //标注内容
                        zoom: 1, //文字大小缩放系数
                        color: "purple", //文字颜色
                        position: position, //三维坐标系位置
                        userData: {
                        },
                        callback: function (textMark) {
                            //将文字标注添加到指定楼层的指定图层中
                            map.addToLayer(textMark, "F1", layerName, true);
                        }
                    });
                }
                $scope.toggleVidicon = function(){
                    let map = getMap($ctrl.curScheme.birdMap).map;
                    $ctrl.curScheme.showVidicon = !$ctrl.curScheme.showVidicon;
                    if($ctrl.curScheme.showVidicon){
                        $ctrl.curScheme.markers.forEach(n=>addVidicon(map,n));
                    }else{
                        $ctrl.curScheme.markers.forEach(n=>map.clearLayer("F1",  n.objId+"_range"));
                    }
                }
                $scope.toggleMapMod = function(mapMod){
                    if($ctrl.curMapObj.curMode!=mapMod){
                        switch (mapMod) {
                            case '2D': $ctrl.curMapObj.map.mapTo2D();$ctrl.curMapObj.map.control.enableRotate = false;break;
                            case '3D': $ctrl.curMapObj.map.mapTo3D(); $ctrl.curMapObj.map.control.enableRotate = true;break;
                        }
                        $ctrl.curMapObj.curMode = mapMod;
                    }
                }

                window.switchLight = function(circuitry,status){
                    let lights = $ctrl.curScheme.markers.filter(n=>n.type=='point' && n.circuitry == circuitry);
                    let map = $ctrl.curMapObj.map;
                    lights.forEach(n=>{
                        n.lightOn = status;
                        if(status){
                            addVidicon(map,n)
                        }else{
                            map.clearLayer("F1",  n.objId+"_range")
                        }
                    })
                }

                function addVidicon(map,marker){
                    let markType = $ctrl.curScheme.schemeType.types.find(n=>n.type == marker.type);
                    if(!markType ||! markType.hasSector ){
                        return;
                    }
                    //  map.clearLayer("F1",  marker.objId+"_range");
                    let imgMark = map.getObjectById(marker.objId);
                    //创建监控器类
                    var Vidicon = new AirocovMap.Markers.Vidicon()
                    //监控器配置
                    var config = {
                        //是否显示扇形
                        surround: true,
                        //扇形
                        sector: [
                            {
                                //长度
                                length:marker.radius||markType.radius||33,
                                //颜色
                                color:"#22bcea",
                                //透明度
                                opacity:0.8
                            }
                        ],
                        //偏转角
                        direction: marker.direction||markType.direction,
                        //扫描角度
                        arc: marker.arc||markType.arc
                        //logo路径，不配置不显示中logo
                        //imgUrl: "/pic/video/3.png",
                    }
                    //监控器坐标
                    var position = [imgMark.position.x,imgMark.position.y,imgMark.position.z];
                    //创建监控器
                    var v = Vidicon.drawMonitor(config, position)
                    //添加到对应楼层中图层
                    var vId = map.addToLayer(v, "F1", marker.objId+"_range", true)

                }

                function addCircuitry(map,marker,icon){
                    if(isNaN(marker.circuitry)){
                        return;
                    }
                    let lights = $ctrl.curScheme.markers.filter(n=>n.type=='point' && n.circuitry)
                    if(lights.find(n=>!n.position)) return;
                    lights.sort((a,b)=>b.position.x-a.position.x);
                    let allCircuitry = lights.reduce((ret,n)=>{
                        let o = ret.find(c=>c.circuitry == n.circuitry);
                        if(!o){
                            o = {circuitry:n.circuitry,points:[[n.position.x,n.position.z]]}
                            ret.push(o);
                        }else{
                            o.points.push([n.position.x,n.position.z])
                        }
                        return ret;
                    },[]);
                    allCircuitry.forEach(o=>{
                        if(o.points.length<=1){
                            return;
                        }
                        let layerName = "circuitry"+o.circuitry;
                        //清除原线路
                        map.clearLayer("F1", layerName );
                        /* if(lights.length == 1 || lights.indexOf(marker) != lights.length-1){
                             //迭代到线路中最后一个灯时，才开始画线
                             return;
                         }*/

                        let PolyLine = new AirocovMap.Markers.PolyLine();
                        let points = o.points;
                        let arr = [];
                        points.forEach(v => {
                            arr.push([v[0] * .02, v[1] * .02])
                        });
                        //创建路径
                        let config = {
                            //线段的高度
                            height: 5,
                            //路径的宽度
                            radius: 0.01,
                            //自定义贴图
                            imgUrl: icon.url,
                            //运动速度
                            speed: 1,
                            //单节长度
                            sinLength:0.2,
                            lineType: 'straight'
                        }
                        //创建路径
                        let path = PolyLine.drawPath(arr, config)
                        path.scale.x = 50;
                        path.scale.z = 50;
                        //marker.objId =
                        //marker.objId  = path.id;
                        //添加到对应楼层中图层 // marker.objId
                        map.addToLayer(path, "F1",layerName, true)
                    })
                }

                function addClickEvent(map){
                    map.event.on("click", function (e) {
                        console.log(e.lnglat);
                        console.log(e.position);
                        //关闭其他信息窗
                        infowindow &&  infowindow.close();
                        if(!$ctrl.curScheme.markers){
                            return;
                        }
                        if(['marker','Path'].indexOf(e.type) >-1 ){
                            console.log(e.target.position);
                            $ctrl.curScheme.markers.map(n=>{if(n.objId == e.target.id){
                                $ctrl.curMarker = n;
                                showInfoWin(e.target,e.position);
                                $scope.$applyAsync();
                            }})
                        }else if(['fence'].indexOf(e.type) >-1){
                            $ctrl.curScheme.markers.map(n=>{if(n.objId == e.target.info.id){
                                if(n.icons && n.icons.length){
                                    $rootScope.showPhoto(n.icons[0].url);
                                    $scope.$applyAsync();
                                }
                            }})
                        }else if($ctrl.curScheme.markers.find(n=>{return n.targetId == e.target.info.properties.uuid && n.targetType == e.type})){
                            let marker = $ctrl.curScheme.markers.find(n=>{ return n.targetId == e.target.info.properties.uuid && n.targetType == e.type});
                            if(marker.icons && marker.icons.length){
                                $rootScope.showPhoto(marker.icons[0].url);
                                $scope.$applyAsync();
                            }
                        }
                    });
                }

                $ctrl.$onInit = function () {
                    $("#mapContainer").css("height",window.innerHeight-70);
                }
                $ctrl.$onChanges = function (changes) {
                    if(changes.scheme.currentValue){
                        infowindow &&  infowindow.close();
                        let scheme = changes.scheme.currentValue;
                        if(!scheme._id){
                            //虚拟的scheme,只显示地图
                            drawMap(scheme);
                        }else{
                            $scope.schemeId = scheme._id;
                            getScheme($scope.schemeId,drawMap);
                        }
                    }
                };

                $ctrl.getMarkerClass=function(item){
                    switch ($ctrl.curScheme.schemeType.title) {
                        case "描点":return {'btn-warning':!item.lnglat,'btn-success':item.lnglat && item == $ctrl.curMarker,'active':item == $ctrl.curMarker};
                        case "划线":return {'btn-warning':item.points.length<2,'btn-success':item.points.length>=2 && item == $ctrl.curMarker,'active':item == $ctrl.curMarker};
                        case "围栏":return {'btn-warning':item.points.length<3,'btn-success':item.points.length>=3 && item == $ctrl.curMarker,'active':item == $ctrl.curMarker};
                    }
                }
                $ctrl.delPoint=function(point){
                    $ctrl.curMarker.points.splice($ctrl.curMarker.points.indexOf(point),1)
                    addMarker($ctrl.curMapObj.map,$ctrl.curMarker)
                }


                //显示地图
                //获取方案信息
                function getScheme(schemeId,cb){
                    var cache = $ctrl.schemeCache.find(n=>n.schemeId ==schemeId );
                    if(cache){
                        cb&&cb(cache.scheme);
                    }else
                        $http.get("../free/getScheme?id="+schemeId).success(function(resp){
                            if(resp.code == 0){
                                var scheme = resp.data;
                                scheme.schemeType.types.forEach(n=>{n.open = true
                                    if(n.hasSector) scheme.schemeType.hasSector = true;
                                    if(n.isLight)  scheme.schemeType.isLight = true;
                                }) ;
                                scheme.sensors = [];
                                scheme.sensors.open=true;
                                for(let i= scheme.markers.length-1;i>=0;i--){
                                    let marker = scheme.markers[i];
                                    if(!marker.type){
                                        scheme.markers.splice(i,1);
                                    }
                                    let markType = scheme.schemeType.types.find(m=>m.type == marker.type);
                                    if(marker.imgMarker && markType && markType.icons && markType.icons.length){
                                        if(!markType.icons.find(m=>m.url==marker.imgMarker)){
                                            marker.imgMarker = markType.icons[0].url;
                                        }
                                    }else{
                                        marker.imgMarker ="/pic/mark_b.png"
                                    }
                                    if(marker.mac){
                                        scheme.sensors.push(marker);
                                        updateSensor(marker);
                                    }
                                }
                                $ctrl.schemeCache.push({schemeId:schemeId,scheme:scheme});
                                cb&&cb(scheme);
                            }else{
                                alert(resp.error);
                            }
                        });
                }

                function updateSensor(marker){
                    $http.post("/api/httpProxy",{url:"/middleware/api/easylinkin/getSensorData",params:{mac:marker.mac}}).success(resp=>{
                        if(!resp.data){
                            return;
                        }
                        let params = JSON.parse(resp.data.params);
                        for(let j=params.length-1;j>=0;j--){
                            let param = params[j];
                            let index = $rootScope.sensorParamDict.codes.indexOf(param.code);
                            if(index==-1){
                                params.splice(j,1);
                            }else{
                                param.name = $rootScope.sensorParamDict.names[index];
                            }
                        }
                        marker. params = params;
                        marker.createDate = resp.data.createDate;
                    })
                }

                $scope.$on("delSchemeCache",function(event,schemeId){
                    var cache = $ctrl.schemeCache.find(n=>n.schemeId ==schemeId );
                    if(cache){
                        $ctrl.schemeCache.splice($ctrl.schemeCache.indexOf(cache),1);
                    }
                });

                $scope.delItem = function(marker){
                    confirm("确认删除描点"+marker.name+"？",function(){
                        //若marker 已有描点，清除此描点
                        let map = getMap($ctrl.curScheme.birdMap).map;
                        marker.objId && map.clearLayer("F1", marker.objId);
                        //如果有弹框，也关闭弹框，不管是哪个描点的
                        infowindow &&  infowindow.close();
                        $ctrl.curScheme.markers.splice($ctrl.curScheme.markers.indexOf(marker),1)
                        $scope.$applyAsync();
                    });
                }

                function processSensorWorkunit(data){
                    console.log(data);
                    let cameraMarker = $ctrl.curScheme.markers.find(n=>n.cameraCode);
                    if(cameraMarker){
                        if(!$ctrl.videoIndex){

                            let content =`<table style="width:100%;height: 100%">
                                    <tr><td><iframe class='popVideo' style="width:100%;height: 100%" src='${$rootScope.videoPrefix+cameraMarker.cameraCode}'> 
                                        </iframe></td>
                                        </tr>
                                       </table>`;
                            if(navigator.userAgent.indexOf('Firefox') >= 0){
                                //浏览器为火狐时, 样式稍稍不一样
                                content =`<table style="width:100%;height: 408px">
                                    <tr><td><iframe class='popVideo' style="width:100%;min-height: 400px;height: 400px" src='${$rootScope.videoPrefix+cameraMarker.cameraCode}'> 
                                        </iframe></td>
                                        </tr>
                                       </table>`;
                            }

                            layer.open({
                                type: 1,
                                title: [cameraMarker.name ||'视频直播', 'font-size:16px;'],
                                area: ['600px', '450px'],
                                offset: 'l',
                                shade: 0,
                                closeBtn: 1,
                                maxmin: true,
                                // scrollbar: false,
                                content: content,
                                success: function (layero, index) {
                                    $ctrl.videoIndex = index;
                                    layer.iframeAuto(index)
                                },
                                cancel: function (index, layero) {
                                    delete $ctrl.videoIndex;
                                }
                            });

                            /*layer.open({
                                type: 2,
                                title: ['视频直播', 'font-size:16px;'],
                                area: ['500px', '300px'],
                                offset: 'l',
                                shade: 0,
                                resize:false,
                                closeBtn: 1,
                                maxmin: true,
                                // scrollbar: false,
                                content: $rootScope.videoPrefix+cameraMarker.cameraCode, //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no'],
                                success: function (layero, index) {
                                    $ctrl.videoIndex = index;
                                    layer.iframeAuto(index)
                                },
                                cancel: function (index, layero) {
                                    delete $ctrl.videoIndex;
                                }
                            });*/
                        }
                    }
                    let sensor = $ctrl.curScheme.markers.find(n=>n.mac == data.sensor.mac);
                    if(sensor){
                        $ctrl.curMarker = sensor;
                        sensor.workunitInfo = data;
                        let markObj = $ctrl.curMapObj.map.getObjectById(sensor.objId);
                        // $ctrl.curMapObj.map.moveTo(markObj.position);
                        //$ctrl.TranCamera(markObj.position);
                        updateSensor(sensor);
                        var cnt =0;
                        var flag = setInterval((times)=>{
                            if(cnt>times){
                                clearInterval(flag);
                            }
                            if(cnt%2==0){
                                $ctrl.curMapObj.map.hiddenLayer("F1",sensor.objId)
                            }else{
                                $ctrl.curMapObj.map.showLayer("F1",sensor.objId)
                            }
                            cnt++;
                        },300,40)
                        showInfoWin(markObj);
                    }
                }

                app.ws.onmessage = function(evt) {
                    let data = JSON.parse(evt.data);
                    if(data && data.type == 'sensorWorkunit'){
                        processSensorWorkunit(data.msg);
                    }
                    console.log(evt);
                };
                /* app.socket.on('sensorWorkunit', function (data) {

                 });*/

                $ctrl.TranCamera = function (newPosition) {
                    /*TweenMax.to($ctrl.curMapObj.map.control.object.position, 3, {
                        x: newPosition.x + 30,
                        y: newPosition.y + 50,
                        z: newPosition.z + 30,
                        ease: Expo.easeNone, //缓动方式，easeNone匀速
                        onStart: function () {
                        }, //动画开始时执行函数
                        onUpdate: function () {
                        }, //动画每一步执行函数
                        onComplete: function () {
                        } //动画完成时的回调
                    });*/

                    TweenMax.to($ctrl.curMapObj.map.control.target, 3, {
                        x: newPosition.x,
                        y: newPosition.y + 1,
                        z: newPosition.z,
                        ease: Expo.easeNone
                    });
                }

                var infowindow ;
                function showInfoWin(markObj,position){
                    let map = getMap($ctrl.curScheme.birdMap).map;
                    //关闭其他信息窗
                    infowindow &&  infowindow.close();

                    let content;
                    if($ctrl.curMarker.workunitInfo){
                        content =`<div class="x_title">
                                <a href='javascript:void(0)' >${$ctrl.curMarker.name || ""}</a>
                            </div>`+$ctrl.curMarker.content;
                        content +=`
                        <p><label>异常工单：</label><span class='font-gray'>${$ctrl.curMarker.workunitInfo.workunit.wORKUNIT_NAME}</span></p>
                        <p><label>描述：</label><span class='font-gray'>${$ctrl.curMarker.workunitInfo.workunit.dESCRIPTION}</span></p>
                            `
                    }else if($ctrl.curMarker.cameraCode){
                        //添加视频播放div
                        let div =`<table style="width:100%;height: 100%">
                                    <tr><td><iframe class='popVideo' style="width:100%;height: 100%" src='$url$'> 
                                        </iframe></td>
                                         <td style="vertical-align: top!important;width: 30%">$content$</td>
                                        </tr>
                                       </table>`;
                        if(navigator.userAgent.indexOf('Firefox') >= 0){
                            //浏览器为火狐时, 样式稍稍不一样
                            div =`<table style="width:100%;height: 408px;background: white">
                                    <tr><td><iframe class='popVideo' style="width:100%;min-height: 400px;" src='$url$'> 
                                        </iframe></td>
                                         <td style="vertical-align: top!important;width: 30%">$content$</td>
                                        </tr>
                                       </table>`;
                        }
                        content =  div.replace("'$url$'",$rootScope.videoPrefix+$ctrl.curMarker.cameraCode).replace("$content$",$ctrl.curMarker.content)
                        layer.open({
                            type: 1,
                            title: [$ctrl.curMarker.name ||'视频直播', 'font-size:16px;'],
                            area: ['600px', '450px'],
                            offset: 'auto',
                            shade: 0,
                            closeBtn: 1,
                            maxmin: true,
                            // scrollbar: false,
                            content: content,
                            success: function (layero, index) {
                                layer.iframeAuto(index)
                            },
                            cancel: function (index, layero) {}
                        });
                        return;
                    }else if($ctrl.curMarker.circuitry){
                        content =`<div class="x_title">
                                <span >${$ctrl.curMarker.name || ""} </span>
                               <span class="btn-link" role="button" onclick="switchLight(`+$ctrl.curMarker.circuitry+`,true)" style="margin: 0 5px">开</span> 
                                <span class="btn-link" role="button" onclick="switchLight(`+$ctrl.curMarker.circuitry+`,false)" style="margin: 0 5px">关</span>
                            </div>`+$ctrl.curMarker.content;
                    }else{
                        content =`<div class="x_title">
                                <a href='javascript:void(0)' >${$ctrl.curMarker.name || ""}</a>
                            </div>`+$ctrl.curMarker.content;
                    }
                    infowindow = new AirocovMap.Controls.InfoWindow({
                        content:  content,
                        //信息窗内容，是一个dom

                        //position: airocovMap.screenCoordinates(curMa.position),  //三维场景坐标的投影到屏幕的坐标
                        //positionXYZ: curMa.position,  //三维场景坐标
                        //注: position和positionXYZ同时使用，会在指定三维坐标处生成信息窗，
                        //id和floor同时使用，会在指定楼层的指定id物体处生成信息窗。 id和floor属性存在时，优先使用id和floor。
                        //id: markObj.info.properties.userData.id,  //楼层的模型info.id或自定义id
                        position: map.screenCoordinates(markObj.position),
                        positionXYZ: position||markObj.position
                        /*  id: markObj.id,
                          floor: markObj.info.floor //楼层编号*/
                    })
                    //将信息窗添加到地图中
                    map.addControl(infowindow)
                    //实时对信息窗定位
                    infowindow.positioning()
                }

                $scope.setImgMarker = function(icon){
                    if($ctrl.curMarker){
                        let map = getMap($ctrl.curScheme.birdMap).map;
                        $ctrl.curMarker.imgMarker = icon.url;
                        addMarker(map,$ctrl.curMarker)
                    }else{
                        alert("请先选择左侧待描点按钮！");
                    }
                }

                $scope.saveMarkers = function(){
                    let unfinished;
                    switch ($ctrl.curScheme.schemeType.title) {
                        case "描点":
                            unfinished = $ctrl.curScheme.markers.filter(n=>!n.lnglat);
                            if(unfinished.length){
                                alert(unfinished.length +"个描点不存在经纬度！");
                                return;
                            }break;
                        case "划线":
                            unfinished = $ctrl.curScheme.markers.filter(n=>n.points.length<2);
                            if(unfinished.length){
                                alert(unfinished.length +"个线段未完成！");
                                return;
                            }break;
                    }
                    $http.post("../scheme/save",$ctrl.curScheme).success(function(resp, status, headers, config) {
                        if(resp.code ==0){
                            msg("保存成功!");
                        } else {
                            alert(resp.error);
                        }
                    })
                }

            }});



})();
