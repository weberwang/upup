import Ball from "./ball";
import BoomFactory from "./boomFactory";
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
export default class NewClass extends cc.Component {

    @property(cc.RigidBody)
    ballBody: cc.RigidBody = null;

    @property(cc.Node)
    nodeCamera: cc.Node = null;

    private forcePower: number = 1000;

    private touch: boolean = false;
    private motorJoint: cc.MotorJoint = null;

    private boomFactory: BoomFactory = null;
    private ball: Ball = null;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        this.motorJoint = this.ballBody.getComponent(cc.MotorJoint);
        this.boomFactory = this.getComponent(BoomFactory);
        this.ball = this.ballBody.getComponent(Ball);
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.boomFactory.startGame();
    }

    onTouchStart() {
        this.touch = true;
        let nearBoom = this.findNearestBoom();
        if (!nearBoom) return;
        let body = nearBoom.getComponent(cc.RigidBody);
        body.active = true;
        this.motorJoint.connectedBody = body;
        this.motorJoint.apply();
        this.ball.applyForce(true);
    }

    onTouchEnd() {
        this.touch = false;
        if (!this.motorJoint.connectedBody) return;
        this.motorJoint.connectedBody.active = false;
        this.motorJoint.connectedBody.linearVelocity = cc.Vec2.ZERO;
        this.motorJoint.maxForce = 0;
        this.motorJoint.collideConnected = false;
        this.motorJoint.connectedBody = null;
        this.motorJoint.apply();
        this.ballBody.getComponent(Ball)
        this.ball.applyForce(false);
    }

    update(dt) {
        if (this.touch) {
            if (this.motorJoint.connectedBody) {
                this.motorJoint.maxForce = 100;
                this.motorJoint.collideConnected = true;
                this.motorJoint.apply();
            }
        }

        let worldPoint = this.ball.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let cameraWorldPoint = cc.Camera.main.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        if(worldPoint.y < cameraWorldPoint.y - cc.winSize.height/2){
            cc.log("游戏结束");
        }
    }

    findNearestBoom(): cc.Node {
        let findRow: number;
        let mRow: number;
        let distanceSQ: number;
        let mDis: number;
        let nearBoom: cc.Node;
        for (const boom of this.boomFactory.allBooms) {
            let localPosition: cc.Vec2 = this.ballBody.node.parent.convertToNodeSpaceAR(boom.convertToWorldSpaceAR(cc.Vec2.ZERO));
            mRow = boom.getComponent(Boom).row;
            if (findRow == null) {
                findRow = mRow
            } else if (findRow - mRow > 1) {
                return nearBoom;
            }
            //不处理太近的
            if (localPosition.y > this.ballBody.node.y && cc.pDistanceSQ(localPosition, this.ball.node.position) >= 200 * 200) {
                mDis = cc.pDistanceSQ(localPosition, this.ballBody.node.position);
                if (!distanceSQ || (distanceSQ && distanceSQ > mDis)) {
                    distanceSQ = mDis;
                    nearBoom = boom;
                }
            }
        }
        return nearBoom;
    }

    onCameraUpdate(camera: cc.Node) {

    }

    onPreUpdate(targetWorldPoint: cc.Vec2, cameraWorldPoint: cc.Vec2): boolean {
        if (targetWorldPoint.y < cameraWorldPoint.y) {
            return false;
        }
        return true;
    }
}
