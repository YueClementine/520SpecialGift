class PuzzleScene extends Phaser.Scene {
    constructor() {
        super('PuzzleScene');
        this.puzzlePieces = [];
        this.piecePositions = [];
        this.gridSize = 3; // 3x3拼图
        this.pieceWidth = 200;
        this.pieceHeight = 200;
        this.completed = false;
        this.selectedPiece = null;
        this.swappingPiece = null;
    }

    preload() {
        // 加载拼图资源
        this.load.image('puzzle-bg', 'assets/custom/puzzle-bg.jpg');
        this.load.image('puzzle-image', 'assets/custom/puzzle-image.jpg'); // 这应该是你们的照片
        this.load.image('puzzle-frame', 'assets/custom/puzzle-frame.png');
        this.load.image('complete-btn', 'assets/custom/complete-btn.png');
        this.load.image('reset-btn', 'assets/custom/reset-btn.png');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 添加背景
        this.add.image(width / 2, height / 2, 'puzzle-bg').setDisplaySize(width, height);
        
        // 添加标题
        this.add.text(width / 2, 50, '我们的回忆拼图', {
            fontSize: '36px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // 添加说明
        this.add.text(width / 2, 100, '点击并拖动拼图碎片，重现我们美好的瞬间', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // 创建拼图区域
        this.puzzleContainer = this.add.container(width / 2, height / 2);
        
        // 添加拼图框架
        const frame = this.add.image(0, 0, 'puzzle-frame').setScale(1.1);
        this.puzzleContainer.add(frame);
        
        // 计算拼图区域
        const puzzleWidth = this.pieceWidth * this.gridSize;
        const puzzleHeight = this.pieceHeight * this.gridSize;
        const startX = -puzzleWidth / 2 + this.pieceWidth / 2;
        const startY = -puzzleHeight / 2 + this.pieceHeight / 2;
        
        // 创建拼图块
        this.createPuzzlePieces(startX, startY);
        
        // 打乱拼图
        this.shufflePuzzle();
        
        // 添加按钮
        const buttonY = height / 2 + puzzleHeight / 2 + 80;
        
        // 重置按钮
        const resetBtn = this.add.image(width / 2 - 100, buttonY, 'reset-btn').setScale(0.8);
        resetBtn.setInteractive({ useHandCursor: true });
        resetBtn.on('pointerover', () => resetBtn.setTint(0xdddddd));
        resetBtn.on('pointerout', () => resetBtn.clearTint());
        resetBtn.on('pointerdown', () => this.resetPuzzle());
        
        // 完成按钮
        const completeBtn = this.add.image(width / 2 + 100, buttonY, 'complete-btn').setScale(0.8);
        completeBtn.setInteractive({ useHandCursor: true });
        completeBtn.on('pointerover', () => completeBtn.setTint(0xdddddd));
        completeBtn.on('pointerout', () => completeBtn.clearTint());
        completeBtn.on('pointerdown', () => this.completePuzzle());
        
        // 设置拖放交互
        this.input.on('gameobjectdown', this.startDrag, this);
        this.input.on('gameobjectup', this.stopDrag, this);
        
        // 设置进度文本
        this.progressText = this.add.text(width - 200, height - 50, '已完成: 0%', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 3
        });
    }
    
    createPuzzlePieces(startX, startY) {
        // 创建拼图碎片
        const texture = this.textures.get('puzzle-image');
        const sourceWidth = texture.source[0].width;
        const sourceHeight = texture.source[0].height;
        
        const pieceSourceWidth = sourceWidth / this.gridSize;
        const pieceSourceHeight = sourceHeight / this.gridSize;
        
        // 存储每个拼图块的正确位置
        this.piecePositions = [];
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const x = startX + col * this.pieceWidth;
                const y = startY + row * this.pieceHeight;
                
                // 计算纹理裁剪区域
                const frame = new Phaser.Geom.Rectangle(
                    col * pieceSourceWidth,
                    row * pieceSourceHeight,
                    pieceSourceWidth,
                    pieceSourceHeight
                );
                
                // 创建纹理
                this.textures.addFrame(`puzzle-image`, `piece_${row}_${col}`, 0, frame.x, frame.y, frame.width, frame.height);
                
                // 创建拼图块
                const piece = this.add.image(x, y, 'puzzle-image', `piece_${row}_${col}`);
                piece.setDisplaySize(this.pieceWidth, this.pieceHeight);
                piece.setInteractive({ draggable: true });
                
                // 存储原始正确位置信息
                piece.originalPosition = { x, y };
                piece.currentIndex = row * this.gridSize + col;
                piece.targetIndex = row * this.gridSize + col;
                
                this.puzzleContainer.add(piece);
                this.puzzlePieces.push(piece);
                this.piecePositions.push({ x, y });
            }
        }
    }
    
    shufflePuzzle() {
        // 随机打乱拼图
        const positions = [...this.piecePositions];
        
        // Fisher-Yates洗牌算法
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        
        // 设置打乱后的位置
        for (let i = 0; i < this.puzzlePieces.length; i++) {
            const piece = this.puzzlePieces[i];
            piece.x = positions[i].x;
            piece.y = positions[i].y;
            piece.currentIndex = i;
        }
        
        // 重置进度
        this.updateProgress();
    }
    
    startDrag(pointer, gameObject) {
        // 确保是拼图片
        if (this.puzzlePieces.includes(gameObject) && !this.completed) {
            this.selectedPiece = gameObject;
            this.selectedPiece.setTint(0xaaaaff);
            this.selectedPiece.setDepth(1); // 提高层级，避免被其他拼图块遮挡
            
            // 将当前选中的拼图块移到容器的顶层
            this.puzzleContainer.bringToTop(this.selectedPiece);
        }
    }
    
    stopDrag(pointer, gameObject) {
        if (this.selectedPiece) {
            this.selectedPiece.clearTint();
            this.selectedPiece.setDepth(0);
            
            // 找到最近的拼图位置
            let closestPiece = null;
            let closestDistance = Number.MAX_VALUE;
            
            for (let piece of this.puzzlePieces) {
                if (piece !== this.selectedPiece) {
                    const distance = Phaser.Math.Distance.Between(
                        this.selectedPiece.x, this.selectedPiece.y,
                        piece.x, piece.y
                    );
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestPiece = piece;
                    }
                }
            }
            
            // 如果找到了最近的拼图块并且距离足够近，交换位置
            if (closestPiece && closestDistance < 100) {
                this.swapPieces(this.selectedPiece, closestPiece);
            } else {
                // 否则，将拼图块移回原位
                this.tweens.add({
                    targets: this.selectedPiece,
                    x: this.piecePositions[this.selectedPiece.currentIndex].x,
                    y: this.piecePositions[this.selectedPiece.currentIndex].y,
                    duration: 200,
                    ease: 'Power2'
                });
            }
            
            this.selectedPiece = null;
            
            // 检查是否完成拼图
            this.checkCompletion();
        }
    }
    
    swapPieces(piece1, piece2) {
        // 交换两个拼图块的位置
        const tempX = piece1.x;
        const tempY = piece1.y;
        const tempIndex = piece1.currentIndex;
        
        // 动画效果移动拼图块
        this.tweens.add({
            targets: piece1,
            x: piece2.x,
            y: piece2.y,
            duration: 200,
            ease: 'Power2'
        });
        
        this.tweens.add({
            targets: piece2,
            x: tempX,
            y: tempY,
            duration: 200,
            ease: 'Power2'
        });
        
        // 更新索引
        piece1.currentIndex = piece2.currentIndex;
        piece2.currentIndex = tempIndex;
        
        // 更新进度
        this.updateProgress();
    }
    
    updateProgress() {
        // 计算有多少拼图块在正确位置
        let correctCount = 0;
        
        for (let piece of this.puzzlePieces) {
            if (piece.currentIndex === piece.targetIndex) {
                correctCount++;
            }
        }
        
        // 更新进度文本
        const progressPercent = Math.floor((correctCount / this.puzzlePieces.length) * 100);
        this.progressText.setText(`已完成: ${progressPercent}%`);
    }
    
    checkCompletion() {
        // 检查所有拼图块是否都在正确位置
        for (let piece of this.puzzlePieces) {
            if (piece.currentIndex !== piece.targetIndex) {
                return false;
            }
        }
        
        // 如果所有拼图块都在正确位置，显示完成效果
        this.showCompletionEffect();
        return true;
    }
    
    showCompletionEffect() {
        if (!this.completed) {
            this.completed = true;
            
            // 显示完成消息
            const completionText = this.add.text(
                this.cameras.main.width / 2,
                150,
                '恭喜你完成了拼图！',
                {
                    fontSize: '36px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    stroke: '#ff0000',
                    strokeThickness: 6
                }
            ).setOrigin(0.5);
            
            // 添加爱心粒子效果
            const particles = this.add.particles('heart');
            particles.createEmitter({
                x: this.cameras.main.width / 2,
                y: this.cameras.main.height / 2,
                speed: { min: 100, max: 200 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.3, end: 0 },
                lifespan: 3000,
                quantity: 5,
                frequency: 100,
                duration: 2000
            });
            
            // 显示完整图片
            this.time.delayedCall(2000, () => {
                // 隐藏拼图块
                for (let piece of this.puzzlePieces) {
                    piece.setVisible(false);
                }
                
                // 显示完整图片
                const completeImage = this.add.image(0, 0, 'puzzle-image').setDisplaySize(this.pieceWidth * this.gridSize, this.pieceHeight * this.gridSize);
                this.puzzleContainer.add(completeImage);
                
                // 添加爱心文本
                const loveText = this.add.text(
                    this.cameras.main.width / 2,
                    this.cameras.main.height - 150,
                    '这是我们最美好的回忆，永远珍藏在心中',
                    {
                        fontSize: '28px',
                        fill: '#ffffff',
                        fontFamily: 'Arial',
                        stroke: '#ff0000',
                        strokeThickness: 4,
                        align: 'center',
                        wordWrap: { width: 500 }
                    }
                ).setOrigin(0.5);
                
                // 返回主菜单按钮
                const returnButton = this.add.image(
                    this.cameras.main.width / 2,
                    this.cameras.main.height - 80,
                    'next-scene-btn'
                ).setScale(0.8);
                
                returnButton.setInteractive({ useHandCursor: true });
                returnButton.on('pointerdown', () => {
                    this.scene.start('MainMenu');
                });
            });
        }
    }
    
    resetPuzzle() {
        if (!this.completed) {
            this.shufflePuzzle();
        }
    }
    
    completePuzzle() {
        if (!this.completed) {
            // 直接将所有拼图块移到正确位置
            for (let i = 0; i < this.puzzlePieces.length; i++) {
                const piece = this.puzzlePieces[i];
                const targetX = this.piecePositions[piece.targetIndex].x;
                const targetY = this.piecePositions[piece.targetIndex].y;
                
                this.tweens.add({
                    targets: piece,
                    x: targetX,
                    y: targetY,
                    duration: 500,
                    ease: 'Power2'
                });
                
                piece.currentIndex = piece.targetIndex;
            }
            
            // 更新进度并显示完成效果
            this.time.delayedCall(600, () => {
                this.updateProgress();
                this.showCompletionEffect();
            });
        }
    }
} 