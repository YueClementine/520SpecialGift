class FinalScene extends Phaser.Scene {
    constructor() {
        super('FinalScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景
        this.add.image(width / 2, height / 2, 'final-bg').setDisplaySize(width, height);
        
        // 创建爱心粒子效果
        const heartParticles = this.add.particles('heart');
        
        // 创建多个发射器形成心形
        this.createHeartShape(heartParticles, width / 2, height / 2);
        
        // 添加520闪烁文字
        const text520 = this.add.text(width / 2, height / 4, '520', {
            fontSize: '120px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fill: '#ff4081',
            stroke: '#ffffff',
            strokeThickness: 6
        });
        text520.setOrigin(0.5);
        
        // 添加爱的宣言（这里可以写你自己的告白文字）
        const loveMessage = this.add.text(width / 2, height / 2, '亲爱的，生日快乐！\n感谢你一直以来的陪伴\n我爱你！', {
            fontSize: '36px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 3
        });
        loveMessage.setOrigin(0.5);
        
        // 添加你们的名字
        const names = this.add.text(width / 2, height - 150, `${this.game.global.playerName} & 你的名字`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fill: '#ffffff',
            stroke: '#ff4081',
            strokeThickness: 3
        });
        names.setOrigin(0.5);
        
        // 添加动画效果
        this.tweens.add({
            targets: text520,
            scale: { from: 0.5, to: 1 },
            alpha: { from: 0, to: 1 },
            duration: 2000,
            ease: 'Bounce.easeOut'
        });
        
        this.tweens.add({
            targets: loveMessage,
            alpha: { from: 0, to: 1 },
            y: { from: height / 2 - 50, to: height / 2 },
            duration: 2000,
            delay: 1000,
            ease: 'Power2'
        });
        
        this.tweens.add({
            targets: names,
            alpha: { from: 0, to: 1 },
            duration: 2000,
            delay: 3000
        });
        
        // 添加爱心闪烁动画
        this.tweens.add({
            targets: text520,
            alpha: { from: 1, to: 0.7 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // 保存游戏进度
        this.game.global.saveProgress(4, { completed: true });
        
        // 添加一个重新开始按钮
        const restartButton = this.add.text(width / 2, height - 80, '重新开始', {
            fontSize: '24px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            backgroundColor: '#ff4081',
            padding: { x: 20, y: 10 }
        });
        restartButton.setOrigin(0.5);
        restartButton.setInteractive({ useHandCursor: true });
        
        restartButton.on('pointerdown', () => {
            this.sound.play('click');
            this.scene.start('MainMenu');
        });
    }
    
    // 创建心形粒子
    createHeartShape(particles, centerX, centerY) {
        // 心形函数参数
        const scale = 10;
        const heartPoints = [];
        
        // 生成心形轮廓的点
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            const heartX = 16 * Math.pow(Math.sin(angle), 3);
            const heartY = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);
            
            heartPoints.push({
                x: centerX + heartX * scale,
                y: centerY - heartY * scale
            });
        }
        
        // 为每个点创建发射器
        heartPoints.forEach(point => {
            particles.createEmitter({
                x: point.x,
                y: point.y,
                speed: { min: 10, max: 30 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.1, end: 0 },
                lifespan: { min: 1000, max: 2000 },
                quantity: 1,
                frequency: 500
            });
        });
        
        // 创建中心大爆发
        particles.createEmitter({
            x: centerX,
            y: centerY,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.3, end: 0 },
            lifespan: 3000,
            quantity: 5,
            frequency: 1000
        });
    }
} 