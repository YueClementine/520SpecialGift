class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // 创建加载界面
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 加载背景
        const bg = this.add.image(width / 2, height / 2, 'loading-background');
        bg.setDisplaySize(width, height);
        
        // 加载进度条
        const loadingBar = this.add.image(width / 2, height / 2, 'loading-bar');
        loadingBar.setOrigin(0.5, 0.5);
        
        // 加载进度文本
        const loadingText = this.add.text(width / 2, height / 2 + 50, '加载中...', {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // 显示加载进度
        this.load.on('progress', (value) => {
            loadingBar.scaleX = value;
            loadingText.setText(`加载中... ${Math.floor(value * 100)}%`);
        });
        
        // 加载游戏资源
        this.load.image('background', 'assets/background.jpg');
        this.load.image('logo', 'assets/logo.png');
        this.load.image('start-btn', 'assets/start-button.png');
        this.load.image('continue-btn', 'assets/continue-button.png');
        
        // 故事场景资源
        this.load.image('story-bg', 'assets/story-bg.jpg');
        this.load.image('next-btn', 'assets/next-button.png');
        
        // 谜题场景资源
        this.load.image('puzzle1-bg', 'assets/puzzle1-bg.jpg');
        this.load.image('puzzle2-bg', 'assets/puzzle2-bg.jpg');
        this.load.image('puzzle3-bg', 'assets/puzzle3-bg.jpg');
        this.load.image('hint-btn', 'assets/hint-button.png');
        this.load.image('submit-btn', 'assets/submit-button.png');
        
        // 最终场景资源
        this.load.image('final-bg', 'assets/final-bg.jpg');
        this.load.image('heart', 'assets/heart.png');
        
        // 音频资源
        this.load.audio('bgm', 'assets/bgm.mp3');
        this.load.audio('success', 'assets/success.mp3');
        this.load.audio('click', 'assets/click.mp3');
    }

    create() {
        // 创建音频对象
        this.sound.add('bgm', { loop: true, volume: 0.5 });
        this.sound.add('success', { loop: false, volume: 0.7 });
        this.sound.add('click', { loop: false, volume: 0.5 });
        
        // 进入主菜单
        this.scene.start('MainMenu');
    }
} 