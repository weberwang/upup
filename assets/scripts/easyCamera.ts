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

    @property({ tooltip: "相机限定区域, 尺寸为负表示不限制" })
    cameraRect: cc.Rect = new cc.Rect();

    @property({ tooltip: "目标显示对象移动相对相机偏移量超过指定大小，相机开始移动,负值忽略" })
    offset: cc.Vec2 = cc.v2();

    @property({ type: cc.Node, tooltip: "目标显示对象" })
    target: cc.Node = null;

    @property({ type: cc.Component.EventHandler, tooltip: "相机移动触发的事件" })
    cameraUpdateEvents: cc.Component.EventHandler[] = [];

    resetInEditor() {
        if (!this.getComponent(cc.Camera)) {
            this.enabled = false;
        } else {
            cc.log("加载相机");
        }
    }

    start() {
        this.scheduleOnce(() => {
            // this.node.position = cc.v2(0, 0);
        }, 1)
    }

    lateUpdate() {
        cc.log("camera position", JSON.stringify(this.node.position));
    }

    update() {
        var targetWorldPoint = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var cameraPoint = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let move = false;
        if (this.offset.x >= 0 && Math.abs(targetWorldPoint.x - cameraPoint.x) > this.offset.x) {
            if (targetWorldPoint.x > cameraPoint.x) {
                this.node.x += targetWorldPoint.x - cameraPoint.x - this.offset.x;
            } else {
                this.node.x += targetWorldPoint.x - cameraPoint.x + this.offset.x;
            }
            move = true;
        }

        if (this.offset.y >= 0 && Math.abs(targetWorldPoint.y - cameraPoint.y) > this.offset.y) {
            if (targetWorldPoint.y > cameraPoint.y) {
                this.node.y += targetWorldPoint.y - cameraPoint.y - this.offset.y;
            } else {
                this.node.y += targetWorldPoint.y - cameraPoint.y + this.offset.y;
            }
            move = true;
        }
        if (move) {
            this.node.x = cc.clampf(this.node.x, this.cameraRect.xMin, this.cameraRect.xMax < 0 ? Number.MAX_VALUE : this.cameraRect.xMax);
            this.node.y = cc.clampf(this.node.y, this.cameraRect.yMin, this.cameraRect.yMax < 0 ? Number.MAX_VALUE : this.cameraRect.yMax);
            this.cameraUpdateEvents.forEach((handler: cc.Component.EventHandler) => {
                handler.emit([this.node]);
            })
        }
    }
}
