import Ball from "./ball";
import BoomFactory from "./boomFactory";

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

    @property(cc.RigidBody)
    ballBody: cc.RigidBody = null;

    @property(cc.Node)
    nodeCamera: cc.Node = null;

    private forcePower: number = 1000;

    private touch: boolean = false;
    private motorJoint: cc.MotorJoint = null;

    private boomFactory: BoomFactory = null;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        this.motorJoint = this.ballBody.getComponent(cc.MotorJoint);
        this.boomFactory = this.getComponent(BoomFactory);
    }
    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.boomFactory.createRowBooms();
    }

    onTouchStart() {
        this.touch = true;
    }

    onTouchEnd() {
        this.touch = false;
    }

    update(dt) {
        if (this.motorJoint.connectedBody) {
            if (this.touch) {
                this.motorJoint.maxForce = 100;
                this.motorJoint.collideConnected = true;
                this.motorJoint.apply();
            } else {
                this.motorJoint.maxForce = 0;
                this.motorJoint.collideConnected = false;
                this.motorJoint.apply();
                this.motorJoint.connectedBody.linearVelocity = cc.Vec2.ZERO;
            }
        }
    }

}
