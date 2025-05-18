class PuzzleScene1 extends Phaser.Scene {
    constructor() {
        super('PuzzleScene1');
        this.attempts = 0;
        this.maxAttempts = 3;
        // 这里设置谜题的答案，例如你们第一次见面的日期、初次约会的地点等
        this.answer = "520"; // 示例答案，你可以修改为你们的纪念日或特殊日期
        this.videoPlaying = false; // 添加视频播放状态标记
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.add.image(width / 2, height / 2, 'puzzle1-bg').setDisplaySize(width, height);
        
        // 谜题标题
        this.add.text(width / 2, 100, '谜题一：我们的特殊数字', {
            fontSize: '36px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // 谜题描述（这里可以放你们之间的特殊提示，需要她思考的内容）
        const description = "亲爱的，还记得那个对我们有特殊意义的数字吗？\n那个见证我们感情的日子...\n提示：这是一个3位数";
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
        inputElement.maxLength = 10;
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
        this.game.global.saveProgress(1, { attempts: this.attempts });
        
        // 从全局变量获取视频加载状态
        this.videoLoaded = this.game.global && this.game.global.videoLoaded && 
                          this.game.global.videoLoaded['wrong-video'] || false;
        
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
            this.resultText.setText('恭喜你答对了！');
            this.resultText.setStyle({ fill: '#00ff00' });
            
            // 安全播放成功音效
            if (this.game.global && this.game.global.playSound) {
                this.game.global.playSound('success');
            }
            
            // 粒子特效 - 使用Phaser 3.70.0的新API
            try {
                // 直接创建粒子
                this.add.particles(this.cameras.main.width / 2, this.cameras.main.height / 2, 'heart', {
                    speed: { min: 100, max: 200 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 0.3, end: 0 },
                    lifespan: 2000,
                    quantity: 5,
                    frequency: 100,
                    duration: 1000
                });
            } catch(e) {
                console.error('创建粒子效果失败:', e);
            }
            
            // 2秒后进入下一个谜题
            this.time.delayedCall(2000, () => {
                this.scene.start('PuzzleScene2');
            });
        } else {
            // 答案错误
            this.attempts++;
            this.resultText.setText(`答案不正确，再试一次吧！尝试次数: ${this.attempts}/${this.maxAttempts}`);
            this.resultText.setStyle({ fill: '#ff0000' });
            
            // 保存游戏进度
            this.game.global.saveProgress(1, { attempts: this.attempts });
            
            // 如果没有视频正在播放，则播放错误视频或显示错误文本
            if (!this.videoPlaying) {
                this.videoPlaying = true;
                
                // 创建半透明背景
                const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.8);
                overlay.setOrigin(0);
                overlay.setDepth(10);
                
                if (this.videoLoaded) {
                    // 视频加载成功，播放视频
                    const video = this.add.video(this.cameras.main.width / 2, this.cameras.main.height / 2, 'wrong-video');
                    video.setDepth(11);
                    video.play();
                    
                    // 视频播放完毕后移除视频和背景
                    video.on('complete', () => {
                        video.destroy();
                        overlay.destroy();
                        this.videoPlaying = false;
                        
                        // 如果尝试次数达到上限，显示提示
                        if (this.attempts >= this.maxAttempts) {
                            this.showHint();
                        }
                    });
                } else {
                    // 视频加载失败，显示错误文本
                    const errorText = this.add.text(
                        this.cameras.main.width / 2,
                        this.cameras.main.height / 2,
                        "答案错误！\n请再次思考...",
                        {
                            fontSize: '32px',
                            fill: '#ffffff',
                            fontFamily: 'Arial',
                            align: 'center'
                        }
                    ).setOrigin(0.5).setDepth(11);
                    
                    // 3秒后移除文本和背景
                    this.time.delayedCall(3000, () => {
                        errorText.destroy();
                        overlay.destroy();
                        this.videoPlaying = false;
                        
                        // 如果尝试次数达到上限，显示提示
                        if (this.attempts >= this.maxAttempts) {
                            this.showHint();
                        }
                    });
                }
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
        
        // 提示内容（这里可以放更明确的线索）
        const hintText = this.add.text(width / 2, height / 2, '想想我们在一起的特殊日子\n表白日期和爱情节日\n我 ♡ 你 = ?', {
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
            }
            overlay.destroy();
            dialog.destroy();
            titleText.destroy();
            hintText.destroy();
            closeButton.destroy();
        });
    }
} 