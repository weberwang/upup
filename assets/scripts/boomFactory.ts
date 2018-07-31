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

const {ccclass, property} = cc._decorator;

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

    private maxGap: number = 200;
    private minGap: number = 100;
    private rowGap: number = 30;
    private startY: number = 400;

    private nextRow: number = 0;

    public get allBooms(): cc.Node[] {
        return this.boomContent.children;
    }

    startGame() {
        let last = this.createRowBooms();
        while (last.y < cc.winSize.height) {
            last = this.createRowBooms();
        }
    }

    createRowBooms(): cc.Node {
        let count = this.rowCount();
        let last: cc.Node;
        for (let index = 0; index < count; index++) {
            last = this.createBoom();
        }
        this.nextRow++;
        cc.log("last y", last.y, this.nextRow)
        return last;
    }

    destroyBoom(boom) {
        boom.parent = null;
        this.boomPool.push(boom);
    }

    private randomPosition(boom: cc.Node) {
        this.randomX(boom);
        boom.y = this.startY + this.randomHGap() + this.maxGap * this.nextRow;
        boom.getComponent(Boom).row = this.nextRow;
    }

    private createBoom(): cc.Node {
        let boom = this.boomPool.pop() || cc.instantiate(this.pfbBoom);
        boom.parent = this.boomContent;
        this.randomPosition(boom);
        return boom;
    }

    private randomX(boom: cc.Node): void {
        let randomWidth = cc.winSize.width * 0.7;
        boom.x = Math.round(Math.random() * (randomWidth - boom.width) + boom.width / 2 - randomWidth / 2);
    }

    private randomHGap(): number {
        return Math.round(Math.random() * (this.maxGap - this.minGap) + this.minGap);
    }

    private rowCount(): number {
        return 3;
    }

    isTop(boom: Boom): boolean {
        return boom.row === this.nextRow - 1;
    }

    sortBooms() {
        this.allBooms.sort((a, b) => {
            return a.y - b.y;
        });
    }
}
