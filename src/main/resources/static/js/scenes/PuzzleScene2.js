class PuzzleScene2 extends Phaser.Scene {
    constructor() {
        super('PuzzleScene2');
        this.attempts = 0;
        this.maxAttempts = 3;
        // 这里可以设置你们第一次约会的地点或者一个对你们有特殊意义的地方
        this.answer = "公园"; // 示例答案，请修改为你们的特殊地点
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.add.image(width / 2, height / 2, 'puzzle2-bg').setDisplaySize(width, height);
        
        // 谜题标题
        this.add.text(width / 2, 100, '谜题二：我们的特殊地点', {
            fontSize: '36px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        // 谜题描述（这里可以用一些照片或提示来引导她回忆）
        const description = "亲爱的，还记得我们第一次约会的地方吗？\n那个充满浪漫回忆的地方...\n提示：这个地方我们经常一起散步";
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
            this.sound.play('click');
            this.checkAnswer();
        });
        
        // 提示按钮
        const hintButton = this.add.image(width - 100, height - 50, 'hint-btn');
        hintButton.setScale(0.7);
        hintButton.setInteractive({ useHandCursor: true });
        hintButton.on('pointerover', () => hintButton.setScale(0.8));
        hintButton.on('pointerout', () => hintButton.setScale(0.7));
        hintButton.on('pointerdown', () => {
            this.sound.play('click');
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
        this.game.global.saveProgress(2, { attempts: this.attempts });
        
        // 添加回忆照片（如果有的话）
        // 这里可以添加你们一起在特定地点的照片作为提示
        // this.add.image(width / 2, height / 2 - 150, 'memory-photo1').setScale(0.3);
    }
    
    checkAnswer() {
        const answer = this.inputElement.value.trim();
        
        if (answer.toLowerCase() === this.answer.toLowerCase()) {
            // 答案正确
            this.resultText.setText('恭喜你答对了！');
            this.resultText.setStyle({ fill: '#00ff00' });
            
            // 播放成功音效
            this.sound.play('success');
            
            // 粒子特效
            const particles = this.add.particles('heart');
            particles.createEmitter({
                x: this.cameras.main.width / 2,
                y: this.cameras.main.height / 2,
                speed: { min: 100, max: 200 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.3, end: 0 },
                lifespan: 2000,
                quantity: 5,
                frequency: 100,
                duration: 1000
            });
            
            // 显示回忆文本
            const memoryText = this.add.text(
                this.cameras.main.width / 2, 
                this.cameras.main.height / 2 - 100,
                "那天，我们在这里度过了非常美好的时光...", 
                {
                    fontSize: '20px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    align: 'center'
                }
            ).setOrigin(0.5);
            
            // 2秒后进入下一个谜题
            this.time.delayedCall(3000, () => {
                this.scene.start('PuzzleScene3');
            });
        } else {
            // 答案错误
            this.attempts++;
            this.resultText.setText(`答案不正确，再试一次吧！尝试次数: ${this.attempts}/${this.maxAttempts}`);
            this.resultText.setStyle({ fill: '#ff0000' });
            
            // 保存游戏进度
            this.game.global.saveProgress(2, { attempts: this.attempts });
            
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
        
        // 提示内容（这里需要更明确的提示，引导她回忆）
        const hintText = this.add.text(width / 2, height / 2, '记得我们第一次牵手的地方吗？\n那个有许多树木和长椅的地方\n我们在那里拍了许多照片...', {
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
            this.sound.play('click');
            overlay.destroy();
            dialog.destroy();
            titleText.destroy();
            hintText.destroy();
            closeButton.destroy();
        });
    }
} 