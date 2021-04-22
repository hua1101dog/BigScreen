/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('schemeCtrl', function ($scope,$rootScope, $http,$uibModal,fac,$timeout) {
        $scope.pconfig = {showMap:false};
        $scope.showMapDetail = function(schemeId){
            console.log(schemeId);
            $scope.pconfig.schemeId = schemeId;

        }

        $scope.hideMap = function(){
            delete $scope.pconfig.schemeId ;
            $scope.pconfig.showMap = false;
        }

        $scope.$on("schemeDetail",(event,data)=>{
            switch (data) {
                case "showMap": $scope.pconfig.showMap = true;break;
            }
        })

    });

    app.component("schemeDetail",
         {
            restrict: "E",
            bindings: {
                schemeId:'<',
                readyToShow:'&'
            },
            templateUrl: 'view/scheme/schemeDetail.html',
            controller: function($scope,$rootScope, $http,$uibModal,$q,fac) {

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
                    $(canvas).css("height",window.innerHeight-70);
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
                        let map = new AirocovMap.Map({
                            //地图容器
                            container: document.getElementById(bridMapId),
                            themeUrl: "/res/theme/fillcolor2.json",
                            logoSrc: "/pic/logo_ovu.png",
                            //地图楼层列表
                            mapList: [
                                {
                                    name: "F1", //楼层名
                                    mapUrl: "/free/mapDetail.json?id="+bridMapId //地图路径
                                }
                            ]
                        });
                        addClickEvent(map);
                        mapObj.map = map;
                        mapObj.curMode = "2D";//初始为2D
                        mapObj.mapPromiss = $q((resolve, reject)=>  map.event.on("loaded", ()=> resolve()))
                    }else{
                        $("#"+bridMapId).css("display","");
                    }
                    mapObj.mapPromiss.then(()=>{
                        $scope.$emit("schemeDetail","showMap");
                        if( $ctrl.curScheme != scheme){
                            /*$ctrl.curScheme && $ctrl.curScheme.markers.forEach(n=> mapObj.map.clearLayer("F1", n.objId))*/
                            mapObj.map.clearFloorLayer("F1", false);
                            $ctrl.curScheme = scheme;
                            $ctrl.curMapObj = mapObj;
                            delete  $ctrl.curMarker ;
                            scheme.markers.forEach(n=>addMarker(mapObj.map,n))
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
                                y: marker.height||100, //三维坐标系坐标y值,
                                size: 1.5,
                                mapCenter: map.getMapCenter("F1"), //地图中心点,
                                userData: marker,
                                callback: function (imgMark) {
                                    //将图片标注添加到地图
                                    marker.objId = imgMark.id;
                                    marker.position = imgMark.position;
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
                            //marker.objId =
                            marker.objId  = path.id;
                            //添加到对应楼层中图层 // marker.objId
                            map.addToLayer(path, "F1",marker.objId, true)
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
                                opacity: angular.isNumber(marker.opacity)?marker.opacity:0.5,
                                //围栏线的颜色
                                lineColor: "#ff0000",
                                //在围栏上显示的文字,如文字为空将创建普通围栏
                                str: marker.name,
                                //文字大小
                                size: 60,
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
                            case '2D': $ctrl.curMapObj.map.mapTo2D();break;
                            case '3D': $ctrl.curMapObj.map.mapTo3D();break;
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

                window.showVideo = function(cameraCode){
                        //添加视频播放div
                        /*let div =`<table style="width:100%;height: 100%">
                                    <tr><td><iframe class='popVideo' style="width:100%;height: 100%" src='$url$'>
                                        </iframe></td>
                                         <td style="vertical-align: top!important;width: 30%">$content$</td>
                                        </tr>
                                       </table>`;
                        content =  div.replace("'$url$'",).replace("$content$",$ctrl.curMarker.content)*/
                        layer.open({
                            type: 2,
                            title: [$ctrl.curMarker.name ||'视频直播', 'font-size:16px;'],
                            area: ['600px', '450px'],
                            offset: 'auto',
                            shade: 0,
                            closeBtn: 1,
                            maxmin: true,
                            // scrollbar: false,
                            content: $rootScope.videoPrefix+cameraCode,
                            success: function (layero, index) {
                                layer.iframeAuto(index)
                            },
                            cancel: function (index, layero) {}
                        });
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
                        }else if($ctrl.curMarker){
                            switch($ctrl.curMarker.type) {
                                case "text":
                                case "point":
                                    $ctrl.curMarker.lnglat = e.lnglat;
                                    $ctrl.curMarker.height = e.position.y>0?(e.position.y+2):5;
                                    addMarker(map,$ctrl.curMarker,()=>$scope.$applyAsync())
                                    break;
                                case "event":
                                    $ctrl.curMarker.targetId = e.target.info.properties.uuid;
                                    $ctrl.curMarker.targetType = e.type;
                                    msg($ctrl.curMarker.name+"绑定目标"+e.type+"(id:"+e.target.info.properties.uuid+")成功！");
                                    $scope.$applyAsync();
                                    break;
                                case "fence":
                                case "path":
                                    if($ctrl.curMarker.curPoint){
                                        angular.extend($ctrl.curMarker.curPoint,[e.position.x,e.position.z]);
                                    }else{
                                        $ctrl.curMarker.points.push([e.position.x,e.position.z]);
                                    }
                                    addMarker(map,$ctrl.curMarker,()=>{
                                        $scope.$applyAsync();
                                    })
                                    break;
                            }
                        }else if($ctrl.curScheme.markers.find(n=>{return n.targetId == e.target.info.properties.uuid && n.targetType == e.type})){
                            let marker = $ctrl.curScheme.markers.find(n=>{ return n.targetId == e.target.info.properties.uuid && n.targetType == e.type});
                            if(marker.icons && marker.icons.length){
                                $rootScope.showPhoto(marker.icons[0].url);
                                $scope.$applyAsync();
                            }
                        } else {
                            alert("请先选择左侧待描点按钮！");
                        }
                    });
                }
                $ctrl.$onInit = function () {
                    $("#mapContainer").css("height",window.innerHeight-70);
                    console.log("$onInit"+$scope.schemeId);
                }
                $ctrl.$onChanges = function (changes) {
                    console.log("$onChanges"+changes.schemeId.currentValue);
                    if(changes.schemeId.currentValue){
                        infowindow &&  infowindow.close();
                        $scope.schemeId = changes.schemeId.currentValue;
                        getScheme($scope.schemeId,drawMap);
                    }
                };

                $ctrl.getMarkerClass=function(item){
                    switch (item.type) {
                        case "text":
                        case "point":return {'btn-warning':!item.lnglat,'btn-success':item.lnglat && item == $ctrl.curMarker,'active':item == $ctrl.curMarker};
                        case "path":return {'btn-warning':item.points.length<2,'btn-success':item.points.length>=2 && item == $ctrl.curMarker,'active':item == $ctrl.curMarker};
                        case "fence":return {'btn-warning':item.points.length<3,'btn-success':item.points.length>=3 && item == $ctrl.curMarker,'active':item == $ctrl.curMarker};
                        case "event":return {'btn-warning':!item.targetId,'btn-success':item.targetId && item == $ctrl.curMarker,'active':item == $ctrl.curMarker};
                    }
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
                           }
                           $ctrl.schemeCache.push({schemeId:schemeId,scheme:scheme});
                           cb&&cb(scheme);
                       }else{
                           alert(resp.error);
                       }
                    });
                }

                $scope.$on("delSchemeCache",function(event,schemeId){
                    var cache = $ctrl.schemeCache.find(n=>n.schemeId ==schemeId );
                    if(cache){
                        $ctrl.schemeCache.splice($ctrl.schemeCache.indexOf(cache),1);
                    }
                });

                $scope.$on("delSchemeTypeCache",function(event,schemeTypeId){
                    for(let i = $ctrl.schemeCache.length-1;i>=0;i--){
                        if($ctrl.schemeCache[i].scheme.schemeType._id == schemeTypeId){
                            $ctrl.schemeCache.splice(i,1);
                        }
                    }
                });

                function subPlus1(name){
                    let matches = (name+"").match(/\d+$/);
                    if(matches){
                        return name.substr(0,matches.index)+(parseInt(matches[0])+1);
                    }
                    return name+1;
                }
                $scope.editItem = function(item,markType){
                    if(!item){
                        //直接添加新marker.
                        let sameKinds = $ctrl.curScheme.markers.filter(n=>n.type==markType.type);
                        let name;
                        if(sameKinds && sameKinds.length){
                            let lastName = sameKinds[sameKinds.length-1].name;
                            name = subPlus1(lastName);
                            while(sameKinds.find(n=>n.name ==name )){
                                name = subPlus1(name);
                            }
                        }else{
                            name = markType.title+1;
                        }
                        let marker = {name:name,type:markType.type};
                        if(sameKinds.length>0){
                            marker.circuitry = sameKinds[sameKinds.length-1].circuitry;
                        }
                        if(['path','fence'].indexOf(markType.type)>-1 ){
                            marker.points = [];
                        }
                        markType.icons && markType.icons.length && (marker.imgMarker = markType.icons[0].url);
                        $ctrl.curScheme.markers.push(marker);
                        $ctrl.curMarker = marker;
                        $ctrl.curMarkType = markType;
                        return;
                    }
                    var modal = $uibModal.open({
                        animation: true,
                        size:'',
                        templateUrl: 'view/scheme/marker.modal.html',
                        controller: 'markerEditCtrl'
                        ,resolve: {item: angular.extend({},item),markType:()=>markType}
                    });
                    modal.result.then(function (data) {
                        if(item){
                            angular.extend(item,data);
                            addMarker($ctrl.curMapObj.map,item);
                        }else{
                            markType.icons && markType.icons.length && (data.imgMarker = markType.icons[0].url);
                            $ctrl.curScheme.markers.push(data);
                            $ctrl.curMarker = data;
                            $ctrl.curMarkType = markType;
                        }
                    });
                }

                $scope.selectItem = function(item){
                    if($ctrl.curMarker == item){
                       delete $ctrl.curMarker ;
                    }else{
                        $ctrl.curMarker = item;
                        $ctrl.curMarkType = $ctrl.curScheme.schemeType.types.find(n=>n.type == item.type);
                        let map = getMap($ctrl.curScheme.birdMap).map;
                        let markObj = map.getObjectById(item.objId);
                        let position = undefined;
                        switch (item.type) {
                            case "fence":
                            case "path":
                                position = {x:item.points[0][0],y:0,z:item.points[0][1]};
                                $ctrl.curMarker.points.forEach((point,index)=>addTextMark(map,$ctrl.curMarker.objId,{x:point[0],y:101,z:point[1]},index+1));break;
                            case "event":
                                map.highLightByUUID(item.targetId, "#0099FF", true);break;
                        }
                        if(markObj.position){
                            showInfoWin(markObj,position);
                        }
                    }
                };

                $scope.delItem = function(marker){
                    confirm("确认删除描点"+marker.name+"？",function(){
                        //若marker 已有描点，清除此描点
                        let map = getMap($ctrl.curScheme.birdMap).map;
                        marker.objId && map.clearLayer("F1", marker.objId);
                        //如果有弹框，也关闭弹框，不管是哪个描点的
                        infowindow &&  infowindow.close();

                        $ctrl.curScheme.markers.splice($ctrl.curScheme.markers.indexOf(marker),1);
                        if($ctrl.curMarker == marker){
                            delete $ctrl.curMarker;
                        }
                        if($ctrl.curScheme.schemeType.isLight){
                            //如果当前节点是电灯
                            let markType = $ctrl.curScheme.schemeType.types.find(m=>m.type == "point");
                            if(markType.icons && markType.icons.length>=2){
                                addCircuitry(map,marker,markType.icons[1]);
                            }
                        }
                        $scope.$applyAsync();
                    });
                }

                $ctrl.selectPoint = function(marker,point){
                    if(marker.curPoint == point){
                        delete marker.curPoint;
                    }else{
                        marker.curPoint = point
                    }
                }

                $ctrl.delPoint=function(point){
                    event.stopPropagation();
                    if($ctrl.curMarker.curPoint == point){
                        delete $ctrl.curMarker.curPoint;
                    }
                    $ctrl.curMarker.points.splice($ctrl.curMarker.points.indexOf(point),1)
                    addMarker($ctrl.curMapObj.map,$ctrl.curMarker)
                }


                var infowindow ;
                function showInfoWin(markObj,position){
                    let map = getMap($ctrl.curScheme.birdMap).map;
                        //关闭其他信息窗
                    infowindow &&  infowindow.close();

                    let content;
                   if($ctrl.curMarker.circuitry){
                        content =`<div class="x_title">
                                <a href='javascript:void(0)' >${$ctrl.curMarker.name || ""}</a>
                                <span class="btn-link" onclick="switchLight(`+$ctrl.curMarker.circuitry+`,true)" style="margin: 0 5px">开</span> 
                                <span class="btn-link" onclick="switchLight(`+$ctrl.curMarker.circuitry+`,false)" style="margin: 0 5px">关</span>
                            </div>`+$ctrl.curMarker.content;
                    }else{
                        content =`<div class="x_title">
                                <a href='javascript:void(0)' >${$ctrl.curMarker.name || ""}</a>
                                <span class="btn-link" onclick="showVideo('${$ctrl.curMarker.cameraCode}')" style="margin: 0 5px">${$ctrl.curMarker.cameraCode?'直播':''}</span> 
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
                    let unfinished = $ctrl.curScheme.markers.reduce((ret,n)=>{
                        switch (n.type) {
                            case "point":!n.lnglat && ret.point++;break;
                            case "path":n.points.length<2 && ret.path++;break;
                            case "fence":n.points.length<2 && ret.fence++;break;
                        };return ret;
                    },{point:0,path:0,fence:0})
                    if(unfinished.point){
                        alert(unfinished.point +"个描点不存在经纬度！");return;
                    }else if(unfinished.fence){
                        alert(unfinished.fence +"个围栏未完成！");return;
                    }else if(unfinished.path){
                        alert(unfinished.path +"个线段未完成！");return;
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

    app.directive("schemeList", function() {
        return {
            restrict: "E",
            scope: {
                config:"<?",
                showMapDetail:"&"
            },
            templateUrl: 'view/scheme/schemeList.html',
            controller: function($scope,$rootScope, $http,$uibModal,fac) {
                $scope.search = {};
                $scope.pageModel = {};
                //第一个分类打开
                $scope.categoryDict = $.extend(true,[],$rootScope.categoryDict);

                $scope.categoryDict[0].open = true;

                $scope.find = function(pageNo){
                    if($scope.curType){
                        $scope.search.schemeTypeId = $scope.curType._id;
                    }else{
                        delete $scope.search.schemeTypeId;
                    }
                    $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
                    fac.getPageResult("../scheme/list",$scope.search,function(data){
                        $scope.pageModel = data;
                    });
                };

                $scope.selectType = function(type){
                    if($scope.curType==type){
                        delete $scope.curType;
                        return;
                    }
                    $scope.curType = type;
                    $scope.find(1);

                }

                function getSchemeTypeList(){
                    $http.get("../schemeType/list").success(function(resp){
                        if(resp.code === 0){
                            $scope.typeList = resp.data;
                            if($scope.typeList.length){
                                if($scope.curType){
                                    $scope.curType = $scope.typeList.find(n=>n._id == $scope.curType._id);
                                }else{
                                    $scope.find(1);
                                   // $scope.selectType($scope.typeList[0])
                                }
                            }
                            $("#schemeTypeScroll").css("height",window.innerHeight-200);
                        }else{
                            alert(resp.msg);
                        }
                    })
                }
                getSchemeTypeList();

                $scope.editType = function(type,category){
                    let copy = angular.extend({},type);
                    if(category){
                        copy.category = category[0];
                    }
                    var modal = $uibModal.open({
                        animation: true,
                        size:'lg',
                        templateUrl: 'view/scheme/schemeType.modal.html',
                        controller: 'schemeTypeCtrl'
                        ,resolve: {type: copy,typeList:function(){return $scope.typeList}}
                    });
                    modal.result.then(function (data) {
                        if(type){
                            $rootScope.$broadcast("delSchemeTypeCache",type._id);
                        }
                        getSchemeTypeList();
                    });
                }

                $scope.delType = function(type){
                    $http.get("../scheme/existScheme?typeId="+type._id).success(function(resp){
                        if(resp.code ==0){
                            if(resp.data ==1){
                                alert(type.name+"类型下存在方案，请清空后再删除！");
                            }else{
                                confirm("确认删除方案分类"+type.name+"？",function(){

                                    $http.get("../schemeType/del?id="+type._id).success(function(resp){
                                        if(resp.code === 0){
                                            $scope.typeList.splice($scope.typeList.indexOf(type),1);
                                            if($scope.curType == type){
                                                $scope.typeList.length && ($scope.selectType($scope.typeList[0]))
                                            }
                                        }else{
                                            alert(resp.msg);
                                        }
                                    })
                                });
                            }
                        }
                    })
                }

                $scope.editScheme = function(item){
                    var modal = $uibModal.open({
                        animation: true,
                        size:'lg',
                        templateUrl: 'view/scheme/scheme.modal.html',
                        controller: 'schemeEditCtrl'
                        ,resolve: {item: angular.extend({},item),schemeTypeList:function(){return $scope.typeList}}
                    });
                    modal.result.then(function (data) {
                        if(item._id){
                            $rootScope.$broadcast("delSchemeCache",item._id);
                        }
                        $scope.find();
                    });
                }

                $scope.copyScheme = function(item){
                    confirm("确认复制该方案吗？",function(){

                        $http.get("../scheme/copy?schemeId="+item._id).success(function(resp, status, headers, config) {
                            if(resp.code ==0){
                                $scope.find();
                                msg("保存成功!");
                            } else {
                                alert(resp.error);
                            }
                        })
                    });
                }

                $scope.del = function(item){
                    confirm("确认删除该方案吗？",function(){
                        $http.get("../scheme/del?id="+item._id).success(function(resp){
                            if(resp.code === 0){
                                $scope.find();
                            }else{
                                alert(resp.msg);
                            }
                        })
                    });
                }
            }
        };
    });




    app.controller('schemeTypeCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,$uibModal,fac,type) {
        type.types = type.types||[];
        $scope.item = type;


        $scope.markerTypeDict = $.extend(true,[],$rootScope.markerTypeDict);
        $scope.markerTypeDict.forEach(n=>{
                var markType = type.types.find(m=>m.type == n[0]);
                if(markType){ n.chosen = true;
                              n.icons = markType.icons;
                              //点的额外息
                              if(n[0]=="point"){
                                  angular.extend(n,markType);
                                  /*n.isLight = markType.isLight;
                                  n.hasSector = markType.hasSector;
                                  n.direction = markType.direction;
                                  n.arc = markType.arc;*/
                              }
                }
        })

        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            item.types = $scope.markerTypeDict.reduce((ret,n) => {if(n.chosen){
                ret.push(angular.extend({type:n[0]},n))};return ret;},[])
            $http.post("../schemeType/save",item).success(function(resp, status, headers, config) {
                if(resp.code ==0){
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(resp.error);
                }
            })
        }
    });

    //描点弹框
    app.controller('markerEditCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,fac,item,markType) {
        if(['path','fence'].indexOf(markType.type)>-1 ){
            item.points = item.points||[];
        }
        item.type = markType.type;
        $scope.item = item;
        $scope.markType = markType;
        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $uibModalInstance.close(item);
        }
    });


    app.controller('schemeEditCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,$q,fac,item,schemeTypeList) {
        $scope.schemeTypeList = schemeTypeList;
        item.policyList = item.policyList||[];
        $scope.item = item;
        $scope.temp = item.birdMap;
        item.schemeType && (item.schemeType= item.schemeType._id);

       /* $http.get("../scheme/getById?id="+item._id).success(function(resp){
            alert(resp);
        })*/

        $scope.resetMap = function(host,node){
            delete $scope.temp;
        }

        $scope.findMap = function(spaceCode,val){
            if(!spaceCode){
                return;
            }
            var deferred = $q.defer()
            var param = {spaceCode:spaceCode,name:val};
            $.extend(param,{currentPage:1,pageSize:10});
            fac.getPageResult("../birdMap/list",param,function(pageModel){
                deferred.resolve(pageModel.data);
            });
            return deferred.promise;
        };

        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            if($scope.temp){
                item.birdMap = $scope.temp._id;
            }
            $http.post("../scheme/save",item).success(function(resp, status, headers, config) {
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