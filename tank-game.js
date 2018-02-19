import Util from './util.js';
import { Direction } from './const.js';
import Bullet from './bullet.js';
import Tank from './tank.js';
import EnemyTank from './npc-tank.js';

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


export default TankGame;
