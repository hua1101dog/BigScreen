

(function () {
    "use strict";
    var app = angular.module("showApp")
        // 控制器
        .component("schemeDetail", {
            restrict: "E",
            bindings: {
                scheme: '<',
                readyToShow: '&'
            },
            templateUrl: '/show/v1/schemeDetail.html',
            controller: function ($scope, $rootScope, $http, $q) {

                var $ctrl = this;
                $ctrl.mapList = [];
                $ctrl.schemeCache = [];
                $scope.toggleMapMod = true;
                $scope.schemeId = '5cbd44c90e9a50358a8cba06'

                function getMap(mapId) {
                    return $ctrl.mapList.find(n => n.mapId == mapId);
                }

                function addMap(entity) {
                    let canvas = document.createElement("div");
                    canvas.setAttribute("id", entity.mapId);
                    canvas.setAttribute("class", "mapdiv");
                    document.getElementById("mapContainer").appendChild(canvas);
                    $(canvas).css("height", '1327');
                    $("#mapContainer>div.mapdiv:not([id='" + entity.mapId + "'])").css("display", "none");
                    $ctrl.mapList.push(entity);
                }

                var markers = [];
                let addMarker = function (map, marker, fn) {
                    //若marker 已有描点，清除此描点
                    map.clearLayer("F6", "marker");
                    new AirocovMap.Markers.ImageMarker({
                        imgMarker: marker.imgMarker, //图片路径
                        lnglat: marker.lnglat, //经纬度坐标
                        y: marker.height || 100, //三维坐标系坐标y值,
                        size: 1.8,
                        mapCenter: map.getMapCenter("F6"), //地图中心点,
                        userData: marker,
                        callback: function (imgMark) {
                            //将图片标注添加到地图
                            map.addToLayer(imgMark, "F6", "marker", true);
                            fn && fn()
                        }
                    })
                }

                function addTextMark(map, position, text, status, work) {
                    map.clearLayer("F6", "TextMark");
                    let color = ''
                    if (!work) {
                        color = '#E1B622'
                    } else {
                        if (status) {
                            color = '#2acfff'
                        } else {
                            color = '#cccccc'

                        }
                    }

                    let zoom = 0;
                    if (!work) {
                        zoom = 0.95
                    } else {
                        zoom = 0.85
                    }

                    //生成文字标注
                    // position.x = (position.x+282.396112)/0.692385;
                    // position.z = (position.z+54.300772)/-5.511312;

                    let textMark = new AirocovMap.Markers.TextMarker({
                        text: text, //标注内容
                        zoom: zoom, //文字大小缩放系数
                        color: color, //文字颜色
                        position: position, //三维坐标系位置
                        userData: {},
                        callback: function (textMark) {
                            //将文字标注添加到指定楼层的指定图层中
                            map.addToLayer(textMark, "F6", 'TextMark', true);
                        }
                    });
                }

                function drawMap(scheme) {

                    let bridMapId = '5cc266128a328d200f98145a';

                    $("#mapContainer>div.mapdiv:not([id='" + bridMapId + "'])").css("display", "none");
                    //现存地图中无此节点
                    let mapObj = getMap(bridMapId);
                    if (!mapObj) {
                        mapObj = {
                            mapId: bridMapId,
                            scheme: scheme
                        };
                        addMap(mapObj);
                        let map = new AirocovMap.Map({
                            //地图容器
                            container: document.getElementById(bridMapId),
                            // themeUrl: "/res/theme/fillcolor2.json",
                            logoSrc: "",
                            zoom: 3.8,
                            opacity: 0,
                            theta: 0,
                            //地图楼层列表
                            mapList: [{
                                name: "F6", //楼层名
                                mapUrl: "/free/mapDetail.json?id=" + bridMapId //地图路径
                            }]
                        });
                        //     window.layerIndex = layer.load(1, { shade: [0.2, '#000'] });
                        //   ;
                        mapObj.map = map;
                        mapObj.curMode = "2D"; //初始为3D
                        mapObj.mapPromiss = $q((resolve, reject) => map.event.on("loaded", () => resolve()))
                    } else {
                        $("#" + bridMapId).css("display", "");
                    }
                    mapObj.mapPromiss.then(() => {
                        mapObj.map.control.enableRotate = false;
                        mapObj.map.control.enablePan = false; //禁止移动和翻转
                        mapObj.map.control.enableZoom = false;
                        mapObj.map.addMarker = addMarker;
                        mapObj.map.addTextMark = addTextMark;

                        mapObj.map.setMeshStyle(["F6"], {
                            //房子
                            roomGroup: {
                                opacity: "1",
                                renderOrder: "1"
                            },
                            //地板
                            bottomGroup: {
                                opacity: "1"
                            },
                            //轮廓线
                            lineGroup: {
                                opacity: "0.1"
                            }
                        })

                        $rootScope.$emit('mapLoaded', mapObj.map);


                    });
                }

                $ctrl.$onInit = function () {
                }
                $ctrl.$onChanges = function (changes) {
                    drawMap();
                };

                $scope.$on("delSchemeCache", function (event, schemeId) {
                    var cache = $ctrl.schemeCache.find(n => n.schemeId == schemeId);
                    if (cache) {
                        $ctrl.schemeCache.splice($ctrl.schemeCache.indexOf(cache), 1);
                    }
                });












            }
        })

        .controller('showSpaceController', ['$scope', '$rootScope', '$http', '$interval', '$q', '$filter', function ($scope, $rootScope, $http, $interval, $q, $filter) {
            var csModelArray;
            var dwModelArray;
            var  dwUuidList;
            $rootScope.maploaded = false;
            $rootScope.map = null;
            var arr;
            let mapData = []
            let stop = false;
            $scope.showNum = 2 //table 展示几列
            $scope.personList = {}
            let nameList = ['沙龙区', '项目区', '研发区', '服务中心', '智能方案中心', '男卫', '女卫', '7号会议室', '茶水间']
            $rootScope.$on('mapLoaded', (evt, map) => {
                $rootScope.maploaded = true;
                $rootScope.map = map;
                getData()
                // arr = ['55d2e1b3-3be4-404c-933d-1a5ee46e1a45', '96cce602-0798-46cd-a1f1-08756a7b9703', '820b808e-6f2f-4608-8f96-962fd6c808ae', '81e63af6-ba39-4e3e-bd65-0e38ed768304'];
                // arr.push('4ed445ee-a2ff-486b-b5ec-2a7a55a07801', 'f2fa45c4-4c87-43a1-ab20-cab910c4b07f', '262f7ad5-e211-4e4b-b076-65c7e75401c0', 'b1cd63c0-07fe-4cf5-b73b-f000ebbdd748');
                // arr.push('f273b78a-18c6-4f57-b044-86b09164054f', '2df8209f-e6b7-456f-a2e2-4391223f73ae', '82a1840b-5e0e-4e7a-a708-a0a28d4eefa5', '10d99fca-94ec-4180-892f-3fb2c6b52491');
                // arr.push('c0addb31-b4de-4404-831c-50a1f094bd4c', '8d36f993-53c6-4b59-9f15-7765f1a8b418', 'ad57960a-1f17-40c3-abd7-563275011701');
                // arr.push('a56488df-1a5c-4d66-9ef8-aeb8a5a0efff', '51056d19-193d-414b-8031-ba081c7c590f', 'daa19b7f-03a1-4b7f-a90b-bbbc6ffdfc22');
                // arr.push('328cd8cf-29a9-4149-94de-747e204d8d69', '12fc2d5f-a2e9-42a3-80dc-2749f397f986', '01bcdd67-95cb-4090-805a-b5c6d3250ff4', 'ed4a8110-d40a-4822-b7c4-8df50b5f2d39');
                // arr.push('12611ab5-7421-4f24-a140-5260f35d1355', 'f717d3cf-77d8-4f67-a11c-c666af84526d', 'c12c4b8f-e323-497e-ab57-41d107f0d89d', '08ecab97-f819-4752-bb41-12e20817cc00');
                // arr.push('586156d6-11d4-4044-a438-5104af9dc690', 'b73dfbb8-b7bf-41ec-9199-61baf9a21900', 'c9c096ed-e12f-40d0-8802-a79217c29254', 'ae0cbcc9-3be2-41f6-9489-87c61705a09e');
                // arr.push('df203de6-3b78-4063-a2ae-37a294a3bafc', '73cb75cf-980b-4e4d-8283-d9108394c927', 'e16e3045-5715-428b-b04d-5f3059de047e');
                // arr.push('3b72f4f3-e8c4-42fd-8e73-978bee38b74c', 'd39d4718-ca78-424c-b079-0f9e9baa74e8', 'f50c8a6d-c4b4-4d91-a39b-ef647a957332');
                arr = ['2ee77efb-d856-4251-98ea-ca8341fc0aa6','43d4786b-83a9-47e6-9128-abbec514cba5','0238a55d-f725-4ef6-b38d-a7fb177aaacd','4aab4dd9-e9be-4be8-9204-0d4050fc73a1','3c9e2ce3-e2f8-472a-9bd5-1564ad522cfb','91a472bf-2a9c-437a-8d7d-e6fa2201be7d','9aa5bf6c-0fb0-4b14-aa36-9bcacd3af28a','80b6d0a5-fe79-43ac-9fad-5cbdc3cc0199'];
                csModelArray = map.getModeByArrayId(arr);



                dwUuidList   = ['7aa51b40-0886-4c73-ace1-24309a374c82','6f1b3df6-065f-4820-8b11-80ff58900356','b64eabb4-41aa-4ffb-af8d-332ad9b9d04e',
                                '406375c1-c4e5-48f1-9f4d-fe06fe93bde6','33595847-e1ff-4302-8def-12083dc4b48b','f34d4af9-36ad-4687-ac42-c9698fbab23e']
                dwModelArray = map.getModeByArrayId(dwUuidList);  
            })

            $scope.curTime = new Date();
            $scope.timeStrOne = $filter('date')($scope.curTime, 'yyyy') + '-' + $filter('date')(new Date(), 'MM') + '-' + $filter('date')(new Date(), 'dd');
            $scope.timeStrTwo = $filter('date')($scope.curTime, 'HH:mm');


            $interval(function () {
                $scope.curTime = new Date();
                $scope.timeStrOne = $filter('date')($scope.curTime, 'yyyy') + '-' + $filter('date')(new Date(), 'MM') + '-' + $filter('date')(new Date(), 'dd');
                $scope.timeStrTwo = $filter('date')($scope.curTime, 'HH:mm');


            }, 60000);

            $http.get("../free/getScheme?id=5cbd44c90e9a50358a8cba06").success(function (resp) {
                if (resp.code == 0) {
                    mapData = resp.data.markers
                    $scope.workNum = resp.data.markers.length
                    // Await(()=>{
                    //     resp.data.markers.forEach(n=>{ 
                    //         $rootScope.map.addMarker( $rootScope.map,n);
                    //         $rootScope.map.addTextMark( $rootScope.map,n.position,n.name,n.id);

                    //     });
                    // });
                }

            });


            function getData() {
                $http.get('/api/cacheTree/5cbe82ca3c8b2c584595fa8e').then((res) => {
                    var data = res.data;
                    $scope.inlineNum = 0
                    data.data && data.data.forEach(function (v) {
                        if (v.code == '0f') {
                            //工位总数
                            $scope.totalCnt = v.data.data

                        } else if (v.code == '0e') {
                            //考勤

                            mapData.forEach(n => {
                                v.data.data.data.forEach(v => {
                                    if (v.subject.name == n.name) {
                                        if (v.id !== 0) {
                                            n.status = true;
                                            $scope.inlineNum = $scope.inlineNum + 1;

                                        } else {
                                            n.status = false;

                                        }
                                    }


                                });

                                if (nameList.indexOf(n.name) >= 0) {
                                    //功能区

                                    n.isWork = false
                                } else {
                                    //工位
                                    n.isWork = true
                                }
                                $rootScope.map.addTextMark($rootScope.map, n.position, n.name, n.status, n.isWork);

                            })




                        } else if (v.code == '0g') {
                            //外勤人员

                            $scope.personList = v.data.data
                            // $scope.personList.data=[
                            //    {
                            //         "_id": "5cdcb5cab85e0c2062e630af",
                            //         "name": "胡志伟",
                            //         "startTime": "2019-05-16T00:30:00.000Z",
                            //         "endTime": "2019-05-17T09:30:00.000Z",
                            //         "__v": 0
                            //     }, {
                            //         "_id": "5cdcb5e4b85e0c2062e630b0",
                            //         "name": "李学兵",
                            //         "startTime": "2019-05-16T00:30:00.000Z",
                            //         "endTime": "2019-05-17T09:30:00.000Z",
                            //         "__v": 0
                            //     }, {
                            //         "_id": "5cdcb5fbb85e0c2062e630b1",
                            //         "name": "余家荣",
                            //         "startTime": "2019-05-16T00:30:00.000Z",
                            //         "endTime": "2019-05-17T09:30:00.000Z",
                            //         "__v": 0
                            //     }, {
                            //         "_id": "5cdcb6c1b85e0c2062e630b2",
                            //         "name": "汤婉",
                            //         "startTime": "2019-05-16T00:30:00.000Z",
                            //         "endTime": "2019-05-16T06:00:00.000Z",
                            //         "__v": 0
                            //     }, {
                            //         "_id": "5cdcb6e6b85e0c2062e630b3",
                            //         "name": "郑振亚",
                            //         "startTime": "2019-05-16T00:30:00.000Z",
                            //         "endTime": "2019-05-16T06:00:00.000Z",
                            //         "__v": 0
                            //     }, {
                            //         "_id": "5cdcb792b85e0c2062e630b4",
                            //         "name": "熊叶欣",
                            //         "startTime": "2019-05-16T00:30:00.000Z",
                            //         "endTime": "2019-05-16T06:00:00.000Z",
                            //         "__v": 0
                            //     }, {
                            //         "_id": "5cdcb7a8b85e0c2062e630b5",
                            //         "name": "姚奇",
                            //         "startTime": "2019-05-16T00:30:00.000Z",
                            //         "endTime": "2019-05-16T06:00:00.000Z",
                            //         "__v": 0

                            // }]

                            if ($scope.personList && $scope.personList.data) {
                                if ($scope.personList.data.length % 3 == 0 && $scope.personList.data.length > 3) {
                                    $scope.showNum = 3
                                } else if ($scope.personList.data.length % 2 == 0 && $scope.personList.data.length > 3) {
                                    $scope.showNum = 2
                                } else if ($scope.personList.data.length < 4) {
                                    $scope.showNum = 1
                                }
                            }

                        } else if(v.code == '0u'){
                            //厕位
                            // Stats 1 有人 2 没人
                            var hasPerson=[]; //有人
                            var hasNPerson=[]; //无人
                           $scope.manList= v.data.data[0] //男卫
                           $scope.wonmenList= v.data.data[1] //女卫
                        //    女1  7aa51b40-0886-4c73-ace1-24309a374c82
                        //    女2   6f1b3df6-065f-4820-8b11-80ff58900356
                        //    女3  b64eabb4-41aa-4ffb-af8d-332ad9b9d04e
                        //    男1 406375c1-c4e5-48f1-9f4d-fe06fe93bde6
                        //    男2   33595847-e1ff-4302-8def-12083dc4b48b
                        //    男3  f34d4af9-36ad-4687-ac42-c9698fbab23e
                           v.data.data.forEach(e=>{
                               e.roomList && e.roomList.forEach(person=>{
                                switch (person.id)
                                {
                                case 1:
                                    person.uuId="406375c1-c4e5-48f1-9f4d-fe06fe93bde6";
                                  break;
                                case 2:
                                    person.uuId="33595847-e1ff-4302-8def-12083dc4b48b";
                                  break;
                                case 3:
                                    person.uuId="f34d4af9-36ad-4687-ac42-c9698fbab23e";
                                  break;
                                case 4:
                                    person.uuId="7aa51b40-0886-4c73-ace1-24309a374c82";
                                  break;
                                case 5:
                                    person.uuId="6f1b3df6-065f-4820-8b11-80ff58900356";
                                  break;
                                case 6:
                                    person.uuId="b64eabb4-41aa-4ffb-af8d-332ad9b9d04e";
                                  break;
                                }
                                   if(person.status==1){
                                    hasPerson.push(person.uuId)
                                   }else{
                                    hasNPerson.push(person.uuId)  
                                   }
                                  
                               })
                           })
                          
                           
                           $rootScope.map.clearlightModel(dwModelArray);
                           $rootScope.map.highColorByUUID(hasPerson,'#6e1a17',dwModelArray);  

                        }
                    })

                })
            }

            function setSeakLight(uuidList) {
                if (uuidList != undefined) {
                    $rootScope.map.clearlightModel(csModelArray);
                    $rootScope.map.highColorByUUID(uuidList, 'rgba(152, 95, 39, 0.5)', csModelArray);
                }else{
                    $rootScope.map.clearlightModel(csModelArray);
                }
            }
            var timer = setInterval(function () {

                var s = document.getElementById("parking-msg-c").scrollTop;
                if (!stop)
                    document.getElementById("parking-msg-c").scrollTop += 1;
                var e = document.getElementById("parking-msg-c").scrollTop;

                if (document.getElementById("parking-msg-c").scrollTop % 41 == 0) {
                    if (!stop) {
                        stop = true;
                        setTimeout(() => {
                            stop = false;
                            if (s == e) {
                                document.getElementById("parking-msg-c").scrollTop = 0;
                            }
                        }, 1000)
                    }
                }

            }, 50);
            app.ws = new ReconnectingWebSocket("ws://bigscreen.ovuems.com", null, {
                debug: true,
                reconnectInterval: 5000
            })
            app.ws.onopen = function () {
                console.log("连接状态", app.ws);
                let message = {
                    spaceCode: '5cbe82ca3c8b2c584595fa8e',
                    type: "login"
                };
                app.ws.send(JSON.stringify(message));
                console.log("open");
            };

            app.ws.onmessage = function (evt) {
                let data = JSON.parse(evt.data);
                if (data && data.type == 'dataSync') {
                    var revData = data.msg.data
                    if (data.msg.code == '0f') {
                        //工位总数
                        $scope.totalCnt = revData

                    } else if (data.msg.code == '0e') {
                        //考勤
                        $scope.inlineNum = 0
                        mapData.forEach(n => {
                            revData.data.forEach(v => {
                                if (v.subject.name == n.name) {
                                    if (v.id !== 0) {
                                        n.status = true;
                                        $scope.inlineNum = $scope.inlineNum + 1;

                                    } else {
                                        n.status = false;

                                    }
                                }

                            });
                            if (nameList.indexOf(n.name) >= 0) {
                                //功能区

                                n.isWork = false
                            } else {
                                //工位
                                n.isWork = true
                            }
                            $rootScope.map.addTextMark($rootScope.map, n.position, n.name, n.status, n.isWork);

                        })
                    } else if (data.msg.code == '0g') {
                        //外勤人员
                        $scope.personList = revData

                        if ($scope.personList && $scope.personList.data) {
                            if ($scope.personList.data.length % 3 == 0 && $scope.personList.data.length > 3) {
                                $scope.showNum = 3
                            } else if ($scope.personList.data.length % 2 == 0 && $scope.personList.data.length > 3) {
                                $scope.showNum = 2
                            } else if ($scope.personList.data.length < 4) {
                                $scope.showNum = 1
                            }
                        }

                    }  else if(data.msg.code == '0u'){
                        //厕位
                        // Stats 1 有人 2 没人
                        var hasPerson=[]; //有人
                        var hasNPerson=[]; //无人
                    //    $scope.manList= v.data.data[0] //男卫
                    //    $scope.wonmenList= v.data.data[1] //女卫
                    revData.forEach(e=>{
                           e.roomList && e.roomList.forEach(person=>{
                            switch (person.id)
                            {
                            case 1:
                                person.uuId="406375c1-c4e5-48f1-9f4d-fe06fe93bde6";
                              break;
                            case 3:
                                person.uuId="33595847-e1ff-4302-8def-12083dc4b48b";
                              break;
                            case 2:
                                person.uuId="f34d4af9-36ad-4687-ac42-c9698fbab23e";
                              break;
                            case 5:
                                person.uuId="7aa51b40-0886-4c73-ace1-24309a374c82";
                              break;
                            case 6:
                                person.uuId="6f1b3df6-065f-4820-8b11-80ff58900356";
                              break;
                            case 4:
                                person.uuId="b64eabb4-41aa-4ffb-af8d-332ad9b9d04e";
                              break;
                            }
                               if(person.status==1){
                                hasPerson.push(person.uuId)
                               }else{
                                hasNPerson.push(person.uuId)  
                               }
                           })
                       })
                       
                       $rootScope.map.clearlightModel(dwModelArray);
                       $rootScope.map.highColorByUUID(hasPerson,'#6e1a17',dwModelArray);  
                       

                    }
                } else if (data && data.type == 'personSync') {
                    var revData = data.msg
                    // revData && revData.forEach(e=>{
                    //     if(e.status ==1)
                    //     //正常
                    //     $rootScope.map.highColorByUUID(e.listGroup, "rgba(40, 71, 109, 1)");
                    //     else
                    //     $rootScope.map.highColorByUUID(e.listGroup, "rgba(152, 95, 39, 1)");   
                    // })
                    //if (revData.listUuid.length > 0) {
                        setSeakLight(revData.listUuid);
                    //}
                }

            };


        }]);
})();