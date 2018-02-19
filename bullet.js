import { Direction } from './const.js';

class Bullet {
    constructor(x,y,direction) {
        this.bulletSize = 4;
        this.x = x;
        this.y = y;
        this.grap = 4;
        this.direction = direction;
        this.power = 1;
        this.isLive = true;
    }
    setLocation(x, y) {
        this.x = x;
        this.y = y;
    }
    setDirection(direction) {
        this.direction = direction;
    }
    init (x,y,direction) {
        this.setLocation(x,y);
        this.setDirection(direction);
    }
    render(p) {
        p.rect(this.x - this.bulletSize / 2, this.y - this.bulletSize,this.bulletSize,this.bulletSize);
    }
    getX() {
        return this.x;
    }
    update(p) {
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

    checkEdges(edge_x,edge_y,x,y,direction) {
        if(this.x >= edge_x || this.x <= 0 || this.y >= edge_y || this.y <= 0){
            this.init(x,y,direction);
        }
    }

    checkShot(x, y, range, p) {
        if(p.dist(this.x,this.y,x,y) <= range) {
            return true;
        }
        return false;
    }
}

export default Bullet;