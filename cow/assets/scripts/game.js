cc.Class({
    extends: cc.Component,

    properties: {
        //绳子结点
        rope_node: {
            default : null,
            type : cc.Node
        },

        //牛牛结点
        cow_ins: {
            default: null,
            type: cc.Node
        },

        //图片数组
        rope_imgs: {
            default:[],
            type:cc.SpriteFrame
        },
        //预置体
        cow_prefab: {
            default:null,
            type:cc.Prefab
        }
    },


    onLoad () {
        this.success = false;
        // 初始分数
        this.scoreNum = 0;

    },


    start () {

        // 获得计时器组件
        let countDownLabel = cc.find("Canvas/bg_sprite/count_down").getComponent(cc.Label);
        let time = 60;
        // 倒计时
        this.schedule(function () {
            time--;
            countDownLabel.string = "Time:" + time + "s";

            if (time == 0) {
                // 获取结果弹窗节点
                let resultNode = cc.find("Canvas/result");
                // 通过getChildByName获得子节点， title 和 content
                let titleNode = resultNode.getChildByName("title");
                let contentNode = resultNode.getChildByName("content");

                // 最终得分显示
                let num;
                if(this.scoreNum != 0){
                    num = this.scoreNum;
                    titleNode.getComponent(cc.Label).string ="最终得分 "+num ;
                    cc.log(num+"=========");
                }

                // 最终成就
                let contentLabel = contentNode.getComponent(cc.Label);
                switch (true) {
                    case num <= 3:
                        contentLabel.string = "套牛青铜";
                        break;
                    case num < 6:
                        contentLabel.string = "套牛高手";
                        break;
                    case num >=6:
                        contentLabel.string = "套牛王者";
                        break;
                }
                resultNode.active = true;
                // 暂停游戏
                cc.director.pause();
            }

        },1);

        
    },


    /**
     *  捕获按钮点击事件
     * @param event
     * @param customEventDate
     */
    clickCapture:function (event,customEventDate) {
        //绳子出现
        this.rope_node.active = true;
        // 设置绳子在当前父节点的顺序
        this.rope_node.setSiblingIndex(100);
        // 设置绳子起始位置
        this.rope_node.y = -480;
        // 向上移动
        const up = cc.moveTo(0.5,this.rope_node.x,60);



        // 判定结果
        let result =  cc.callFunc(function () {
            // 获取当前牛儿的x点
            let currentX = this.cow_ins.x;
            if (currentX > -50 && currentX < 50){
                cc.log("捕捉成功！");
                // 背景牛 先移除
                let bgNode = this.node.getChildByName("bg_sprite");
                bgNode.removeChild(this.cow_ins);

                // 获取绳子的类型
                let ropeType = this.cow_ins.getComponent("cow").randomType +1;
                this.rope_node.getComponent(cc.Sprite).spriteFrame = this.rope_imgs[ropeType];

                // 生成新的牛节点
                this.cow_ins = cc.instantiate(this.cow_prefab);
                this.cow_ins.y = 0;
                bgNode.addChild(this.cow_ins);

                //
                this.success = true;
                // 分数+1
                this.scoreNum++;

            } else {
                cc.log("捕捉失败！")
            }

        },this);

        // 往回拉
        let down = cc.moveTo(0.5,this.rope_node.x,-600);

        //重置绳子
        let finish = cc.callFunc(function () {
            this.rope_node.getComponent(cc.Sprite).spriteFrame = this.rope_imgs[0];
            // 判断是否捕捉成功
            if (this.success == true) {
                let  scoreLabel = cc.find("Canvas/bg_sprite/score").getComponent(cc.Label);
                scoreLabel.string = "Score:" + this.scoreNum;
                this.success = false;
            }
        },this);

        // 定义一个序列动画
        let sequence = cc.sequence(up,result,down,finish);
        this.rope_node.runAction(sequence);
    },

    // 关闭按钮，继续游戏
    closeBtn() {
        cc.log("继续游戏");
        cc.director.resume();
        cc.director.loadScene("game");
    }
});
