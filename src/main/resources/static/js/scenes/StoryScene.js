class StoryScene extends Phaser.Scene {
    constructor() {
        super('StoryScene');
        this.storyIndex = 0;
        // 在这里可以设置你们的故事内容，这些只是示例
        this.storyTexts = [
            "亲爱的，欢迎来到我们的回忆之旅",
            "还记得我们第一次见面的时候吗？那是在...",
            "我永远记得你第一次对我笑的样子...",
            "我们一起去过的那些地方，留下了多少美好的回忆...",
            "现在，让我们一起通过几个小谜题回顾我们的故事吧",
            "准备好了吗？我们的解密旅程即将开始！"
        ];
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.add.image(width / 2, height / 2, 'story-bg').setDisplaySize(width, height);
        
        // 故事文本
        this.storyText = this.add.text(width / 2, height / 2, this.storyTexts[0], {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: width - 100 }
        }).setOrigin(0.5);
        
        // "下一步"按钮
        this.nextButton = this.add.image(width - 100, height - 50, 'next-btn');
        this.nextButton.setScale(0.8);
        this.nextButton.setInteractive({ useHandCursor: true });
        this.nextButton.on('pointerdown', () => {
            this.sound.play('click');
            this.nextStory();
        });
        
        // 添加闪烁动画
        this.tweens.add({
            targets: this.nextButton,
            alpha: { from: 1, to: 0.6 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        // 保存游戏进度
        this.game.global.saveProgress(0, { storyIndex: this.storyIndex });
    }
    
    nextStory() {
        this.storyIndex++;
        
        if (this.storyIndex < this.storyTexts.length) {
            // 更新故事文本
            this.storyText.setText(this.storyTexts[this.storyIndex]);
            
            // 淡入效果
            this.tweens.add({
                targets: this.storyText,
                alpha: { from: 0, to: 1 },
                duration: 500
            });
            
            // 保存游戏进度
            this.game.global.saveProgress(0, { storyIndex: this.storyIndex });
        } else {
            // 故事结束，进入第一个谜题场景
            this.scene.start('PuzzleScene1');
        }
    }
} 