// 用cc.class 生成一个对象，包含数组皮肤
const cow_skin = cc.Class({
    name:"cow_skin",
    properties:{
        cows:{
            default:[],
            type:[cc.SpriteFrame]
        }
    }
});


cc.Class({
    extends: cc.Component,

    properties: {
        //牛的类型数组
        cow_sets: {
            default: [],
            type: [cow_skin]
        }
    },


    onLoad () {
        //初始化一下
        this.intervalTime = 0;

        // 随机一种类型
        this.randomType = Math.floor(Math.random()*3);
    },

    start () {

    },


    //update回调函数实现帧动画，更换皮肤
    update (dt) {
        //间隔时间
        this.intervalTime += dt;
        // 每隔0.2秒更换皮肤
        let index  = Math.floor(this.intervalTime / 0.2);
        index = index % 3;
        // 获取一种牛的类型
        let cowSet = this.cow_sets[this.randomType];


        // 获取精灵组件
        let sprite = this.node.getComponent(cc.Sprite);
        // 设置皮肤
        sprite.spriteFrame = cowSet.cows[index]
    },

    //触发事件
    runCallBack() {
        cc.log("一个轮回结束！");
        this.randomType = Math.floor(Math.random()*3);
    }
});
