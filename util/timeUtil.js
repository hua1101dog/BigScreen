var dayjs = require('dayjs');

var dateDict= [{
    "code":"$today$","calu":()=>dayjs().format('YYYY-MM-DD'),

},
{
    "code":"$thisMonth$","calu":()=>dayjs().format('YYYY-MM'),

},
{"code":"$nextMonth$","calu":()=>dayjs().add(1,'month').format('YYYY-MM')},
{"code":"$lastMonth$","calu":()=>dayjs().add(-1,'month').format('YYYY-MM')},
{"code":"$tomorrow$","calu":()=>dayjs().add(1,'day').format('YYYY-MM-DD')},
{"code":"$firstDayOfMonth$","calu":()=>dayjs().startOf('month').format('YYYY-MM-DD')},
{"code":"$lastDayOfMonth$","calu":()=>dayjs().endOf('month').format('YYYY-MM-DD')},
{"code":"$firstDayOfWeek$","calu":()=>dayjs().startOf('week').format('YYYY-MM-DD')},
{"code":"$lastDayOfWeek$","calu":()=>dayjs().endOf('week').format('YYYY-MM-DD')}
];
var fillParams = function(params){
     var ret = {};
        for (var p1 in params) {
               if (params.hasOwnProperty(p1)){
                   value = params[p1];
                    let dict = dateDict.find(n=>n.code === value);
                   if(dict) {
                        ret[p1]=dict.calu();
                   }else{
                     ret[p1]=value;
                   }
               }
        }
        return ret;
}
module.exports ={
    dateDict:dateDict.map(n=>{return {code:n.code,value:n.calu()}}),
    fillParams:fillParams
}
