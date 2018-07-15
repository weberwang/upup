import Ball from "./ball";

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
    boomContent: cc.Node = null;

    @property(cc.Node)
    nodeCamera: cc.Node = null;

    @property(cc.Prefab)
    pfbBoom:cc.Prefab = null;

    private forcePower: number = 1000;

    private touch: boolean = false;
    private motorJoint: cc.MotorJoint = null;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        this.motorJoint = this.ballBody.getComponent(cc.MotorJoint);
    }
    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        
        let boom = cc.instantiate(this.pfbBoom);
        boom.parent = this.boomContent;
        this.ballBody.getComponent(cc.MotorJoint).connectedBody = boom.getComponent(cc.RigidBody);
    }

    onTouchStart() {
        this.touch = true;
    }

    onTouchEnd() {
        this.touch = false;
    }

    update(dt) {
        if (this.touch) {
            // let subPosition = cc.pSub(this.boomBody.node.position, this.ballBody.node.position);
            // let force = cc.pMult(subPosition.normalizeSelf(), this.forcePower * this.ballBody.getMass());
            // this.ballBody.applyForceToCenter(force, true);
            this.motorJoint.maxForce = 100;
            this.motorJoint.collideConnected = true;
            this.motorJoint.apply();
        } else {
            this.motorJoint.maxForce = 0;
            this.motorJoint.collideConnected = false;
            this.motorJoint.apply();
            this.motorJoint.connectedBody.linearVelocity = cc.Vec2.ZERO;
        }
        // this.nodeCamera.y += 1;
    }

}
