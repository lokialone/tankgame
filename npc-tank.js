import Tank from './tank.js';
import Util from './util.js';
import Bullet from './bullet.js';

class NpcTank extends Tank {
    constructor(min,x_max,y_max) {
        super();
        this.edge_min = min;
        this.edge_x_max = x_max;
        this.edge_y_max = y_max;
        this.speed = 1;
        this.bullet = '';
        this.bulletsDistance = 60;
        this.bulletsCount = 5;
        this.color = 'hsba(160, 100%, 50%, 0.5)';
    }

    autoMove(p) {
        this.render(p);
        this.autoUpdate(p);
    }
    autoUpdate(p) {
        this.goForward();
        if(this.isEdges()){
            this.findDirection();
        }
    }
    setLocationAndDirection(x,y,direction) {
        this.setLocation(x,y);
        this.setDirection(direction);
    }

    getRandomDirection() {
        var dirs = [];
        for(var key in Direction){
        dirs.push(key);
        }
        var i = Math.floor(Util.randomRange(0,dirs.length));
        return Direction[dirs[i]];
    }

    createRandom(x,y) {
        var dir = this.getRandomDirection();
        this.setLocationAndDirection(x,y,dir);
    }

    isEdges() {
        if(this.x <= this.edge_min || this.x >= this.edge_x_max || this.y <=this.edge_min || this.y >=this.edge_y_max ){
            return true;
        }
        return false;
    }

    render(p) {
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

    setColor(color) {
        this.color = color;
    }

    goForward(rate = 1) {
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

    findDirection() {
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

    changeDirctionWhenCollision() {
        this.setDirection(this.direction + Math.PI);
    }

    initBullets(dir) {
        this.bullet = new Bullet(this.x,this.y,this.direction);
    }

    bulletsRender(p) {
        this.bullet.render(p);
        if (this.bullet.x <=0 || this.bullet.x >= this.edge_x_max || this.bullet.y >= this.edge_y_max || this.bullet.y <=0){
            this.bullet.setLocation(this.x,this.y);
            this.bullet.setDirection(this.direction);
        }
            this.bullet.update();
    }
}
  
export default NpcTank;