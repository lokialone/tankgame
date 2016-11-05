var Util = function(){

}

Util.randomRange = function(min,max){
  return Math.random()*(max - min) + min;
}
module.exports = Util;
