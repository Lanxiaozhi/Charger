var totalPile = 0;
var square = new Array();
var length = 8000;
for(var i=0;i<length;i++){
  square[i] = new Object();
  square[i].prob = new Array();
}
var time = new Array();
for(var i=0;i<24;i++){
  time[i] = new Array(4);
}
var totalQuickRate = new Array();
for(var i=0;i<square.length;i++){
  totalQuickRate[i]=0;
}

var totalSlowRate = new Array();
for(var i=0;i<square.length;i++){
  totalSlowRate[i]=0;
}

var pile = new Array();
for(var i=0;i<square.length;i++){
  pile[i] = 0;
}

var quickPile = new Array();
for(var i=0;i<square.length;i++){
  quickPile[i] = 0;
}

var slowPile = new Array();
for(var i=0;i<square.length;i++){
  slowPile[i] = 0;
}

var event_2 = new Array(161007);
for(var i=0;i<event_2.length;i++){
  event_2[i] = new Object();
}
var event_5 = new Array(403423);
for(var i=0;i<event_5.length;i++){
  event_5[i] = new Object();
}
var event_10 = new Array(806551);
for(var i=0;i<event_10.length;i++){
  event_10[i] = new Object();
}

function calcQuickRate(){
  var result = 0;
  for(var i=0;i<totalQuickRate.length;i++){
    result += Number(totalQuickRate[i]);
  }
  return result;
}

function calcSlowRate(){
  var result = 0;
  for(var i=0;i<totalSlowRate.length;i++){
    result += Number(totalSlowRate[i]);
  }
  return result;
}

var currentQuickRate = 10000;
var currentSlowRate = 10000;
function calcPile() {
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
  console.log(totalQuickRate);
  console.log(totalSlowRate);
}

function swap(a,b){
  var temp = a;
  a = b;
  b = temp;
}
var quickOrder = new Array();
function adjustQuickPile(){
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
function adjustSlowPile(){
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
var quickChargingTime = new Array();
var slowChargingTime = new Array();
var quickMiss = new Array();
var slowMiss = new Array();
var quickChargingEvent = new Array();
var slowChargingEvent = new Array();

function judgeCharging(id,startTime,type){
  if(type === 0){
    quickCharge[id][startTime].charging += 1;
  }
  else{
    slowCharge[id][startTime].charging += 1;
  }
}

function judgePile(id,startTime,eventDur) {
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

function calcEvent() {
  for(var i=0;i<square.length;i++){
    quickChargingTime[i] = 0;
    slowChargingTime[i] = 0;
    quickMiss[i] = 0;
    slowMiss[i] = 0;
    quickChargingEvent[i] = 0;
    slowChargingEvent[i] = 0;

  }
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
      var quickMissRate = quickMiss[i] / quickChargingEvent[i];
      var quickFillRate = quickChargingTime[i] / quickPile[i] / 24;
      totalQuickRate[i] = (0.5 * quickFillRate + 0.5 * (1 - quickMissRate)).toFixed(4);
    }
    else {
      totalQuickRate[i] = 0;
    }
    if (slowPile[i] > 0 && slowChargingEvent[i] > 0) {
      var missRate = slowMiss[i] / slowChargingEvent[i];
      var fillRate = slowChargingTime[i] / slowPile[i] / 24;
      totalSlowRate[i] = (0.5 * fillRate + 0.5 * (1 - missRate)).toFixed(4);
    }
    else {
      totalSlowRate[i] = 0;
    }
  }
  /*for(var i=0;i<square.length;i++){
    var squareEvent = event[i];
    /*var totalChargingTime = 0;
    var totalMiss = 0;
    var totalChargingEvent = 0;
    for(var j=0;j<24;j++){
      event[j] = new Object();
      event[j].toCharge = square[i].prob[j];
      event[j].newCharge = 0;
      event[j].charging = 0;
    }
    for(var j=0;j<24;j++){
      totalChargingEvent[i] += squareEvent[j].toCharge;
      if(pile[i] - squareEvent[j].charging >= squareEvent[j].toCharge){
        squareEvent[j].charging += squareEvent[j].toCharge;
        //squareEvent[j].newCharge = squareEvent[j].toCharge;
        totalChargingTime[i] += squareEvent[j].charging;
      }
      else{
        var newCharge = pile[i] - squareEvent[j].charging;
        squareEvent[j].charging = pile[i];
        totalMiss[i] += squareEvent[j].toCharge - newCharge;
      }
    }
    if(pile[i] > 0 && totalChargingEvent[i] > 0) {
      var missRate = totalMiss[i] / totalChargingEvent[i];
      var fillRate = totalChargingTime[i] / pile[i] / 24;
      totalRate[i] = (0.5*fillRate + 0.5*(1-missRate)).toFixed(4);
    }
    else{
      totalRate[i] = 0;
    }
  }*/
}


