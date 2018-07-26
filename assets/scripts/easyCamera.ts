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
export default class NewClass extends cc.Component {
    @property({type: cc.Node, tooltip: "目标显示对象"})
    target: cc.Node = null;
    @property({tooltip: "相机限定区域, 尺寸为负表示不限制"})
    cameraRect: cc.Rect = new cc.Rect();
    @property({tooltip: "目标显示对象移动相对相机偏移量超过指定大小，相机开始移动,负值忽略"})
    offset: cc.Vec2 = cc.v2();
    // @property({type: cc.Integer, tooltip: "限制某些方向的移动0:不限制1:右2:上3:左4:下"})
    // fixDirections: number[] = [];
    @property({type: cc.Component.EventHandler, tooltip: "移动之前的判断"})
    onPreUpdate: cc.Component.EventHandler = new cc.Component.EventHandler();
    @property({type: cc.Component.EventHandler, tooltip: "相机移动触发的事件"})
    cameraUpdateEvents: cc.Component.EventHandler[] = [];

    resetInEditor() {
        if (!this.getComponent(cc.Camera)) {
            this.enabled = false;
        } else {
            cc.log("加载相机");
        }
    }

    update() {
        let direction = 0;
        var targetWorldPoint = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var cameraWorldPoint = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        if (this.offset.x >= 0 && Math.abs(targetWorldPoint.x - cameraWorldPoint.x) > this.offset.x) {
            if (targetWorldPoint.x > cameraWorldPoint.x) {
                direction = 3;
            } else {
                direction = 1;
            }
        }

        if (this.offset.y >= 0 && Math.abs(targetWorldPoint.y - cameraWorldPoint.y) > this.offset.y) {
            if (targetWorldPoint.y > cameraWorldPoint.y) {
                direction = 4;
            } else {
                direction = 2;
            }
        }
        if (direction !== 0) {
            if (this.onPreUpdate.target == null || this.onPreUpdate.target.getComponent(this.onPreUpdate.component)[this.onPreUpdate.handler](targetWorldPoint, cameraWorldPoint)) {
                let lastX = this.node.x;
                let lastY = this.node.y;
                switch (direction) {
                    case 3:
                        this.node.x += targetWorldPoint.x - cameraWorldPoint.x - this.offset.x;
                        break;
                    case 1:
                        this.node.x += targetWorldPoint.x - cameraWorldPoint.x + this.offset.x;
                        break;
                    case 4:
                        this.node.y += targetWorldPoint.y - cameraWorldPoint.y - this.offset.y;
                        break;
                    case 2:
                        this.node.y += targetWorldPoint.y - cameraWorldPoint.y + this.offset.y;
                        break;
                }
                this.node.x = cc.clampf(this.node.x, this.cameraRect.xMin, this.cameraRect.xMax < 0 ? Number.MAX_VALUE : this.cameraRect.xMax);
                this.node.y = cc.clampf(this.node.y, this.cameraRect.yMin, this.cameraRect.yMax < 0 ? Number.MAX_VALUE : this.cameraRect.yMax);
                if (lastX !== this.node.x || lastY !== this.node.y) {
                    this.cameraUpdateEvents.forEach((handler: cc.Component.EventHandler) => {
                        handler.emit([this.node]);
                    });
                }
            }
        }
    }
}
