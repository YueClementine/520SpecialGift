class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        const bg = this.add.image(width / 2, height / 2, 'background');
        bg.setDisplaySize(width, height);
        
        // 标题
        const logo = this.add.image(width / 2, height / 4, 'logo');
        logo.setScale(0.8);
        
        // 创建粒子效果
        const particles = this.add.particles('heart');
        const emitter = particles.createEmitter({
            x: width / 2,
            y: height / 2,
            lifespan: 2000,
            speed: { min: 50, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            quantity: 1,
            frequency: 500
        });
        
        // 添加游戏选择文本
        this.add.text(width / 2, height / 2 - 100, '选择游戏模式', {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // 原始游戏按钮
        const startButton = this.add.image(width / 2, height / 2 - 30, 'start-btn');
        startButton.setInteractive({ useHandCursor: true });
        startButton.on('pointerover', () => startButton.setScale(1.1));
        startButton.on('pointerout', () => startButton.setScale(1));
        startButton.on('pointerdown', () => {
            this.sound.play('click');
            this.showNameInput('story');
        });
        
        // 添加原始游戏文本
        this.add.text(width / 2, height / 2 - 30, '故事模式', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // 解密游戏按钮
        const riddleButton = this.add.image(width / 2, height / 2 + 30, 'start-btn');
        riddleButton.setInteractive({ useHandCursor: true });
        riddleButton.on('pointerover', () => riddleButton.setScale(1.1));
        riddleButton.on('pointerout', () => riddleButton.setScale(1));
        riddleButton.on('pointerdown', () => {
            this.sound.play('click');
            this.showNameInput('riddle');
        });
        
        // 添加解密游戏文本
        this.add.text(width / 2, height / 2 + 30, '寻找回忆', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // 问答游戏按钮
        const quizButton = this.add.image(width / 2, height / 2 + 90, 'start-btn');
        quizButton.setInteractive({ useHandCursor: true });
        quizButton.on('pointerover', () => quizButton.setScale(1.1));
        quizButton.on('pointerout', () => quizButton.setScale(1));
        quizButton.on('pointerdown', () => {
            this.sound.play('click');
            this.showNameInput('quiz');
        });
        
        // 添加问答游戏文本
        this.add.text(width / 2, height / 2 + 90, '爱的问答', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // 拼图游戏按钮
        const puzzleButton = this.add.image(width / 2, height / 2 + 150, 'start-btn');
        puzzleButton.setInteractive({ useHandCursor: true });
        puzzleButton.on('pointerover', () => puzzleButton.setScale(1.1));
        puzzleButton.on('pointerout', () => puzzleButton.setScale(1));
        puzzleButton.on('pointerdown', () => {
            this.sound.play('click');
            this.showNameInput('puzzle');
        });
        
        // 添加拼图游戏文本
        this.add.text(width / 2, height / 2 + 150, '回忆拼图', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // 继续游戏按钮
        const continueButton = this.add.image(width / 2, height - 80, 'continue-btn');
        continueButton.setInteractive({ useHandCursor: true });
        continueButton.on('pointerover', () => continueButton.setScale(1.1));
        continueButton.on('pointerout', () => continueButton.setScale(1));
        continueButton.on('pointerdown', () => {
            this.sound.play('click');
            this.loadSavedGame();
        });
        
        // 播放背景音乐
        if (!this.sound.get('bgm').isPlaying) {
            this.sound.play('bgm');
        }
        
        // 添加5·20特效
        const style = {
            fontSize: '72px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#ff4081'
        };
        
        const text520 = this.add.text(width / 2, height - 200, '520', style);
        text520.setOrigin(0.5);
        
        // 添加闪烁动画
        this.tweens.add({
            targets: text520,
            alpha: { from: 1, to: 0.5 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }
    
    showNameInput(gameMode) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 创建半透明背景
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0);
        
        // 创建对话框
        const dialog = this.add.rectangle(width / 2, height / 2, 400, 200, 0xffffff);
        dialog.setOrigin(0.5);
        
        // 提示文本
        const promptText = this.add.text(width / 2, height / 2 - 50, '亲爱的，请输入你的名字:', {
            fontSize: '20px',
            fill: '#000000',
            fontFamily: 'Arial'
        });
        promptText.setOrigin(0.5);
        
        // 创建DOM输入框
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.style = 'width: 300px; padding: 10px; font-size: 16px;';
        inputElement.maxLength = 20;
        
        const inputDOM = this.add.dom(width / 2, height / 2).createElement('div');
        inputDOM.appendChild(inputElement);
        
        // 确定按钮
        const confirmButton = this.add.text(width / 2, height / 2 + 50, '确定', {
            fontSize: '20px',
            fill: '#ff4081',
            fontFamily: 'Arial',
            padding: { x: 20, y: 10 },
            backgroundColor: '#ffe0e9'
        });
        confirmButton.setOrigin(0.5);
        confirmButton.setInteractive({ useHandCursor: true });
        
        confirmButton.on('pointerup', () => {
            const name = inputElement.value.trim();
            if (name) {
                this.game.global.playerName = name;
                
                // 根据游戏模式跳转到不同场景
                switch(gameMode) {
                    case 'story':
                        this.scene.start('StoryScene');
                        break;
                    case 'riddle':
                        this.scene.start('RiddleScene');
                        break;
                    case 'quiz':
                        this.scene.start('QuizScene');
                        break;
                    case 'puzzle':
                        this.scene.start('PuzzleScene');
                        break;
                    default:
                        this.scene.start('StoryScene');
                }
                
                this.sound.play('click');
            }
        });
    }
    
    loadSavedGame() {
        // 尝试加载保存的游戏进度
        this.game.global.loadProgress().then(hasProgress => {
            if (hasProgress) {
                // 根据保存的进度切换到相应场景
                const currentLevel = this.game.global.progress;
                switch (currentLevel) {
                    case 1:
                        this.scene.start('PuzzleScene1');
                        break;
                    case 2:
                        this.scene.start('PuzzleScene2');
                        break;
                    case 3:
                        this.scene.start('PuzzleScene3');
                        break;
                    case 4:
                        this.scene.start('FinalScene');
                        break;
                    default:
                        this.scene.start('StoryScene');
                }
            } else {
                // 没有保存的进度，显示提示
                this.showNoProgressDialog();
            }
        });
    }
    
    showNoProgressDialog() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 创建半透明背景
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0);
        
        // 创建对话框
        const dialog = this.add.rectangle(width / 2, height / 2, 400, 200, 0xffffff);
        dialog.setOrigin(0.5);
        
        // 提示文本
        const promptText = this.add.text(width / 2, height / 2 - 30, '未找到保存的游戏进度', {
            fontSize: '20px',
            fill: '#000000',
            fontFamily: 'Arial'
        });
        promptText.setOrigin(0.5);
        
        // 确定按钮
        const confirmButton = this.add.text(width / 2, height / 2 + 30, '确定', {
            fontSize: '20px',
            fill: '#ff4081',
            fontFamily: 'Arial',
            padding: { x: 20, y: 10 },
            backgroundColor: '#ffe0e9'
        });
        confirmButton.setOrigin(0.5);
        confirmButton.setInteractive({ useHandCursor: true });
        
        confirmButton.on('pointerup', () => {
            overlay.destroy();
            dialog.destroy();
            promptText.destroy();
            confirmButton.destroy();
            this.sound.play('click');
        });
    }
} 