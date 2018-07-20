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
export default class NewClass extends cc.Component {

    @property({ type: cc.Vec2, tooltip: "目标显示对象移动偏移量超过指定大小，相机开始移动,负值忽略" })
    offset: cc.Vec2 = cc.v2();

    @property({ type: cc.Node, tooltip: "目标显示对象" })
    target: cc.Node = null;

    private curPosition: cc.Vec2 = null;

    resetInEditor() {
        if (!this.getComponent(cc.Camera)) {
            this.enabled = false;
        } else {
            cc.log("加载相机")
        }
    }

    onLoad() {
        this.curPosition = this.target.position;
    }

    update() {
        if (this.offset.x >= 0 && Math.abs(this.target.x - this.curPosition.x) > this.offset.x) {
                
        }

        if (this.offset.y >= 0 && Math.abs(this.target.y - this.curPosition.y) > this.offset.y) {

        }
    }
}
