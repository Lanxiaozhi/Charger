var totalPile = 0;
var square = new Array(); //格点信息
var length = 7296;    //格点数
var grid = new Array();   //网格坐标
var gridClip = new Array();   //有效网格坐标
var district = new Array();   //行政区划信息
var totalQuickRate = new Array();   //快充功效函数
var totalSlowRate = new Array();    //慢充功效函数
var pile = new Array();   //充电桩分布
var quickPile = new Array();    //快充分布
var slowPile = new Array();   //慢充分布
var event_2 = new Array(161007);    //0.02对应事件数据
var event_5 = new Array(403423);    //0.05对应事件数据
var event_10 = new Array(806551);   //0.1对应事件数据

function init(){    //初始化
  for(var i=0;i<length;i++){
    square[i] = new Object();
    square[i].prob = new Array();
  }
  for(var i=0;i<19272;i++){
    grid[i] = new Object();
  }
  for(var i=0;i<7296;i++){
    gridClip[i] = new Object();
  }
  for(var i=0;i<length;i++){
    district[i] = new Object();
  }
  for(var i=0;i<square.length;i++){
    totalQuickRate[i]=0;
    totalSlowRate[i]=0;
  }
  for(var i=0;i<square.length;i++) {
    pile[i] = 0;
    quickPile[i] = 0;
    slowPile[i] = 0;
  }
  for(var i=0;i<event_2.length;i++){
    event_2[i] = new Object();
  }
  for(var i=0;i<event_5.length;i++){
    event_5[i] = new Object();
  }
  for(var i=0;i<event_10.length;i++){
    event_10[i] = new Object();
  }
  for(var i=0;i<10;i++){
    disQuickPile[i] = 0;
    disSlowPile[i] = 0;
    disQuickRate[i] = 0;
    disSlowRate[i] = 0;
  }
  for(var i=0;i<10;i++){
    count1[i] = 0;
    count2[i] = 0;
  }
}

function calcQuickRate(){ //计算总和
  var result = 0;
  for(var i=0;i<totalQuickRate.length;i++){
    result += Number(totalQuickRate[i]);
  }
  return result;
}

function calcSlowRate(){    //计算总和
  var result = 0;
  for(var i=0;i<totalSlowRate.length;i++){
    result += Number(totalSlowRate[i]);
  }
  return result;
}

var disQuickPile = new Array();   //区划快充数量
var disSlowPile = new Array();    //区划慢充数量
var disQuickRate = new Array();   //区划快充功效函数
var disSlowRate = new Array();    //区划慢充功效函数

var currentQuickRate = 1000000;
var currentSlowRate = 1000000;
var totalQuickMissRate = 0,totalQuickFillRate = 0,totalSlowMissRate = 0, totalSlowFillRate = 0;
var quickCount = 0, slowCount = 0;
var count1 = new Array();
var count2 = new Array();

function calcPile() {   //计算主函数
  calcEvent();
  while(1){
    currentQuickRate = calcQuickRate();
    var currentQuickPile = quickPile;
    adjustQuickPile();
    calcEvent();
    if(currentQuickRate >= calcQuickRate()) {
      quickPile = currentQuickPile;
      break;
    }
  }
  while(1){
    currentSlowRate = calcSlowRate();
    var currentSlowPile = slowPile;
    adjustSlowPile();
    calcEvent();
    var currentSlowPile = slowPile;
    if(currentSlowRate >= calcSlowRate()) {
      slowPile = currentSlowPile;
      break;
    }
  }
  var rate1,rate2;
  rate1 = ((totalQuickFillRate/quickCount)*0.5+(1-(totalQuickMissRate/quickCount))*0.5).toFixed(4);
  rate2 = ((totalSlowFillRate/slowCount)*0.5+(1-(totalSlowMissRate/slowCount))*0.5).toFixed(4);
  console.log("Quick--MissRate:"+(totalQuickMissRate/quickCount).toFixed(4)+",FillRate:"+(totalQuickFillRate/quickCount).toFixed(4));
  console.log("Slow--MissRate:"+(totalSlowMissRate/slowCount).toFixed(4)+",FillRate:"+(totalSlowFillRate/slowCount).toFixed(4));
  $("#func1a").val(rate1);
  $("#func1b").val(rate2);
  for(var i=0;i<square.length;i++){
    var kind = district[i].kind;
    if(quickPile[i] > 0){
      count1[kind]++;
    }
    if(slowPile[i] > 0){
      count2[kind]++;
    }
    disQuickPile[kind] += quickPile[i];
    disQuickRate[kind] += Number(totalQuickRate[i]);
    disSlowPile[kind] += slowPile[i];
    disSlowRate[kind] += Number(totalSlowRate[i]);
  }
}

var quickOrder = new Array();
function adjustQuickPile(){   //快充调整分布
  for(var i=0;i<totalQuickRate.length;i++){
    quickOrder[i] = i;
  }
  var count = 0;
  for(var i=0;i<totalQuickRate.length;i++){
    if(totalQuickRate[i] > 0)
      count++;
  }
  for(var i=0;i<totalQuickRate.length;i++){
    for(var j=i+1;j<totalQuickRate.length;j++){
      if(totalQuickRate[i]<totalQuickRate[j]){
        var temp1 = totalQuickRate[i];
        var temp2 = quickOrder[i];
        totalQuickRate[i] = totalQuickRate[j];
        quickOrder[i] = quickOrder[j];
        totalQuickRate[j] = temp1;
        quickOrder[j] = temp2;
      }
    }
  }
  for(var i=0;i<count/4;i++){
    quickPile[quickOrder[i]]--;
    quickPile[quickOrder[count-i]]++;
  }
}

var slowOrder = new Array();
function adjustSlowPile(){    //慢充调整分布
  for(var i=0;i<totalSlowRate.length;i++){
    slowOrder[i] = i;
  }
  var count = 0;
  for(var i=0;i<totalSlowRate.length;i++){
    if(totalSlowRate[i] > 0)
      count++;
  }
  for(var i=0;i<totalSlowRate.length;i++){
    for(var j=i+1;j<totalSlowRate.length;j++){
      if(totalSlowRate[i]<totalSlowRate[j]){
        var temp1 = totalSlowRate[i];
        var temp2 = slowOrder[i];
        totalSlowRate[i] = totalSlowRate[j];
        slowOrder[i] = slowOrder[j];
        totalSlowRate[j] = temp1;
        slowOrder[j] = temp2;
      }
    }
  }
  for(var i=0;i<count/4;i++){
    slowPile[slowOrder[i]]--;
    slowPile[slowOrder[count-i]]++;
  }
}

var quickCharge = new Array();
var slowCharge = new Array();
var quickChargingTime = new Array();    //快充总时间
var slowChargingTime = new Array();    //慢充总时间
var quickMiss = new Array();    //慢充不满足数
var slowMiss = new Array();   //慢充不满足数
var quickChargingEvent = new Array();   //快充总事件
var slowChargingEvent = new Array();    //慢充总事件

function judgeCharging(id,startTime,type){    //记录充电时长
  if(type === 0){
    quickCharge[id][startTime].charging += 1;
  }
  else{
    slowCharge[id][startTime].charging += 1;
  }
}

function judgePile(id,startTime,eventDur) {   //快慢充使用区分
  if(eventDur <= 4) {
    quickChargingEvent[id] += 1;

    quickCharge[id][startTime].toCharge += 1;
    if (quickPile[id] > quickCharge[id][startTime].charging) {
      quickCharge[id][startTime].newCharge += 1;
      quickChargingTime[id] += eventDur;
      for (var i = startTime; i < startTime + eventDur; i++) {
        if (i < 24) {
          judgeCharging(id, i, 0);
        }
      }
    }
    else {
      quickMiss[id] += 1;
    }
  }
  else{
    slowChargingEvent[id] += 1;

    slowCharge[id][startTime].toCharge += 1;
    if (slowPile[id] > slowCharge[id][startTime].charging) {
      slowCharge[id][startTime].newCharge += 1;
      slowChargingTime[id] += eventDur;
      for (var i = startTime; i < startTime + eventDur; i++) {
        if (i < 24) {
          judgeCharging(id, i, 1);
        }
      }
    }
    else {
      slowMiss[id] += 1;
    }
  }
}

function calcEvent() {    //计算事件满足度
  for(var i=0;i<square.length;i++){
    quickChargingTime[i] = 0;
    slowChargingTime[i] = 0;
    quickMiss[i] = 0;
    slowMiss[i] = 0;
    quickChargingEvent[i] = 0;
    slowChargingEvent[i] = 0;
  }
  totalQuickMissRate = 0;
  totalQuickFillRate = 0;
  totalSlowMissRate = 0;
  totalSlowFillRate = 0;
  quickCount = 0;
  slowCount = 0;
  for(var i=0;i<square.length;i++){
    quickCharge[i] = new Array();
    slowCharge[i] = new Array();
    for(var j=0;j<24;j++) {
      quickCharge[i][j] = new Object();
      quickCharge[i][j].toCharge = 0;
      quickCharge[i][j].charging = 0;
      quickCharge[i][j].newCharge = 0;
      slowCharge[i][j] = new Object();
      slowCharge[i][j].toCharge = 0;
      slowCharge[i][j].charging = 0;
      slowCharge[i][j].newCharge = 0;
    }
  }
  if($("#useRate").val() == "0.02") {
    for (var i = 0; i < event_2.length; i++) {
      var id = event_2[i].gridID;
      var startTime = event_2[i].startTime;
      var eventDur = event_2[i].eventDur;
      if (id >= 0 && id <= 7295 && startTime >= 0 && startTime <= 23) {
        judgePile(id,startTime,eventDur);
      }
    }
  }
  else if($("#useRate").val() == "0.05") {
    for (var i = 0; i < event_5.length; i++) {
      var id = event_5[i].gridID;
      var startTime = event_5[i].startTime;
      var eventDur = event_5[i].eventDur;
      if (id >= 0 && id <= 7295 && startTime >= 0 && startTime <= 23) {
        judgePile(id,startTime,eventDur);
      }
    }
  }
  else if($("#useRate").val() == "0.1") {
    for (var i = 0; i < event_10.length; i++) {
      var id = event_10[i].gridID;
      var startTime = event_10[i].startTime;
      var eventDur = event_10[i].eventDur;
      if (id >= 0 && id <= 7295 && startTime >= 0 && startTime <= 23) {
        judgePile(id,startTime,eventDur);
      }
    }
  }
  for(var i=0;i<square.length;i++) {
    if (quickPile[i] > 0 && quickChargingEvent[i] > 0) {
      var missRate = quickMiss[i] / quickChargingEvent[i];
      var fillRate = quickChargingTime[i] / quickPile[i] / 24;
      totalQuickMissRate += missRate;
      totalQuickFillRate += fillRate;
      quickCount++;
      totalQuickRate[i] = (0.5 * fillRate + 0.5 * (1 - missRate)).toFixed(4);
    }
    else {
      totalQuickRate[i] = 0;
    }
    if (slowPile[i] > 0 && slowChargingEvent[i] > 0) {
      var missRate = slowMiss[i] / slowChargingEvent[i];
      var fillRate = slowChargingTime[i] / slowPile[i] / 24;
      totalSlowMissRate += missRate;
      totalSlowFillRate += fillRate;
      slowCount++;
      totalSlowRate[i] = (0.5 * fillRate + 0.5 * (1 - missRate)).toFixed(4);
    }
    else {
      totalSlowRate[i] = 0;
    }
  }
}


