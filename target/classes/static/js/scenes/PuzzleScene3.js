class PuzzleScene3 extends Phaser.Scene {
    constructor() {
        super('PuzzleScene3');
        this.attempts = 0;
        this.maxAttempts = 3;
        // 这里可以设置你们之间的暗号或者对方最喜欢的事物
        this.answer = "巧克力"; // 示例答案，请修改为你女朋友最喜欢的东西
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.add.image(width / 2, height / 2, 'puzzle3-bg').setDisplaySize(width, height);
        
        // 谜题标题
        this.add.text(width / 2, 100, '谜题三：我最爱的礼物', {
            fontSize: '36px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // 谜题描述
        const description = "亲爱的，最后一个问题\n我最喜欢你送给我的是什么？\n那个让我每次收到都会特别开心的东西...";
        this.add.text(width / 2, 200, description, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: width - 200 }
        }).setOrigin(0.5);
        
        // 输入框背景
        const inputBg = this.add.rectangle(width / 2, height / 2, 300, 60, 0xffffff);
        inputBg.setOrigin(0.5);
        
        // 创建DOM输入框
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.style = 'width: 280px; height: 40px; font-size: 20px; text-align: center;';
        inputElement.maxLength = 20;
        inputElement.placeholder = '输入你的答案...';
        
        this.inputDOM = this.add.dom(width / 2, height / 2).createElement('div');
        this.inputDOM.appendChild(inputElement);
        this.inputElement = inputElement;
        
        // 提交按钮
        const submitButton = this.add.image(width / 2, height / 2 + 80, 'submit-btn');
        submitButton.setInteractive({ useHandCursor: true });
        submitButton.on('pointerover', () => submitButton.setScale(1.1));
        submitButton.on('pointerout', () => submitButton.setScale(1));
        submitButton.on('pointerdown', () => {
            // 安全播放音效
            if (this.game.global && this.game.global.playSound) {
                this.game.global.playSound('click');
            } else {
                // 回退方法
                try {
                    this.sound.play('click');
                } catch(e) {
                    console.error('无法播放音效:', e);
                }
            }
            this.checkAnswer();
        });
        
        // 提示按钮
        const hintButton = this.add.image(width - 100, height - 50, 'hint-btn');
        hintButton.setScale(0.7);
        hintButton.setInteractive({ useHandCursor: true });
        hintButton.on('pointerover', () => hintButton.setScale(0.8));
        hintButton.on('pointerout', () => hintButton.setScale(0.7));
        hintButton.on('pointerdown', () => {
            // 安全播放音效
            if (this.game.global && this.game.global.playSound) {
                this.game.global.playSound('click');
            } else {
                // 回退方法
                try {
                    this.sound.play('click');
                } catch(e) {
                    console.error('无法播放音效:', e);
                }
            }
            this.showHint();
        });
        
        // 结果文本（初始隐藏）
        this.resultText = this.add.text(width / 2, height / 2 + 150, '', {
            fontSize: '24px',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // 尝试加载保存的进度
        if (this.game.global.savedState && this.game.global.savedState.attempts) {
            this.attempts = this.game.global.savedState.attempts;
        }
        
        // 保存游戏进度
        this.game.global.saveProgress(3, { attempts: this.attempts });
        
        // 添加一些装饰
        try {
            this.add.particles(0, -10, 'heart', {
                x: { min: 0, max: width },
                speedY: { min: 50, max: 100 },
                scale: { start: 0.1, end: 0 },
                lifespan: 4000,
                frequency: 500
            });
        } catch(e) {
            console.error('创建粒子效果失败:', e);
        }
    }
    
    checkAnswer() {
        const answer = this.inputElement.value.trim();
        
        if (answer.toLowerCase() === this.answer.toLowerCase()) {
            // 答案正确
            this.resultText.setText('恭喜你，全部谜题都解开了！');
            this.resultText.setStyle({ fill: '#00ff00' });
            
            // 播放成功音效
            if (this.game.global && this.game.global.playSound) {
                this.game.global.playSound('success');
            } else {
                // 回退方法
                try {
                    this.sound.play('success');
                } catch(e) {
                    console.error('无法播放音效:', e);
                }
            }
            
            // 粒子特效 - 使用Phaser 3.70.0的新API
            try {
                // 直接创建粒子
                this.add.particles(this.cameras.main.width / 2, this.cameras.main.height / 2, 'heart', {
                    speed: { min: 100, max: 300 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 0.4, end: 0 },
                    lifespan: 3000,
                    quantity: 10,
                    frequency: 50,
                    duration: 2000
                });
            } catch(e) {
                console.error('创建粒子效果失败:', e);
            }
            
            // 显示成功文本
            const successText = this.add.text(
                this.cameras.main.width / 2, 
                this.cameras.main.height / 2 - 100,
                "你成功解开了所有谜题！\n现在，我有一个特别的话要对你说...", 
                {
                    fontSize: '24px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }
            ).setOrigin(0.5);
            
            // 3秒后进入最终场景
            this.time.delayedCall(5000, () => {
                this.scene.start('FinalScene');
            });
        } else {
            // 答案错误
            this.attempts++;
            this.resultText.setText(`答案不正确，再试一次吧！尝试次数: ${this.attempts}/${this.maxAttempts}`);
            this.resultText.setStyle({ fill: '#ff0000' });
            
            // 保存游戏进度
            this.game.global.saveProgress(3, { attempts: this.attempts });
            
            // 如果尝试次数达到上限，显示提示
            if (this.attempts >= this.maxAttempts) {
                this.showHint();
            }
        }
    }
    
    showHint() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 创建半透明背景
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0);
        
        // 创建对话框
        const dialog = this.add.rectangle(width / 2, height / 2, 400, 300, 0xffffff);
        dialog.setOrigin(0.5);
        
        // 提示标题
        const titleText = this.add.text(width / 2, height / 2 - 100, '提示', {
            fontSize: '28px',
            fill: '#ff4081',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });
        titleText.setOrigin(0.5);
        
        // 提示内容
        const hintText = this.add.text(width / 2, height / 2, '每次我送给你的时候\n你都会说这是你的最爱\n吃了会让你心情变好的东西', {
            fontSize: '20px',
            fill: '#000000',
            fontFamily: 'Arial',
            align: 'center'
        });
        hintText.setOrigin(0.5);
        
        // 关闭按钮
        const closeButton = this.add.text(width / 2, height / 2 + 100, '明白了', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            padding: { x: 20, y: 10 },
            backgroundColor: '#ff4081'
        });
        closeButton.setOrigin(0.5);
        closeButton.setInteractive({ useHandCursor: true });
        
        closeButton.on('pointerup', () => {
            // 安全播放音效
            if (this.game.global && this.game.global.playSound) {
                this.game.global.playSound('click');
            } else {
                // 回退方法
                try {
                    this.sound.play('click');
                } catch(e) {
                    console.error('无法播放音效:', e);
                }
            }
            overlay.destroy();
            dialog.destroy();
            titleText.destroy();
            hintText.destroy();
            closeButton.destroy();
        });
    }
} 