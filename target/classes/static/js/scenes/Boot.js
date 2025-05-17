class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // 加载基本资源
        this.load.image('loading-background', 'assets/loading-background.png');
        this.load.image('loading-bar', 'assets/loading-bar.png');
    }

    create() {
        // 设置游戏缩放
        this.scale.setGameSize(800, 600);
        
        // 过渡到加载场景
        this.scene.start('Preloader');
    }
} 