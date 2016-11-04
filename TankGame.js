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
    // this.checkEdges(p.width,p.height);

}

Bullet.prototype.checkEdges = function(width,height){
  if(this.x >= width || this.x <= 0 || this.y >= height || this.y <= 0){
    // this.y = -this.bulletSize;

  }
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
  this.center_x = 0;
  this.center_y = 0;

  this.direction = 0;
  this.step = 2;

  this.bullets = [];


  this.blood = 3;
}

Tank.prototype.setCenter =  function(x,y){
  this.center_x = x;
  this.center_y = y;
}

Tank.prototype.getShot =  function(){

}

Tank.prototype.updateCenter = function(x,y){
  this.center_x = x;
  this.center_y = y;
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
  this.center_x-=this.step;
}

Tank.prototype.goRight = function() {
  this.setDirection(Direction.RIGHT);
  this.center_x+=this.step;
}

Tank.prototype.goUp = function() {
  this.setDirection(Direction.UP);
  this.center_y-=this.step;
}

Tank.prototype.goDown = function() {
  this.setDirection(Direction.DOWN);
  this.center_y+=this.step;
}

Tank.prototype.slotBullet = function() {
  this.bullets.push(new Bullet(this.center_x,this.center_y,this.direction));

}

Tank.prototype.render = function(p) {

  // render bullets
  for(var i = 0; i < this.bullets.length; i++){
    this.bullets[i].render(p);
    this.bullets[i].update(p);
  }

  p.push();
  // 坦克的body
  p.translate(this.center_x, this.center_y);
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
  this.step = 1;
  //this.bullets = [];
  this.bullet;
  this.bulletsDistance = 60;
  this.bulletsCount = 5;
  this.dirs=['UP','DOWN','LEFT','RIGHT'];
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

EnemyTank.prototype.isEdges =  function() {
  if(this.center_x <= this.edge_min || this.center_x >= this.edge_x_max || this.center_y <=this.edge_min || this.center_y >=this.edge_y_max ){
    return true;
  }
  return false;
}

EnemyTank.prototype.goForward = function(rate) {
    if(arguments.length === 0){
      var rate = 1;
    }

    switch (this.direction) {
      case Direction.UP:
        this.center_y-=this.step*rate;
        break;
      case Direction.DOWN:
        this.center_y+=this.step*rate;
        break;
      case Direction.LEFT:
        this.center_x-=this.step*rate;
        break;
      case Direction.RIGHT:
        this.center_x+=this.step*rate;
        break;
      default:
        this.center_y+=this.step*rate;
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

EnemyTank.prototype.initBullets = function() {
  // this.bullets.push(new Bullet(this.center_x,this.center_y,this.direction));
  this.bullet = new Bullet(this.center_x,this.center_y,this.direction);
}

EnemyTank.prototype.bulletsRender = function(p){
  // bullets not finish
  // for(var i = 0,len = this.bullets.length;i < len;i++){
  //     this.bullets[i].render(p);
  //     if(i !==0 && i !== len-1 && p.dist(this.bullets[i].x,this.bullets[i].y,this.bullets[i+1].x,this.bullets[i+1].y) <= this.bulletsDistance){
  //       continue;
  //     }
  //
  //     if(this.bullets[i].x <=0 || this.bullets[i].x >= this.edge_x_max || this.bullets[i].y >= this.edge_y_max || this.bullets[i].y <=0){
  //       // this.bullets.splice(i,1);
  //       // this.bullets.push(new Bullets(this.center_x,this.center_y,this.direction));
  //       this.bullets[i].setLocation(this.center_x,this.center_y);
  //       this.bullets[i].setDirection(this.direction);
  //     }
  // }

  // temp
   this.bullet.render(p);
   if(this.bullet.x <=0 || this.bullet.x >= this.edge_x_max || this.bullet.y >= this.edge_y_max || this.bullet.y <=0){
     this.bullet.setLocation(this.center_x,this.center_y);
     this.bullet.setDirection(this.direction);
   }
   this.bullet.update();

}

var TankGame = function(p){

  const EDGE_MIN = 40;
  var tank ='';
  var enemyTank = [];
  var enemyTankCounts = 3;
  var score = 0;
  var heart;
  var scoreSound;
  var lives;
  var restartButton;

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
    tank.setCenter(p.width / 2, p.height - 60);
    var enemyTankLocation = [ {x:EDGE_MIN,y:60},{x:p.width/2-25,y:60},{x:p.width-EDGE_MIN,y:60} ];
    for(var i = 0; i < enemyTankCounts;i++){
      enemyTank[i] = new EnemyTank(EDGE_MIN,p.width-EDGE_MIN,p.height-EDGE_MIN);
      enemyTank[i].setCenter(enemyTankLocation[i].x,enemyTankLocation[i].y);
      enemyTank[i].setDirection(Direction.DOWN);
      enemyTank[i].initBullets();
    }
  }
  p.draw = function() {
    p.background(224);

    p.textSize(24);
    // 控制tank的方向
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

    tank.render(p);

    // render enemytank
    for(var i = 0; i < enemyTank.length;i++){
      enemyTank[i].bulletsRender(p);
      enemyTank[i].autoMove(p);
    }

    p.text("Score: " + score, 30, 50);
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
    }

    if(lives === 0){
      p.clear();
      p.textSize(36);
      p.text("Your Score is: " + score, p.width/2, p.height/2);
      return;
    }
    // 判断子弹击中enemyTank
    for(var i = 0; i < tank.bullets.length; i++){
      for(var j= 0; j < enemyTank.length;j++){
        if(p.dist(tank.bullets[i].x, tank.bullets[i].y, enemyTank[j].center_x, enemyTank[j].center_y) <=tank.tankWidth/2){
          score++;
          // scoreSound.play();
          enemyTank.splice(j,1);

        }
      }
    }
    if (enemyTank.length < 3) {
      enemyTank.push(new EnemyTank(EDGE_MIN,p.width-EDGE_MIN,p.height-EDGE_MIN));
      enemyTank[enemyTank.length - 1].setCenter(p.random(EDGE_MIN,p.width-EDGE_MIN),p.random(EDGE_MIN,p.height-EDGE_MIN));
      enemyTank[enemyTank.length - 1].setDirection(Direction.UP);
      enemyTank[enemyTank.length - 1].initBullets();
    }

    for(var i = 0; i < tank.bullets.length;i++){
      if(tank.bullets[i].x <= 0 || tank.bullets[i].y <=0 || tank.bullets[i].x >= p.width || tank.bullets[i] <= p.height ){
        tank.bullets.splice(i,1);
      }
    }

    // 判断tank是否被击中
    for(var i = enemyTank.length-1; i >=0; i--){
      if(p.dist(enemyTank[i].bullet.x,enemyTank[i].bullet.y,tank.center_x,tank.center_y) <= tank.tankWidth/2){
        lives--;
        enemyTank[i].bullet.setLocation(enemyTank[i].center_x,enemyTank[i].center_y);
        enemyTank[i].bullet.setDirection(enemyTank[i].direction);
      }
    }
  }


  p.keyPressed = function() {
    if(p.keyCode === p.CONTROL){
      tank.slotBullet();
    }
  }
}

module.exports = TankGame;
