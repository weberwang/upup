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
export default class Ball extends cc.Component {

    private force: boolean = true;

    onBeginContact(contact: cc.PhysicsContact, a: cc.Collider, b: cc.Collider) {
        cc.log("onBeginContact");
        if (b.node.group === "boom") {
            if(this.force){
                cc.log("撞击爆炸")
            } else {
                cc.log("松手不爆炸");
                contact.disabled = true;
            }
        }
    }

    onEndContact(contact: cc.PhysicsContact, a: cc.Collider, b: cc.Collider) {
        cc.log("onEndContact")
    }

    applyForce(force: boolean) {
        this.force = force;
    }
}
