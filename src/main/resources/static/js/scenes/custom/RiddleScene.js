class RiddleScene extends Phaser.Scene {
    constructor() {
        super('RiddleScene');
        this.dialogActive = false;
        this.itemsFound = 0;
        this.totalItems = 3;
    }

    preload() {
        // 加载场景所需资源
        this.load.image('riddle-bg', 'assets/custom/riddle-bg.jpg');
        this.load.image('item1', 'assets/custom/item1.png');
        this.load.image('item2', 'assets/custom/item2.png');
        this.load.image('item3', 'assets/custom/item3.png');
        this.load.image('dialog-bg', 'assets/custom/dialog-bg.png');
        this.load.image('close-btn', 'assets/custom/close-btn.png');
        this.load.image('next-scene-btn', 'assets/custom/next-scene-btn.png');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 添加背景
        this.add.image(width / 2, height / 2, 'riddle-bg').setDisplaySize(width, height);
        
        // 添加场景标题
        this.add.text(width / 2, 50, '寻找隐藏的回忆', {
            fontSize: '36px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // 添加说明文字
        this.add.text(width / 2, 100, '点击画面中的特殊物品，找出我们的回忆', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // 添加可点击的物品 - 位置可以根据背景图调整
        this.setupClickableItem('item1', 200, 300, '这是我们第一次约会的电影票');
        this.setupClickableItem('item2', 400, 400, '记得这个贝壳吗？我们在海边捡到的');
        this.setupClickableItem('item3', 600, 350, '你送我的第一个礼物，我一直珍藏着');
        
        // 创建进度显示
        this.progressText = this.add.text(width - 150, height - 50, `进度: ${this.itemsFound}/${this.totalItems}`, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        
        // 创建对话框容器（初始不可见）
        this.dialogContainer = this.add.container(width / 2, height / 2).setVisible(false);
        
        // 对话框背景
        this.dialogBg = this.add.image(0, 0, 'dialog-bg').setScale(0.8);
        this.dialogContainer.add(this.dialogBg);
        
        // 对话框文本
        this.dialogText = this.add.text(0, 0, '', {
            fontSize: '24px',
            fill: '#000000',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 400 }
        }).setOrigin(0.5);
        this.dialogContainer.add(this.dialogText);
        
        // 关闭按钮
        const closeBtn = this.add.image(200, -150, 'close-btn').setScale(0.6);
        closeBtn.setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.closeDialog());
        this.dialogContainer.add(closeBtn);
        
        // 下一场景按钮（初始不可见）
        this.nextSceneBtn = this.add.image(width / 2, height - 100, 'next-scene-btn')
            .setInteractive({ useHandCursor: true })
            .setVisible(false);
            
        this.nextSceneBtn.on('pointerdown', () => {
            this.scene.start('QuizScene');
        });
    }
    
    setupClickableItem(key, x, y, dialogText) {
        // 创建可点击物品 - 初始隐藏，只显示热区
        const hotspot = this.add.circle(x, y, 30, 0xff0000, 0.0);
        hotspot.setInteractive({ useHandCursor: true });
        
        // 添加点击事件
        hotspot.on('pointerdown', () => {
            if (!this.dialogActive) {
                // 显示物品
                const item = this.add.image(x, y, key).setScale(0.3);
                
                // 添加动画效果
                this.tweens.add({
                    targets: item,
                    scale: 0.5,
                    duration: 300,
                    ease: 'Bounce.easeOut',
                    onComplete: () => {
                        // 显示对话框
                        this.showDialog(dialogText);
                        
                        // 标记物品已找到
                        hotspot.disableInteractive();
                        this.itemsFound++;
                        this.progressText.setText(`进度: ${this.itemsFound}/${this.totalItems}`);
                        
                        // 检查是否所有物品都找到了
                        if (this.itemsFound >= this.totalItems) {
                            this.showNextSceneButton();
                        }
                    }
                });
            }
        });
        
        // 添加提示效果
        this.tweens.add({
            targets: hotspot,
            scale: { from: 1, to: 1.2 },
            alpha: { from: 0, to: 0.3 },
            yoyo: true,
            repeat: -1,
            duration: 1000
        });
    }
    
    showDialog(text) {
        this.dialogActive = true;
        this.dialogText.setText(text);
        this.dialogContainer.setVisible(true);
        
        // 添加动画效果
        this.tweens.add({
            targets: this.dialogContainer,
            scale: { from: 0.8, to: 1 },
            alpha: { from: 0, to: 1 },
            duration: 300
        });
    }
    
    closeDialog() {
        // 添加关闭动画
        this.tweens.add({
            targets: this.dialogContainer,
            scale: { from: 1, to: 0.8 },
            alpha: { from: 1, to: 0 },
            duration: 300,
            onComplete: () => {
                this.dialogContainer.setVisible(false);
                this.dialogActive = false;
            }
        });
    }
    
    showNextSceneButton() {
        // 显示完成提示和下一场景按钮
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 150, 
            '太棒了！你找到了所有的回忆！', {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        this.nextSceneBtn.setVisible(true);
        
        // 添加动画效果
        this.tweens.add({
            targets: this.nextSceneBtn,
            scale: { from: 0.8, to: 1 },
            alpha: { from: 0, to: 1 },
            duration: 500
        });
    }
} 