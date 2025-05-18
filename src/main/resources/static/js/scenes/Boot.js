class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // 只加载背景图片，背景已包含loading文字
        this.load.image('loading-background', 'assets/loading-background.png');
        // 移除loading-bar的加载
    }

    create() {
        // 确保游戏适应屏幕大小
        this.scale.refresh();
        
        // 注册窗口大小改变事件
        this.scale.on('resize', this.resize, this);
        
        // 过渡到加载场景
        this.scene.start('Preloader');
    }
    
    resize(gameSize) {
        // 确保所有游戏场景在窗口大小改变时正确缩放
        if (this.cameras && this.cameras.main) {
            this.cameras.main.setSize(gameSize.width, gameSize.height);
        }
    }
} 