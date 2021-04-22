(function() {
    "use strict";
    var app = angular.module("showApp")
.controller('showManegeController',['$scope', '$rootScope', '$http', '$interval','$q','$filter',function($scope, $rootScope, $http,$interval, $q,$filter) {
    $scope.pconfig = {};
    let stop=false;
    let stop_v=false;
    $scope.showScheme = function(scheme){
        console.log(scheme);
        $scope.pconfig.scheme = scheme;
    }
    var timer;
    $scope.weatherConfig = [
        {
            name:'阴',
            url:'../pic/intelliDept/yintian.png'
        },
        {
            name:'晴',
            url:'../pic/intelliDept/qing.png'
        },
        {
            name:'多云',
            url:'../pic/intelliDept/duoyun.png'
        },
        {
            name:'小雨',
            url:'../pic/intelliDept/xiaoyupng'
        },
        {
            name:'中雨',
            url:'../pic/intelliDept/zhongyu.png'
        },
        {
            name:'大雨',
            url:'../pic/intelliDept/dayu.png'
        },
        {
            name:'雨夹雪',
            url:'../pic/intelliDept/yujiaxue.png'
        },
        {
            name:'小雪',
            url:'../pic/intelliDept/xiaoxue.png'
        },
        {
            name:'中雪',
            url:'../pic/intelliDept/zhongxue.png'
        },
        {
            name:'大雪',
            url:'../pic/intelliDept/daxue.png'
        },
   

];
    timer=setInterval(function(){
        
        var s = document.getElementById("parking-msg-c").scrollTop;
        var v = document.getElementById("visitor-msg-c").scrollTop;
        if (!stop)
            document.getElementById("parking-msg-c").scrollTop += 1;
        var e = document.getElementById("parking-msg-c").scrollTop;
             if(!stop_v)
             document.getElementById("visitor-msg-c").scrollTop += 1;
             var e_v = document.getElementById("visitor-msg-c").scrollTop;
        if (document.getElementById("parking-msg-c").scrollTop % 35 == 0) {
            if(!stop){
                stop = true;
                setTimeout(()=>{
                    stop = false;
                    if(s==e){
                        document.getElementById("parking-msg-c").scrollTop=0;
                    }
                },10000)
            }
        }
        if (document.getElementById("visitor-msg-c").scrollTop % 35 == 0) {
            if(!stop_v){
                stop_v = true;
                setTimeout(()=>{
                    stop_v = false;
                    if(v==e_v){
                        document.getElementById("visitor-msg-c").scrollTop=0;
                    }
                },10000)
            }
        }
    }, 50);
    $scope.curTime = new Date();
    $scope.timeStrOne = $filter('date')($scope.curTime, 'yyyy') + '-' + $filter('date')(new Date(), 'MM') + '-' + $filter('date')(new Date(), 'dd');
    $scope.timeStrTwo = $filter('date')($scope.curTime, 'HH:mm');
    $scope.timeStrThree= '周'+'日一二三四五六'.charAt(new Date().getDay());
    $interval(function () {
        $scope.curTime = new Date();
        $scope.timeStrOne = $filter('date')($scope.curTime, 'yyyy') + '-' + $filter('date')(new Date(), 'MM') + '-' + $filter('date')(new Date(), 'dd');
        $scope.timeStrTwo = $filter('date')($scope.curTime, 'HH:mm');
        $scope.timeStrThree= '周'+'日一二三四五六'.charAt(new Date().getDay()); 
    }, 60000);

    function slide3() {
        let copy2 = angular.copy($scope.ac_class);
        let ls2 = copy2.pop();
        copy2.unshift(ls2);
        $scope.ac_class = copy2;
    }
    function setAC_class(list) {
        if (list.length == 2) {
            list.push(list[0]);
            list.push(list[1]);
        }
        let arr = [];
        list.forEach((v, i) => {
            if (i < 2)
                arr.push(i);
            else
                arr.push(-1);

        });

        $scope.ac_class = arr;
      

        if ($scope.timer2)
            $interval.cancel($scope.timer2);

        $scope.timer2 = $interval(() => {
            slide3();
        }, 9000);
    }
    function slide7() {
        let copy = angular.copy($scope.bp_class2);

        let ls = copy.pop();
        copy.unshift(ls);

        $scope.bp_class2 = copy;
    }

    function setBP_class2(photos) {
        $scope.mutiPic = true;
        if (photos.length < 4)
        $scope.mutiPic = false;


        let arr = [];
        photos.forEach((v, i) => {
            if (i < 4)
                arr.push(i);
            else
                arr.push(-1);

        });

        $scope.bp_class2 = arr;
        if ($scope.timer7)
            $interval.cancel($scope.timer7);

            $scope.timer7 = $interval(() => {
            slide7();
        }, 3000);
    }
    function getTime(time){
        var x=''
        switch (time+1)
          {
          case 1:
            x="8:30";
            break;
          case 2:
            x="9:00";
            break;
          case 3:
            x="9:30";
            break;
          case 4:
            x="10:00";
            break;
          case 5:
            x="10:30";
            break;
          case 6:
            x="11:00";
            break;
            case 7:
            x="11:30";
            break;
            case 8:
            x="12:00";
            break;
            case 9:
            x="12:30";
            break;
            case 10:
            x="13:00";
            break;
            case 11:
            x="13:30";
            break;
            case 12:
            x="14:00";
            break;
            case 13:
            x="14:30";
            break;
            case 14:
            x="15:00";
            break;
            case 15:
            x="15:30";
            break;
            case 16:
            x="16:00";
            break;
            case 17:
            x="16:30";
            break;
            case 18:
            x="17:00";
            break;
            case 19:
            x="17:30";
            break;
            case 20:
            x="17:30";
            break;
            case 21:
            x="18:00";
            break;
            case 22:
            x="18:30";
            break;
           
        
          }
        return x
     }
     //echarts
     function initEngery(data1, data2,data3) {
        var myChartEngergy = echarts.init(document.getElementById('engergy'));
        var engergyOption = {
            xAxis: [
                {
                    type: 'category',
                    data: data1,
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel:{  
                        interval:0,//横轴信息全部显示  
                        rotate:-30,//-30度角倾斜显示 
                        textStyle : { // 属性lineStyle控制线条样式
                            
                            color: 'rgba(151, 205, 255, 1)',
                            fontFamily:'MicrosoftYaHei',
                            fontSize : 12
                        } 
                   },  
                   axisLine:{  
                       lineStyle:{  
                           color:'rgba(151, 205, 255, 1)',  
                        //    width:1,//这里是为了突出显示加上的  
                       }  
                   } 
                }
            ],
            yAxis: 
                {
                    type: 'value',
                    name: 'KWH',
                  
                    splitLine: {  show: false },
                    axisLine:{  
                        lineStyle:{  
                            color:'rgba(151, 205, 255, 1)',  
                           
                        }  
                    } ,
                    axisLabel:{  
                        textStyle : { // 属性lineStyle控制线条样式
                            color: 'rgba(98, 137, 191, 1)',
                            fontSize : 12,
                            fontFamily:'MicrosoftYaHei'
                        } 
                   }, 
                   
                },
            series: [
                {
                    type:'bar',
                     itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: "rgba(0, 99, 248, 1)" // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: "rgba(132, 230, 255, 1)" // 100% 处的颜色
                    }], false)
                }
            },
                    data:data2,
                    barWidth : 11,//柱图宽度
                },
                
                {
                    type:'line',
                    symbol: "none",
                    smooth:true,
                     itemStyle: {
                    normal:{
                //    color: "#386db3",//折线点的颜色
                    lineStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: "rgba(26,204,108,1)" // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: "rgba(255,234,123,1)" // 100% 处的颜色
                    }], false),//折线的颜色
                    width:3
                  }
                }
        },
                    data:data3
                }
            ]
                
        };
        myChartEngergy.setOption(engergyOption);
        //图标自适应大小
        window.addEventListener('resize', function () {
            myChartEngergy.resize();

        });
    }
 
     function getData(){
        $http.get('/api/cacheTree/5cbfbd931d8f0e63b039d8aa').then((res) => {
            var data=res.data;
            data.data && data.data.forEach(function(v){
                if(v.code=='0i'){
                    //室内温度
                
                    var str=v.data.data.params
                   var obj=JSON.parse(str)
                   $scope.temperatureValue=obj[0].val;
                   $scope.humidity=obj[1].val
                   
    
                }else if(v.code=='0j'){
                    //项目节点
                    $scope.projectList=v.data.data.data;  
    
                }else if(v.code=='0k'){
                    //接待
                   $scope.visitorList=v.data.data.data;
               
                 
                }else if(v.code=='0l'){
                    //2.5
                   $scope.pm=v.data.data.pm
                   
                }else if(v.code=='0o'){
                      //活动
                      $scope.activeList=v.data.data
                      setAC_class($scope.activeList);
                  
                     
                }else if(v.code=='0n'){
                    //天气
                    $scope.weather=v.data.data;
                    $scope.weather.weatherType=$scope.weatherConfig[$scope.weather.weatherType]
                  
    
                }else if(v.code=='0m'){
                    //能耗
                    $scope.engery=v.data.data.list[0];
                    $scope.engery.prevMomPercentValue=$scope.engery.prevMomPercentValue.replace("\-","")
                    
                }else if(v.code=='0p'){
                    //厕所
                    $scope.toilet=v.data.data;
                    v.data.data.forEach((v)=>{
                      if(v.name=='女卫生间'){
                       $scope.womenList=v.roomList
                      }else{
                        $scope.menList=v.roomList  
                      }
                    })
                    $scope.womenInline=$scope.womenList.filter(item => item.status===1 ).length;
                    $scope.womenOnline=$scope.womenList.filter(item => item.status===2 ).length; //
                    $scope.menInline=$scope.menList.filter(item => item.status===1 ).length;
                    $scope.menOnline=$scope.menList.filter(item => item.status===2 ).length;
                 
                  
                }else if(v.code=='0q'){
                    let tomorrowList=[];
                    v.data.data[0] && v.data.data[0].roomReserveListTomorrow && v.data.data[0].roomReserveListTomorrow.forEach(n=>{
                        tomorrowList.push({name:n.name,time:getTime(n.beginDuration-0)+'-'+getTime(n.endDuration-0)})
                        
                    })
                    $scope.tomorrowList=tomorrowList
                    let shangwu = [];
                    let xiawu = [];
                    v.data && v.data.data[0] && v.data.data[0].roomReserveListToday &&  v.data.data[0].roomReserveListToday.forEach(v=>{
                        if((v.beginDuration-0)<9 && (v.endDuration-0)>8){              
                             let obj= angular.copy(v);
                             obj.endDuration = 8;
                             v.beginDuration = 8;
                            shangwu.push(obj);
                            xiawu.push(v);
                        }else{
                            if((v.endDuration-0)<9){
                                //上午
                                shangwu.push(v);
                            }else if((v.beginDuration-0)>8){
                                //下午
                        
                                xiawu.push(v);
                            }
                        }
                        
                    })
                    $scope.shangwu=shangwu;
                    $scope.xiawu=xiawu;
                   

                }else if(v.code=='0s'){
                    //生日
                      $scope.birthday=v.data.data
                      setBP_class2( $scope.birthday.staffList);
                }else if(v.code=='0t'){
                      //能耗折线图
                   var xList=[];
                   var yList=[];
                   var avList=[];
                   var tMonth=new Date().getMonth()
                   v.data.data &&  v.data.data.yearList && v.data.data.yearList[0] &&  v.data.data.yearList[0].monthList.forEach((v,i)=>{
                       if(i<=tMonth){
                        xList.push(v.name)
                        yList.push(v.value)
                        avList.push(v.value-0+500)
                       }
                   })
                   initEngery(xList,yList,avList)
                }
            })
            
           
            
    
        })
     }
     getData()
        $scope.elevarlist = {
            one: {
                f: 1,
                s: "等客",
                s_img: '../pic/intelliDept/flat_1.png'
            },
            two: {
                f: 1,
                s: "等客",
                s_img: '../pic/intelliDept/flat_1.png'
            },
            three: {
                f: 1,
                s: "等客",
                s_img: '../pic/intelliDept/flat_1.png'
            },
        };
        let elevarCf = {
            "等客": '../pic/intelliDept/flat_1.png',
            "上行": '../pic/intelliDept/up_1.gif',
            "下行": '../pic/intelliDept/down_1.gif',
        };

        if (ws) {
            ws.close();
        }
        var ws = new ReconnectingWebSocket('ws://bigscreen.ovuems.com', null, {debug: true, reconnectInterval: 5000});
        ws.onopen = function () {
           
            let message = {spaceCode: "5cbfbd931d8f0e63b039d8aa", type: "login"};
            ws.send(JSON.stringify(message));
          
        };
        ws.onmessage = function (evt) {
            let data = JSON.parse(evt.data);


            if (data.type == "sensorData") {
                if (data.msg.mac == "NS-E1400_TEST0002") {

                    $scope.elevarlist.one.f = data.msg.params[0].val;
                    $scope.elevarlist.one.s = data.msg.params[1].val;
                    $scope.elevarlist.one.s_img = elevarCf[$scope.elevarlist.one.s];
                }
                if (data.msg.mac == "NS-E1400_TEST0004") {
                    $scope.elevarlist.two.f = data.msg.params[0].val;
                    $scope.elevarlist.two.s = data.msg.params[1].val;
                    $scope.elevarlist.two.s_img = elevarCf[$scope.elevarlist.two.s];
                }
                if (data.msg.mac == "NS-E1400_TEST0003") {
                    $scope.elevarlist.three.f = data.msg.params[0].val;
                    $scope.elevarlist.three.s = data.msg.params[1].val;
                    $scope.elevarlist.three.s_img = elevarCf[$scope.elevarlist.three.s];

                }
            } else if (data.type == "dataSync") {
                 var revData = data.msg.data
                if(data.msg.code=='0i'){
                    var str=revData.params
                   var obj=JSON.parse(str)
                   $scope.temperatureValue=obj[0].val;
                   $scope.humidity=obj[1].val
                  
                }else if(data.msg.code=='0j'){
                    //项目节点
                    $scope.projectList=revData.data;
    
                }else if(data.msg.code=='0k'){
                    //接待
                   $scope.visitorList=revData.data|| [];
                 
                }else if(data.msg.code=='0l'){
                    //2.5
                   $scope.pm=revData.pm
                   
                }else if(data.msg.code=='0o'){
                      //活动
                      $scope.activeList=revData
                      setAC_class($scope.activeList);
                    
                     
                }else if(data.msg.code=='0n'){
                    //天气
                    $scope.weather=revData;
                    $scope.weather.weatherType=$scope.weatherConfig[$scope.weather.weatherType]                  
                }else if(data.msg.code=='0m'){
                    //能耗
                    
                    $scope.engery=revData.list[0];
                    $scope.engery.prevMomPercentValue=$scope.engery.prevMomPercentValue.replace("\-","")
                   
                    
                }else if(data.msg.code=='0p'){
                //厕所
                $scope.toilet=revData;
                revData.forEach((v)=>{
                  if(v.name=='女卫生间'){
                   $scope.womenList=v.roomList
                  }else{
                    $scope.menList=v.roomList  
                  }
                })
                $scope.womenInline=$scope.womenList.filter(item => item.status===1 ).length;  //有人
                $scope.womenOnline=$scope.womenList.filter(item => item.status===2 ).length;  //没人
                $scope.menInline=$scope.menList.filter(item => item.status===1 ).length;  
                $scope.menOnline=$scope.menList.filter(item => item.status===2 ).length;
              
                }else  if(data.msg.code=='0q'){
                    //会议室
                    let tomorrowList=[];
                    revData[0] && revData[0].roomReserveListTomorrow && revData[0].roomReserveListTomorrow.forEach(v=>{
                        tomorrowList.push({name:v.name,time:getTime(v.beginDuration-0)+'-'+getTime(v.endDuration-0)})
                        
                    })
                    $scope.tomorrowList=tomorrowList
                    let shangwu = [];
                    let xiawu = [];
                    revData && revData[0] && revData[0].roomReserveListToday && revData[0].roomReserveListToday.forEach(v=>{
                        if((v.beginDuration-0)<9 && (v.endDuration-0)>8){              
                            let obj= angular.copy(v);
                             obj.endDuration = 8;
                             v.beginDuration = 8;
                            shangwu.push(obj);
                            xiawu.push(v);
                        }else{
                            if((v.endDuration-0)<9){
                                //上午
                                shangwu.push(v);
                            }else if((v.beginDuration-0)>8){
                                //下午
                                xiawu.push(v);
                            }
                        }
                        
                    })
                    $scope.shangwu=shangwu;
                    $scope.xiawu=xiawu;
                }else if(data.msg.code=='0s'){
                    //生日
                    $scope.birthday=revData
                    
                    setBP_class2( $scope.birthday.staffList);
              }else if(data.msg.code=='0t'){
                  //能耗折线图
                var xList=[];
                var yList=[];
                var avList=[];
                var tMonth=new Date().getMonth()
                revData.yearList && revData.yearList[0] &&  revData.yearList[0].monthList.forEach((v,i)=>{
                    if(i<=tMonth){
                     xList.push(v.name)
                     yList.push(v.value)
                     avList.push(v.value-0+500)
                    }
                })
                initEngery(xList,yList,avList)
             }
            }


        };
  
}]);
})();