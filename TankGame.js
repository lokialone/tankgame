var Util = require('./util');

var Direction = {
  UP: 0,
  RIGHT: Math.PI / 2,
  DOWN: Math.PI ,
  LEFT: Math.PI * 3 / 2
}

var Bullet = function(x,y,direction) {
  this.bulletSize = 4;
  this.x = x;
  this.y = y;
  this.grap = 4;
  this.direction = direction;
  this.power = 1;
  this.isLive = true;
}

Bullet.prototype.render = function(p) {
  p.rect(this.x - this.bulletSize / 2, this.y - this.bulletSize,this.bulletSize,this.bulletSize);
}

Bullet.prototype.getX = function(){
  return this.x;
}

Bullet.prototype.init =  function(x,y,direction){
  this.setLocation(x,y);
  this.setDirection(direction);
}
Bullet.prototype.setLocation = function(x,y) {
  this.x = x;
  this.y = y;
}

Bullet.prototype.setDirection = function(direction) {
  this.direction = direction;
}

Bullet.prototype.update = function(p){
    switch (this.direction) {
      case Direction.UP:
          this.y-=this.grap;
          break;
      case Direction.DOWN:
          this.y+=this.grap;
          break;
      case Direction.RIGHT:
          this.x+=this.grap;
          break;
      case Direction.LEFT:
          this.x-=this.grap;
          break;
      default:
          this.x+=this.grap;
    }
}

Bullet.prototype.checkEdges = function(edge_x,edge_y,x,y,direction){
  if(this.x >= edge_x || this.x <= 0 || this.y >= edge_y || this.y <= 0){
      this.init(x,y,direction);
  }
}

Bullet.prototype.checkShot = function(x,y,range,p){
  if(p.dist(this.x,this.y,x,y) <= range){
    return true;
  }
  return false;
}

var Tank = function(){

  this.tankWidth = 50;
  this.tankHeight = 50;

  this.gunturretWidth = 30;
  this.gunturretHeight = 20;

  this.cannonHeight = 30;
  this.cannonDiameter = 6;

  // tank的圆角
  this.borderRadius = 5;
  this.slotBulletFlag = true;
  this.margin = 5;
  // tank的重心坐标
  this.x = 0;
  this.y = 0;

  this.direction = 0;
  this.speed = 2;

  this.bullets = [];
  this.blood = 3;
}

Tank.prototype.setLocation =  function(x,y){
  this.x = x;
  this.y = y;
}

Tank.prototype.updateCenter = function(x,y){
  this.x = x;
  this.y = y;
}

Tank.prototype.rotate = function(deg){
  this.direction = deg;
}

Tank.prototype.setDirection = function(direction){
  if(this.direction !== direction){
    this.rotate(direction);
  }
}

Tank.prototype.goLeft = function(){
  this.setDirection(Direction.LEFT);
  this.x-=this.speed;
}

Tank.prototype.goRight = function() {
  this.setDirection(Direction.RIGHT);
  this.x+=this.speed;
}

Tank.prototype.goUp = function() {
  this.setDirection(Direction.UP);
  this.y-=this.speed;
}

Tank.prototype.goDown = function() {
  this.setDirection(Direction.DOWN);
  this.y+=this.speed;
}

Tank.prototype.slotBullet = function() {
  this.bullets.push(new Bullet(this.x,this.y,this.direction));
}

Tank.prototype.checkCollision = function(x,y,p){
  if(p.dist(this.x,this.y,x,y) <= Math.sqrt(2 * this.tankWidth * this.tankWidth)){
    return true;
  }
  return false;
}

Tank.prototype.render = function(p) {

  // render bullets
  for(var i = 0; i < this.bullets.length; i++){
    this.bullets[i].render(p);
    this.bullets[i].update(p);
  }

  p.push();
  // 坦克的body
  p.translate(this.x, this.y);
  p.rotate(this.direction);
  p.fill(255, 204, 0);
  p.rect(-this.tankWidth / 2, -this.tankHeight / 2, this.tankWidth, this.tankHeight,this.borderRadius);
  //坦克的炮台
  p.fill(153, 204, 0);
  p.rect(- this.gunturretWidth / 2 , - this.gunturretHeight / 2, this.gunturretWidth, this.gunturretHeight,this.borderRadius);
  // 坦克的大炮
  p.fill(255,255,255);
  p.rect( - this.cannonDiameter / 2,  - this.gunturretHeight / 2 - this.cannonHeight,this.cannonDiameter,this.cannonHeight);

  p.pop();


}

var EnemyTank = function(min,x_max,y_max) {
  Tank.call(this);
  this.edge_min = min;
  this.edge_x_max = x_max;
  this.edge_y_max = y_max;
  this.speed = 1;
  this.bullet = '';
  this.bulletsDistance = 60;
  this.bulletsCount = 5;
  this.color = 'hsba(160, 100%, 50%, 0.5)';
}

EnemyTank.prototype = new Tank();

EnemyTank.prototype.autoMove = function(p) {
  this.render(p);
  this.autoUpdate(p);
}

EnemyTank.prototype.autoUpdate = function(p){
    this.goForward();
    if(this.isEdges()){
      this.findDirection();
    }
}


EnemyTank.prototype.setLocationAndDirection = function(x,y,direction){
  this.setLocation(x,y);
  this.setDirection(direction);
}

EnemyTank.prototype.createRandom = function(x,y){
  var dir = this.getRandomDirection();
  this.setLocationAndDirection(x,y,dir);
}

EnemyTank.prototype.getRandomDirection = function() {
  var dirs = [];
  for(var key in Direction){
    dirs.push(key);
  }
  var i = Math.floor(Util.randomRange(0,dirs.length));
  return Direction[dirs[i]];

}

EnemyTank.prototype.isEdges =  function() {
  if(this.x <= this.edge_min || this.x >= this.edge_x_max || this.y <=this.edge_min || this.y >=this.edge_y_max ){
    return true;
  }
  return false;
}

EnemyTank.prototype.render = function(p){
  // render bullets
  for(var i = 0; i < this.bullets.length; i++){
    this.bullets[i].render(p);
    this.bullets[i].update(p);
  }

  p.push();
  // 坦克的body

  p.fill(p.color(this.color));

  p.translate(this.x, this.y);
  p.rotate(this.direction);

  p.rect(-this.tankWidth / 2, -this.tankHeight / 2, this.tankWidth, this.tankHeight,this.borderRadius);
  //坦克的炮台

  p.rect(- this.gunturretWidth / 2 , - this.gunturretHeight / 2, this.gunturretWidth, this.gunturretHeight,this.borderRadius);
  // 坦克的大炮
  p.rect( - this.cannonDiameter / 2,  - this.gunturretHeight / 2 - this.cannonHeight,this.cannonDiameter,this.cannonHeight);
  p.pop();
}

EnemyTank.prototype.setColor = function(color){
  this.color = color;
}
EnemyTank.prototype.goForward = function(rate) {
    if(arguments.length === 0){
      var rate = 1;
    }

    switch (this.direction) {
      case Direction.UP:
        this.y-=this.speed*rate;
        break;
      case Direction.DOWN:
        this.y+=this.speed*rate;
        break;
      case Direction.LEFT:
        this.x-=this.speed*rate;
        break;
      case Direction.RIGHT:
        this.x+=this.speed*rate;
        break;
      default:
        this.y+=this.speed*rate;
    }
}

EnemyTank.prototype.findDirection = function() {

      for(var dir in Direction){
        if(this.direction === Direction[dir])
          continue;
        this.setDirection(Direction[dir]);
        this.goForward();
        if(!this.isEdges()){
          this.goForward(-1);
          break;
        }
        this.goForward(-1);
      }
}

EnemyTank.prototype.changeDirctionWhenCollision = function() {
    this.setDirection(this.direction + Math.PI);
}

EnemyTank.prototype.initBullets = function(dir) {
  // this.bullets.push(new Bullet(this.x,this.y,this.direction));
  this.bullet = new Bullet(this.x,this.y,this.direction);
}

EnemyTank.prototype.bulletsRender = function(p){
   this.bullet.render(p);
   if(this.bullet.x <=0 || this.bullet.x >= this.edge_x_max || this.bullet.y >= this.edge_y_max || this.bullet.y <=0){
     this.bullet.setLocation(this.x,this.y);
     this.bullet.setDirection(this.direction);
   }
   this.bullet.update();

}

var TankGame = function(p){
  const EDGE_MIN = 40;
  var tank ='';
  var enemyTank = [];
  var enemyTankCounts = 10;
  var score = 0;
  var heart;
  var scoreSound;
  var lives;
  var restartButton;
  var start = true;

  p.preload = function(){
    heart = p.loadImage(require('./img/heart.png'));
    // scoreSound = p.loadSound('../audio/score.mp3');

  }
  p.setup = function() {
    lives = 3;
    p.createCanvas(800,640);
    p.background(224);
    p.fill(255,204,0);
    tank = new Tank();
    tank.setLocation(p.width / 2, p.height - 60);

    for(var i = 0; i < enemyTankCounts;i++){
      enemyTank[i] = new EnemyTank(EDGE_MIN,p.width-EDGE_MIN,p.height-EDGE_MIN);
      enemyTank[i].createRandom(Util.randomRange(EDGE_MIN,p.width),Util.randomRange(EDGE_MIN,p.height-EDGE_MIN));
      enemyTank[i].initBullets();
    }
  }
    p.draw = function() {
      if(start){
        p.background(224);

        // 控制tank的方向
        controlTankDirection(p);
        tank.render(p);

        // render enemytank
        for(var i = 0; i < enemyTank.length;i++){
          enemyTank[i].bulletsRender(p);
          enemyTank[i].autoMove(p);
        }
        showScore(score);
        showlives(lives);
        addEnemyTank();
        enemyTankGetShoted();
        tankGetScore();
        tankGetShoted();
        // enemyTanksgetCollisioned();
      }else{
        p.clear();
        p.textSize(36);
        p.text("Your Score is: " + score, p.width/2, p.height/2);
      }
    }

  p.keyPressed = function() {
    if(p.keyCode === p.CONTROL){
      tank.slotBullet();
    }
  }

  function controlTankDirection() {
    if(p.keyIsDown(p.LEFT_ARROW)) {
      tank.goLeft();
    }
    if(p.keyIsDown(p.UP_ARROW)) {
      tank.goUp();
    }
    if(p.keyIsDown(p.DOWN_ARROW)) {
      tank.goDown();
    }
    if(p.keyIsDown(p.RIGHT_ARROW)) {
      tank.goRight();
    }
  }
  function showScore(score) {
    p.textSize(24);
    p.text("Score: " + score, 30, 50);
  }
  function showlives(lives){
    switch(lives)
    {
      case 3:
        p.image(heart, 650, 30);
        p.image(heart, 690, 30);
        p.image(heart, 730, 30);
      break;
      case 2:
        p.image(heart, 690, 30);
        p.image(heart, 730, 30);
      break;
      case 1:
        p.image(heart, 730, 30);
        break;
      case 0:
        start = false;
      break;
    }
  }
  function renderEnemyTank() {
  }

  function enemyTankGetShoted(){
    // 判断子弹击中enemyTank
    for(var i = 0; i < tank.bullets.length; i++){
      for(var j= 0; j < enemyTank.length;j++){
        if(tank.bullets[i].checkShot(enemyTank[j].x,enemyTank[j].y,tank.tankWidth/2,p)){
          score++;
          enemyTank.splice(j,1);
        }
      }
    }
  }
  function tankGetScore(){
    for(var i = 0; i < tank.bullets.length;i++){
      if(tank.bullets[i].x <= 0 || tank.bullets[i].y <=0 || tank.bullets[i].x >= p.width || tank.bullets[i] <= p.height ){
        tank.bullets.splice(i,1);
      }
    }
  }
  function tankGetShoted(){
    // 判断tank是否被击中
    for(var i = enemyTank.length-1; i >=0; i--){
      if(p.dist(enemyTank[i].bullet.x,enemyTank[i].bullet.y,tank.x,tank.y) <= tank.tankWidth/2){
        lives--;
        enemyTank[i].bullet.init(enemyTank[i].x,enemyTank[i].y,enemyTank[i].direction);
      }
    }
  }
  function addEnemyTank() {
    if (enemyTank.length < enemyTankCounts) {
      enemyTank.push(new EnemyTank(EDGE_MIN,p.width-EDGE_MIN,p.height-EDGE_MIN));
      enemyTank[enemyTank.length - 1].createRandom(Util.randomRange(EDGE_MIN,p.width),Util.randomRange(EDGE_MIN,p.height-EDGE_MIN));
      enemyTank[enemyTank.length - 1].initBullets();
    }
  }

  function enemyTanksgetCollisioned(){
    for(var i = 0,len = enemyTank.length; i < len; i++){
      for(var j= i+1; j < len;j++){
        if(enemyTank[i].checkCollision(enemyTank[j].x,enemyTank[j].y,p)){

            enemyTank[i].changeDirctionWhenCollision();
        }
      }
    }
  }
}
module.exports = TankGame;
