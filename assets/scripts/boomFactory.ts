import Boom from "./boom";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoomFactory extends cc.Component {

    @property(cc.Prefab)
    pfbBoom: cc.Prefab = null;

    @property(cc.Node)
    boomContent: cc.Node = null;

    public level: number = 1;
    private maxRowCount: number = 5;
    private minRowCount: number = 1;
    private boomPool: cc.Node[] = [];

    private maxGap: number = 50;
    private minGap: number = 10;
    private startY: number = 500;

    private nextRow: number = 1;

    createRowBooms() {
        let count = this.rowCount();
        for (let index = 0; index < count; index++) {
            this.createBoom();
        }
        this.nextRow++;
    }

    destroyBoom(boom) {
        boom.parent = null;
        this.boomPool.push(boom);
    }

    randomPosition(boom: cc.Node) {
        this.randomX(boom);
        boom.y = this.startY + this.randomHGap();
        boom.getComponent(Boom).row = this.nextRow;
    }

    private createBoom(): cc.Node {
        if (this.boomPool.length > 0) return this.boomPool.pop();
        let boom = cc.instantiate(this.pfbBoom);
        boom.parent = this.boomContent;
        this.randomPosition(boom);
        return boom;
    }

    private randomX(boom) {
        boom.x = Math.random() * (cc.winSize.width - boom.width) + boom.width / 2;
    }

    private randomHGap(): number {
        return Math.random() * (this.maxGap - this.minGap) + this.minGap;
    }

    private rowCount(): number {
        return 3;
    }
}
