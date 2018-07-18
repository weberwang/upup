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
export default class Boom extends cc.Component {

    private body: cc.RigidBody;

    private _row: number = 0;
    public get row() {
        return this._row;
    }
    public set row(value: number) {
        if (this._row !== value) {
            this._row = value;
        }
    }

    onLoad() {
        this.body = this.getComponent(cc.RigidBody);
    }

    start() {
        this.getComponent(cc.RigidBody).active = false;
    }

    showWarn() {
        cc.log("警告，太过接近");
    }

    onEndContact() {
        this.body.linearVelocity = cc.Vec2.ZERO;
    }
}
