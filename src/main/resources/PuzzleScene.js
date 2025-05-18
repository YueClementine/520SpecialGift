class PuzzleScene extends Phaser.Scene {
    constructor() {
        super('PuzzleScene');
        this.puzzlePieces = [];
        this.piecePositions = [];
        
        // 设置网格大小 - 增加难度
        this.gridSizeX = 5;
        this.gridSizeY = 4;
        
        // 拼图块尺寸
        this.pieceWidth = 120;
        this.pieceHeight = 100;
        
        this.completed = false;
        this.progressText = null; // 初始化为null
        this.shuffledOnce = false; // 跟踪是否已经打乱过拼图
        
        // 添加状态标志，用于跟踪资源加载情况
        this.assetsLoaded = false;
    }

    preload() {
        // 添加加载错误处理
        this.load.on('loaderror', (fileObj) => {
            console.error('资源加载失败:', fileObj.key);
            // 继续游戏但记录错误
        });
        
        // 加载拼图资源，添加错误处理
        try {
            // 加载拼图资源
            this.load.image('puzzle-bg', 'assets/custom/puzzle-bg.jpg');
            this.load.image('puzzle-image', 'assets/custom/puzzle-image.jpg');
            this.load.image('complete-btn', 'assets/custom/complete-btn.png');
            this.load.image('reset-btn', 'assets/custom/reset-btn.png');
            this.load.image('next-scene-btn', 'assets/custom/next-scene-btn.png');
            
            // 添加资源加载完成事件
            this.load.on('complete', () => {
                console.log('PuzzleScene资源加载完成');
                this.assetsLoaded = true;
            });
        } catch (e) {
            console.error('预加载资源时出错:', e);
            // 即使出错也继续游戏
            this.assetsLoaded = false;
        }
    }

    create() {
        // 确保游戏能继续，即使资源加载失败
        if (!this.textures.exists('puzzle-bg')) {
            console.error('拼图背景资源未能加载，使用备用颜色');
            // 使用备用颜色填充背景
            this.cameras.main.setBackgroundColor('#8899cc');
        } else {
            // 添加背景
            const width = this.cameras.main.width;
            const height = this.cameras.main.height;
            this.add.image(width / 2, height / 2, 'puzzle-bg').setDisplaySize(width, height);
        }
        
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 检查必要的资源是否已加载
        if (!this.textures.exists('puzzle-image')) {
            console.error('拼图图像资源未能加载，无法继续游戏');
            
            // 显示错误信息
            this.add.text(width / 2, height / 2, '资源加载失败，无法开始拼图游戏', {
                fontSize: '24px',
                fill: '#ffffff',
                backgroundColor: '#ff0000',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5);
            
            // 添加返回按钮
            const returnText = this.add.text(width / 2, height / 2 + 60, '返回主菜单', {
                fontSize: '20px',
                fill: '#ffffff',
                backgroundColor: '#ff4081',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5);
            
            returnText.setInteractive({ useHandCursor: true });
            returnText.on('pointerdown', () => {
                this.scene.start('MainMenu');
            });
            
            return; // 不继续执行其他创建逻辑
        }
        
        // 添加标题
        this.add.text(width / 2, 30, 'Daddy最喜欢的一幅画', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // 添加说明
        this.add.text(width / 2, 70, '点击并拖动拼图碎片，完成拼图', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // 设置进度文本
        this.progressText = this.add.text(width - 200, height - 30, '已完成: 0%', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 3
        });
        
        // 创建拼图区域
        const totalWidth = this.pieceWidth * this.gridSizeX;
        const totalHeight = this.pieceHeight * this.gridSizeY;
        
        // 添加拼图框架
        this.add.rectangle(width/2, height/2 - 20, totalWidth + 20, totalHeight + 20, 0x333333, 0.5)
            .setStrokeStyle(4, 0xffffff, 0.8);
        
        try {
            // 创建拼图块
            this.createPuzzlePieces(width, height);
            
            // 添加按钮
            const buttonY = height - 60;
            
            // 重置按钮 - 检查资源是否存在
            if (this.textures.exists('reset-btn')) {
                const resetBtn = this.add.image(width / 2 - 100, buttonY, 'reset-btn').setScale(0.8);
                resetBtn.setInteractive({ useHandCursor: true });
                resetBtn.on('pointerover', () => resetBtn.setTint(0xdddddd));
                resetBtn.on('pointerout', () => resetBtn.clearTint());
                resetBtn.on('pointerdown', () => this.resetPuzzle());
            } else {
                // 使用文本替代
                const resetBtn = this.add.text(width / 2 - 100, buttonY, '重置', {
                    fontSize: '20px', 
                    fill: '#ffffff',
                    backgroundColor: '#4455aa',
                    padding: { x: 20, y: 10 }
                }).setOrigin(0.5);
                resetBtn.setInteractive({ useHandCursor: true });
                resetBtn.on('pointerdown', () => this.resetPuzzle());
            }
            
            // 完成按钮 - 检查资源是否存在
            if (this.textures.exists('complete-btn')) {
                const completeBtn = this.add.image(width / 2 + 100, buttonY, 'complete-btn').setScale(0.8);
                completeBtn.setInteractive({ useHandCursor: true });
                completeBtn.on('pointerover', () => completeBtn.setTint(0xdddddd));
                completeBtn.on('pointerout', () => completeBtn.clearTint());
                completeBtn.on('pointerdown', () => this.completePuzzle());
            } else {
                // 使用文本替代
                const completeBtn = this.add.text(width / 2 + 100, buttonY, '完成', {
                    fontSize: '20px', 
                    fill: '#ffffff',
                    backgroundColor: '#ff4081',
                    padding: { x: 20, y: 10 }
                }).setOrigin(0.5);
                completeBtn.setInteractive({ useHandCursor: true });
                completeBtn.on('pointerdown', () => this.completePuzzle());
            }
            
            // 难度提示
            this.add.text(width / 2, buttonY - 30, '20块拼图挑战', {
                fontSize: '18px',
                fill: '#ff0000',
                fontFamily: 'Arial',
                stroke: '#ffffff',
                strokeThickness: 2
            }).setOrigin(0.5);
        } catch (e) {
            console.error('创建拼图游戏元素时出错:', e);
            // 显示错误信息并允许返回
            this.add.text(width / 2, height / 2, '初始化拼图游戏时出错:\n' + e.message, {
                fontSize: '20px',
                fill: '#ffffff',
                backgroundColor: '#ff0000',
                padding: { x: 20, y: 10 },
                align: 'center'
            }).setOrigin(0.5);
            
            const returnBtn = this.add.text(width / 2, height / 2 + 80, '返回主菜单', {
                fontSize: '20px',
                fill: '#ffffff',
                backgroundColor: '#4455aa',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5);
            
            returnBtn.setInteractive({ useHandCursor: true });
            returnBtn.on('pointerdown', () => {
                this.scene.start('MainMenu');
            });
        }
    }
    
    createPuzzlePieces(width, height) {
        // 计算拼图区域
        const totalWidth = this.pieceWidth * this.gridSizeX;
        const totalHeight = this.pieceHeight * this.gridSizeY;
        const startX = width/2 - totalWidth/2 + this.pieceWidth/2;
        const startY = height/2 - 20 - totalHeight/2 + this.pieceHeight/2;
        
        // 获取原始图像
        const texture = this.textures.get('puzzle-image');
        const sourceWidth = texture.source[0].width;
        const sourceHeight = texture.source[0].height;
        
        // 计算每块拼图在原始图像中的尺寸
        const pieceSourceWidth = sourceWidth / this.gridSizeX;
        const pieceSourceHeight = sourceHeight / this.gridSizeY;
        
        // 创建每个拼图块
        let index = 0;
        for (let row = 0; row < this.gridSizeY; row++) {
            for (let col = 0; col < this.gridSizeX; col++) {
                const x = startX + col * this.pieceWidth;
                const y = startY + row * this.pieceHeight;
                
                // 裁剪原始图像
                try {
                    // 创建唯一的纹理键
                    const textureKey = `piece_${row}_${col}`;
                    
                    // 如果纹理已存在，先移除它
                    if (this.textures.exists(textureKey)) {
                        this.textures.remove(textureKey);
                    }
                    
                    // 创建新的画布纹理
                    const canvas = this.textures.createCanvas(textureKey, pieceSourceWidth, pieceSourceHeight);
                    const ctx = canvas.getContext('2d');
                    
                    // 绘制图像切片到画布
                    const sourceImage = texture.getSourceImage();
                    ctx.drawImage(
                        sourceImage,
                        col * pieceSourceWidth, row * pieceSourceHeight, // 源图像裁剪起点
                        pieceSourceWidth, pieceSourceHeight, // 源图像裁剪尺寸
                        0, 0, // 目标画布起点
                        pieceSourceWidth, pieceSourceHeight // 目标画布尺寸
                    );
                    
                    // 刷新画布
                    canvas.refresh();
                    
                    // 创建拼图块
                    const piece = this.add.image(x, y, textureKey);
                    piece.setDisplaySize(this.pieceWidth - 5, this.pieceHeight - 5);
                    piece.setOrigin(0.5);
                    
                    // 添加边框 - 使用Phaser的Graphics对象
                    const border = this.add.graphics();
                    border.lineStyle(2, 0xffffff, 0.8);
                    border.strokeRect(
                        -this.pieceWidth/2 + 2.5, 
                        -this.pieceHeight/2 + 2.5, 
                        this.pieceWidth - 5, 
                        this.pieceHeight - 5
                    );
                    border.x = x;
                    border.y = y;
                    
                    // 保存边框引用
                    piece.border = border;
                    
                    // 保存拼图块信息
                    piece.originalIndex = index; // 原始索引
                    piece.currentIndex = index; // 当前位置索引
                    piece.correctIndex = index; // 正确位置索引
                    
                    // 保存正确位置坐标
                    this.piecePositions[index] = { x, y };
                    
                    // 启用拖拽
                    piece.setInteractive();
                    this.input.setDraggable(piece);
                    
                    // 保存到拼图块数组
                    this.puzzlePieces.push(piece);
                    
                    index++;
                } catch (e) {
                    console.error(`创建拼图块失败: ${row},${col}`, e);
                }
            }
        }
        
        // 添加拖拽事件
        this.input.on('dragstart', (pointer, gameObject) => {
            if (!gameObject) return; // 安全检查
            
            gameObject.setTint(0xaaaaff);
            this.children.bringToTop(gameObject);
            
            // 将边框也置顶
            if (gameObject.border) {
                this.children.bringToTop(gameObject.border);
            }
        });
        
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (!gameObject) return; // 安全检查
            
            gameObject.x = dragX;
            gameObject.y = dragY;
            
            // 同步更新边框位置
            if (gameObject.border) {
                gameObject.border.x = dragX;
                gameObject.border.y = dragY;
            }
        });
        
        this.input.on('dragend', (pointer, gameObject) => {
            if (!gameObject) return; // 安全检查
            
            gameObject.clearTint();
            this.handlePieceRelease(gameObject);
        });
        
        // 打乱拼图
        this.shufflePieces();
    }
    
    handlePieceRelease(piece) {
        if (!piece) return; // 安全检查
        
        // 标记拼图已经被操作过
        if (!this.shuffledOnce) {
            this.shuffledOnce = true;
        }
        
        // 找到最近的位置点
        let closestPositionIndex = -1;
        let closestDistance = Number.MAX_VALUE;
        
        // 1. 寻找最近的位置点 - 增加拼图需要拖动到更近的位置才能放置
        for (let i = 0; i < this.piecePositions.length; i++) {
            const pos = this.piecePositions[i];
            const distance = Phaser.Math.Distance.Between(
                piece.x, piece.y,
                pos.x, pos.y
            );
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPositionIndex = i;
            }
        }
        
        console.log(`最近的位置是: ${closestPositionIndex}，距离: ${closestDistance}`);
        
        // 2. 检查该位置是否已被占用
        let isOccupied = false;
        let occupyingPiece = null;
        
        for (let otherPiece of this.puzzlePieces) {
            if (otherPiece && otherPiece !== piece && otherPiece.currentIndex === closestPositionIndex) {
                isOccupied = true;
                occupyingPiece = otherPiece;
                break;
            }
        }
        
        // 如果距离太远，拼图块回到原位置 - 降低距离容忍度，要求更精确的拖放
        if (closestDistance >= this.pieceWidth / 3) {  // 从pieceWidth/2改为pieceWidth/3
            console.log(`距离太远 (${closestDistance})，拼图块回到原位置`);
            const currentPos = this.piecePositions[piece.currentIndex];
            if (currentPos) {
                piece.x = currentPos.x;
                piece.y = currentPos.y;
                
                if (piece.border) {
                    piece.border.x = piece.x;
                    piece.border.y = piece.y;
                }
            }
            
            // 更新进度和检查完成
            this.updateProgress();
            this.checkCompletion();
            return;
        }
        
        // 3. 处理拼图放置逻辑
        // 如果当前拼图已经在目标位置，不做任何移动
        if (piece.currentIndex === closestPositionIndex) {
            console.log(`拼图块已在目标位置 ${closestPositionIndex}，无需移动`);
            return;
        }
        
        // 获取当前拼图的原始位置
        const oldPosition = this.piecePositions[piece.currentIndex];
        const newPosition = this.piecePositions[closestPositionIndex];
        
        // 增加额外的随机性，有25%的概率拒绝交换（增加难度）
        const randomChance = Math.random();
        if (randomChance < 0.25 && closestPositionIndex !== piece.originalIndex) {
            console.log(`拼图块 ${piece.originalIndex} 交换失败，随机拒绝`);
            // 回到原位置
            piece.x = oldPosition.x;
            piece.y = oldPosition.y;
            if (piece.border) {
                piece.border.x = piece.x;
                piece.border.y = piece.y;
            }
            return;
        }
        
        if (isOccupied && occupyingPiece) {
            // 如果位置被占用，交换两个拼图块
            console.log(`交换拼图块: ${piece.originalIndex}(位置${piece.currentIndex}) 和 ${occupyingPiece.originalIndex}(位置${occupyingPiece.currentIndex})`);
            
            // 保存占用拼图块的索引
            const occupyingPieceIndex = occupyingPiece.currentIndex;
            
            // 确保occupyingPiece的位置是closestPositionIndex
            if (occupyingPieceIndex !== closestPositionIndex) {
                console.error(`占用拼图的索引不匹配! 预期 ${closestPositionIndex}，实际 ${occupyingPieceIndex}`);
            }
            
            // 更新两个拼图块的位置
            occupyingPiece.x = oldPosition.x;
            occupyingPiece.y = oldPosition.y;
            occupyingPiece.currentIndex = piece.currentIndex;
            
            piece.x = newPosition.x;
            piece.y = newPosition.y;
            piece.currentIndex = closestPositionIndex;
            
            // 更新边框位置
            if (piece.border) {
                piece.border.x = piece.x;
                piece.border.y = piece.y;
            }
            
            if (occupyingPiece.border) {
                occupyingPiece.border.x = occupyingPiece.x;
                occupyingPiece.border.y = occupyingPiece.y;
            }
            
            // 验证两个拼图块没有相同的currentIndex
            if (piece.currentIndex === occupyingPiece.currentIndex) {
                console.error('错误：两个拼图块有相同的currentIndex!');
                // 紧急修复 - 强制分配不同的索引
                for (let i = 0; i < this.piecePositions.length; i++) {
                    let isUsed = false;
                    for (let p of this.puzzlePieces) {
                        if (p && p.currentIndex === i) {
                            isUsed = true;
                            break;
                        }
                    }
                    if (!isUsed) {
                        occupyingPiece.currentIndex = i;
                        occupyingPiece.x = this.piecePositions[i].x;
                        occupyingPiece.y = this.piecePositions[i].y;
                        if (occupyingPiece.border) {
                            occupyingPiece.border.x = occupyingPiece.x;
                            occupyingPiece.border.y = occupyingPiece.y;
                        }
                        console.log(`紧急修复：将拼图块 ${occupyingPiece.originalIndex} 移动到位置 ${i}`);
                        break;
                    }
                }
            }
        } else {
            // 如果位置未被占用，直接将拼图块放入该位置
            console.log(`放置拼图块 ${piece.originalIndex} 到位置 ${closestPositionIndex}`);
            
            // 更新拼图块位置
            piece.x = newPosition.x;
            piece.y = newPosition.y;
            piece.currentIndex = closestPositionIndex;
            
            // 更新边框位置
            if (piece.border) {
                piece.border.x = piece.x;
                piece.border.y = piece.y;
            }
            
            // 如果放置在正确位置，添加微小动画效果 - 仅当是正确位置才奖励视觉效果
            if (closestPositionIndex === piece.originalIndex) {
                this.tweens.add({
                    targets: piece,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 150,
                    yoyo: true
                });
            }
        }
        
        // 验证所有拼图块的位置
        this.validatePiecePositions();
        
        // 更新进度
        this.updateProgress();
        
        // 检查是否完成
        this.checkCompletion();
    }
    
    // 添加新方法：验证拼图块位置
    validatePiecePositions() {
        // 检查是否有多个拼图块占用同一个位置
        const positionOccupancy = {};
        
        for (let piece of this.puzzlePieces) {
            if (!piece) continue;
            
            const index = piece.currentIndex;
            if (index === undefined) {
                console.error(`拼图块 ${piece.originalIndex} 没有currentIndex`);
                continue;
            }
            
            if (positionOccupancy[index]) {
                console.error(`位置 ${index} 被多个拼图块占用:`);
                console.error(`- 已占用: ${positionOccupancy[index].originalIndex}`);
                console.error(`- 重复占用: ${piece.originalIndex}`);
                
                // 修复 - 为这个拼图块找一个空位置
                for (let i = 0; i < this.piecePositions.length; i++) {
                    if (!positionOccupancy[i]) {
                        piece.currentIndex = i;
                        piece.x = this.piecePositions[i].x;
                        piece.y = this.piecePositions[i].y;
                        if (piece.border) {
                            piece.border.x = piece.x;
                            piece.border.y = piece.y;
                        }
                        positionOccupancy[i] = piece;
                        console.log(`修复：将拼图块 ${piece.originalIndex} 移动到空位置 ${i}`);
                        break;
                    }
                }
            } else {
                positionOccupancy[index] = piece;
            }
        }
        
        // 确保拼图块位置与其currentIndex一致 - 但不要自动将所有块移动到完美位置
        let fixedCount = 0;
        const maxAutoFix = 3; // 每次最多自动修复3个拼图块，防止游戏太容易
        
        for (let piece of this.puzzlePieces) {
            if (!piece) continue;
            
            const index = piece.currentIndex;
            const pos = this.piecePositions[index];
            
            // 位置不一致，且修复次数未超过限制
            if (pos && (piece.x !== pos.x || piece.y !== pos.y) && fixedCount < maxAutoFix) {
                console.warn(`拼图块 ${piece.originalIndex} 位置与索引不一致，正在修复`);
                
                // 对于错位不太远的拼图，允许修复
                const distance = Phaser.Math.Distance.Between(piece.x, piece.y, pos.x, pos.y);
                if (distance < this.pieceWidth / 4) {
                    piece.x = pos.x;
                    piece.y = pos.y;
                    if (piece.border) {
                        piece.border.x = piece.x;
                        piece.border.y = piece.y;
                    }
                    fixedCount++;
                }
            }
        }
    }
    
    shufflePieces() {
        // 随机打乱拼图块位置
        const positions = [...this.piecePositions];
        
        // Fisher-Yates洗牌算法 - 确保充分打乱
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        
        // 再进行一次随机交换，增加混乱程度
        for (let i = 0; i < positions.length; i++) {
            const j = Math.floor(Math.random() * positions.length);
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        
        // 确保至少95%的拼图块不在正确位置（之前是80%）
        let correctlyPlaced = 0;
        const minDisplaced = Math.floor(this.puzzlePieces.length * 0.95);
        
        // 设置拼图块到打乱后的位置
        for (let i = 0; i < this.puzzlePieces.length; i++) {
            const piece = this.puzzlePieces[i];
            if (!piece) continue; // 安全检查
            
            // 增加随机偏移范围 - 进一步增加难度
            const offsetX = (Math.random() - 0.5) * 50; // 之前是30
            const offsetY = (Math.random() - 0.5) * 50; // 之前是30
            
            if (i === piece.originalIndex) {
                correctlyPlaced++;
            }
            
            // 更新拼图块位置
            piece.x = positions[i].x + offsetX;
            piece.y = positions[i].y + offsetY;
            
            // 更新边框位置
            if (piece.border) {
                piece.border.x = piece.x;
                piece.border.y = piece.y;
            }
            
            piece.currentIndex = i;
        }
        
        // 如果太多块在正确位置，再次打乱
        if (correctlyPlaced > this.puzzlePieces.length - minDisplaced && !this.shuffledOnce) {
            console.log('太多拼图块在正确位置，再次打乱');
            this.shuffledOnce = true;
            this.shufflePieces();
            return;
        }
        
        this.shuffledOnce = true;
        
        // 强制至少进行3次位置交换，确保真正打乱
        if (this.puzzlePieces.length > 5) {
            for (let i = 0; i < 3; i++) {
                const idx1 = Math.floor(Math.random() * this.puzzlePieces.length);
                const idx2 = Math.floor(Math.random() * this.puzzlePieces.length);
                if (idx1 !== idx2 && this.puzzlePieces[idx1] && this.puzzlePieces[idx2]) {
                    // 交换两个拼图块的位置
                    const tempX = this.puzzlePieces[idx1].x;
                    const tempY = this.puzzlePieces[idx1].y;
                    const tempIndex = this.puzzlePieces[idx1].currentIndex;
                    
                    this.puzzlePieces[idx1].x = this.puzzlePieces[idx2].x;
                    this.puzzlePieces[idx1].y = this.puzzlePieces[idx2].y;
                    this.puzzlePieces[idx1].currentIndex = this.puzzlePieces[idx2].currentIndex;
                    
                    this.puzzlePieces[idx2].x = tempX;
                    this.puzzlePieces[idx2].y = tempY;
                    this.puzzlePieces[idx2].currentIndex = tempIndex;
                    
                    // 更新边框位置
                    if (this.puzzlePieces[idx1].border) {
                        this.puzzlePieces[idx1].border.x = this.puzzlePieces[idx1].x;
                        this.puzzlePieces[idx1].border.y = this.puzzlePieces[idx1].y;
                    }
                    
                    if (this.puzzlePieces[idx2].border) {
                        this.puzzlePieces[idx2].border.x = this.puzzlePieces[idx2].x;
                        this.puzzlePieces[idx2].border.y = this.puzzlePieces[idx2].y;
                    }
                }
            }
        }
        
        // 更新进度
        this.updateProgress();
        
        console.log(`拼图已打乱，有 ${correctlyPlaced} 块在正确位置`);
    }
    
    updateProgress() {
        // 检查progessText是否存在
        if (!this.progressText) {
            console.warn('progressText不存在，无法更新进度');
            return;
        }
        
        // 计算正确放置的拼图块数量
        let correctCount = 0;
        
        for (let piece of this.puzzlePieces) {
            if (piece && piece.currentIndex === piece.originalIndex) {
                correctCount++;
            }
        }
        
        // 更新进度文本
        const progressPercent = Math.floor((correctCount / this.puzzlePieces.length) * 100);
        this.progressText.setText(`已完成: ${progressPercent}%`);
    }
    
    checkCompletion() {
        // 防止开始就完成
        if (!this.shuffledOnce) {
            return false;
        }
        
        // 检查所有拼图块是否都在正确位置
        let correctCount = 0;
        const tolerance = 5; // 减小允许的位置误差（从10降到5像素）
        
        for (let piece of this.puzzlePieces) {
            if (!piece) continue;
            
            // 获取正确位置
            const correctPos = this.piecePositions[piece.originalIndex];
            if (!correctPos) continue;
            
            // 使用距离检查拼图块是否在正确位置
            const distance = Phaser.Math.Distance.Between(
                piece.x, piece.y,
                correctPos.x, correctPos.y
            );
            
            if (distance < tolerance) {
                correctCount++;
            } else {
                return false; // 如果任何一块不在正确位置，立即返回false
            }
        }
        
        // 提高完成门槛：需要至少95%的拼图块都被放置正确
        if (correctCount < this.puzzlePieces.length * 0.95) {
            return false;
        }
        
        console.log(`检查完成：${correctCount}/${this.puzzlePieces.length}块在正确位置`);
        
        // 如果所有拼图块都在正确位置，显示完成效果
        this.showCompletionEffect();
        return true;
    }
    
    showCompletionEffect() {
        if (this.completed) return;
        
        this.completed = true;
        
        // 显示完成消息
        this.add.text(
            this.cameras.main.width / 2,
            140,
            '恭喜你完成了拼图！',
            {
                fontSize: '32px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                stroke: '#ff0000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);
        
        // 2秒后显示完整图片
        this.time.delayedCall(2000, () => {
            // 隐藏所有拼图块和边框
            for (let piece of this.puzzlePieces) {
                if (!piece) continue; // 安全检查
                
                piece.setVisible(false);
                if (piece.border) {
                    piece.border.setVisible(false);
                }
            }
            
            // 显示完整图片
            const totalWidth = this.pieceWidth * this.gridSizeX;
            const totalHeight = this.pieceHeight * this.gridSizeY;
            
            this.add.image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 - 20,
                'puzzle-image'
            ).setDisplaySize(totalWidth, totalHeight);
            
            // 添加文字
            this.add.text(
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
    
    resetPuzzle() {
        if (!this.completed) {
            this.shufflePieces();
        }
    }
    
    completePuzzle() {
        if (!this.completed && this.shuffledOnce) {
            // 只有玩家真正尝试过拼图后才能使用此按钮
            if (this.puzzlePieces.length === 0) {
                console.warn('没有拼图块可完成');
                return;
            }
            
            // 直接将所有拼图块移到正确位置
            for (let piece of this.puzzlePieces) {
                if (!piece) continue; // 安全检查
                
                const correctPos = this.piecePositions[piece.originalIndex];
                if (correctPos) {
                    piece.x = correctPos.x;
                    piece.y = correctPos.y;
                    
                    // 更新边框位置
                    if (piece.border) {
                        piece.border.x = correctPos.x;
                        piece.border.y = correctPos.y;
                    }
                    
                    piece.currentIndex = piece.originalIndex;
                }
            }
            
            // 更新进度
            this.updateProgress();
            
            // 显示完成效果
            this.showCompletionEffect();
        } else if (!this.shuffledOnce) {
            // 如果玩家还没开始就点击完成按钮，再次打乱拼图
            this.shufflePieces();
            alert('请先尝试拼图，至少拖动几块拼图！');
        }
    }
} 