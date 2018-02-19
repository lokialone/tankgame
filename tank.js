import Bullet from './bullet.js';

class Tank {
    constructor() {
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

    setLocation(x, y) {
        this.x = x;
        this.y = y;
    }

    updateCenter(x, y) {
        this.x = x;
        this.y = y;
    }

    rotate(deg) {
        this.direction = deg;
    }

    setDirection(direction) {
        if(this.direction !== direction){
            this.rotate(direction);
          }
    } 
    goLeft() {
        this.setDirection(Direction.LEFT);
        this.x-=this.speed;
    }

    goRight() {
        this.setDirection(Direction.RIGHT);
        this.x+=this.speed;
    }

    goUp() {
        this.setDirection(Direction.UP);
        this.y-=this.speed;
    }
    goDown() {
        this.setDirection(Direction.DOWN);
        this.y+=this.speed; 
    }
    slotBullet() {
        this.bullets.push(new Bullet(this.x,this.y,this.direction));
    }
    checkCollision() {
        if(p.dist(this.x,this.y,x,y) <= Math.sqrt(2 * this.tankWidth * this.tankWidth)){
            return true;
        }
        return false;
    }
    render(p) {
         // render bullets
        for(var i = 0; i < this.bullets.length; i++) {
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
}

export default Tank;

  
