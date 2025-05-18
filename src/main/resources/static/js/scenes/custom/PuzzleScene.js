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
        
        // 添加版本号，用于验证是否正确加载了修改后的场景
        this.version = "2.4"; // 更新版本号到2.4
        console.log("PuzzleScene构造函数执行，版本：", this.version, "- 修复场景重新进入问题");
    }

    // 添加场景关闭时的清理方法
    shutdown() {
        console.log("PuzzleScene关闭，执行资源清理");
        this.cleanupResources();
        super.shutdown();
    }
    
    // 添加场景摧毁时的清理方法
    destroy() {
        console.log("PuzzleScene销毁，执行资源清理");
        this.cleanupResources();
        super.destroy();
    }
    
    // 集中资源清理逻辑
    cleanupResources() {
        // 清理拼图块和相关资源
        if (this.puzzlePieces && this.puzzlePieces.length > 0) {
            for (let piece of this.puzzlePieces) {
                if (!piece) continue;
                
                // 移除拖拽交互
                if (piece.input) {
                    piece.removeInteractive();
                }
                
                // 移除边框
                if (piece.border) {
                    piece.border.destroy();
                    piece.border = null;
                }
                
                // 移除纹理
                const textureKey = `piece_${Math.floor(piece.originalIndex / this.gridSizeX)}_${piece.originalIndex % this.gridSizeX}`;
                if (this.textures.exists(textureKey)) {
                    this.textures.remove(textureKey);
                }
            }
        }
        
        // 清空数组
        this.puzzlePieces = [];
        this.piecePositions = [];
        
        // 移除输入事件
        if (this.input) {
            this.input.off('dragstart');
            this.input.off('drag');
            this.input.off('dragend');
        }
        
        // 重置状态
        this.completed = false;
        this.progressText = null;
        this.shuffledOnce = false;
        this.assetsLoaded = false;
    }

    preload() {
        // 清理可能存在的旧资源
        try {
            // 如果纹理已存在，先移除它们
            for (let row = 0; row < this.gridSizeY; row++) {
                for (let col = 0; col < this.gridSizeX; col++) {
                    const textureKey = `piece_${row}_${col}`;
                    if (this.textures.exists(textureKey)) {
                        this.textures.remove(textureKey);
                    }
                }
            }
        } catch (e) {
            console.warn('预加载清理旧资源时出错:', e);
            // 继续执行，不中断加载流程
        }
        
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
        console.log("开始创建拼图场景...");
        
        // 确保拼图数组和位置数组已初始化
        this.puzzlePieces = [];
        this.piecePositions = [];
        
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
        
        // 显示版本号，用于验证是否正确加载了修改后的场景
        console.log("PuzzleScene创建中，版本：", this.version);
        // 在游戏中显示一个临时版本标签
        const versionText = this.add.text(10, 10, `版本: v${this.version}`, {
            fontSize: '14px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 3 }
        });
        versionText.setDepth(1000); // 确保在顶层显示
        
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
            
            // 重置按钮居中放置
            const resetBtn = this.add.image(width / 2, buttonY, 'reset-btn').setScale(0.8);
            resetBtn.setInteractive({ useHandCursor: true });
            resetBtn.on('pointerover', () => resetBtn.setTint(0xdddddd));
            resetBtn.on('pointerout', () => resetBtn.clearTint());
            resetBtn.on('pointerdown', () => this.resetPuzzle());
            
            // 添加返回主菜单按钮
            const backBtn = this.add.text(width / 2 - 150, buttonY, '返回主菜单', {
                fontSize: '20px',
                fill: '#ffffff',
                backgroundColor: '#4455aa',
                padding: { x: 15, y: 8 },
                borderRadius: 8
            }).setOrigin(0.5);
            
            backBtn.setInteractive({ useHandCursor: true });
            backBtn.on('pointerover', () => backBtn.setStyle({ backgroundColor: '#5566bb' }));
            backBtn.on('pointerout', () => backBtn.setStyle({ backgroundColor: '#4455aa' }));
            backBtn.on('pointerdown', () => {
                this.scene.start('MainMenu');
            });
        } catch (e) {
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
        console.log("开始创建拼图块...");
        
        // 确保没有残留的拼图块
        this.puzzlePieces = [];
        this.piecePositions = [];
        
        // 计算拼图区域
        const totalWidth = this.pieceWidth * this.gridSizeX;
        const totalHeight = this.pieceHeight * this.gridSizeY;
        const startX = width/2 - totalWidth/2 + this.pieceWidth/2;
        const startY = height/2 - 20 - totalHeight/2 + this.pieceHeight/2;
        
        // 安全检查：确保texture存在
        if (!this.textures.exists('puzzle-image')) {
            console.error('无法创建拼图块：puzzle-image纹理不存在');
            throw new Error('拼图图像资源未加载');
        }
        
        // 获取原始图像
        const texture = this.textures.get('puzzle-image');
        if (!texture || !texture.source || !texture.source[0]) {
            console.error('无法获取puzzle-image纹理源');
            throw new Error('拼图图像格式无效');
        }
        
        const sourceWidth = texture.source[0].width;
        const sourceHeight = texture.source[0].height;
        
        if (!sourceWidth || !sourceHeight) {
            console.error('拼图图像尺寸无效：', sourceWidth, sourceHeight);
            throw new Error('拼图图像尺寸无效');
        }
        
        console.log(`拼图原图尺寸: ${sourceWidth}x${sourceHeight}`);
        
        // 计算每块拼图在原始图像中的尺寸
        const pieceSourceWidth = sourceWidth / this.gridSizeX;
        const pieceSourceHeight = sourceHeight / this.gridSizeY;
        
        // 创建每个拼图块
        let index = 0;
        for (let row = 0; row < this.gridSizeY; row++) {
            for (let col = 0; col < this.gridSizeX; col++) {
                const x = startX + col * this.pieceWidth;
                const y = startY + row * this.pieceHeight;
                
                // 保存正确位置坐标到位置数组
                this.piecePositions[index] = { x, y };
                
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
                    
                    // 获取源图像，添加安全检查
                    const sourceImage = texture.getSourceImage();
                    if (!sourceImage) {
                        console.error(`无法获取源图像, row=${row}, col=${col}`);
                        continue; // 跳过这一块拼图，继续创建其他拼图
                    }
                    
                    // 绘制图像切片到画布
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
                    if (!piece) {
                        console.error(`创建拼图块图像失败, row=${row}, col=${col}`);
                        continue;
                    }
                    
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
                    
                    // 启用拖拽
                    piece.setInteractive();
                    this.input.setDraggable(piece);
                    
                    // 保存到拼图块数组
                    this.puzzlePieces.push(piece);
                    
                    index++;
                } catch (e) {
                    console.error(`创建拼图块失败: ${row},${col}`, e);
                    // 继续创建其他拼图块，不中断整个过程
                }
            }
        }
        
        // 安全检查：确保至少创建了一些拼图块
        if (this.puzzlePieces.length === 0) {
            console.error('没有成功创建任何拼图块');
            throw new Error('拼图创建失败');
        }
        
        console.log(`成功创建了 ${this.puzzlePieces.length} 块拼图`);
        
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
            
            // 拖拽结束后更新边框颜色 - 提供视觉反馈
            this.updateBorderColor(gameObject);
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
        
        try {
            // 1. 找出距离拖放位置最近的网格位置
            let closestPositionIndex = -1;
            let closestDistance = Number.MAX_VALUE;
            
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
            
            console.log(`拼图块 ${piece.originalIndex} 最近的位置是: ${closestPositionIndex}，距离: ${closestDistance.toFixed(2)}`);
            
            // 如果距离太远，拼图块回到原位置
            if (closestDistance >= this.pieceWidth / 3) {
                console.log(`距离太远，拼图块 ${piece.originalIndex} 回到原位置 ${piece.currentIndex}`);
                this.snapPieceToPosition(piece, piece.currentIndex);
                this.updateProgress();
                this.checkCompletion();
                return;
            }
            
            // 如果拼图块已经在目标位置，不做任何移动
            if (piece.currentIndex === closestPositionIndex) {
                console.log(`拼图块 ${piece.originalIndex} 已在目标位置 ${closestPositionIndex}，无需移动`);
                this.snapPieceToPosition(piece, piece.currentIndex);
                return;
            }
            
            // 2. 查找目标位置是否已被占用
            let occupyingPiece = null;
            for (let otherPiece of this.puzzlePieces) {
                if (otherPiece && otherPiece !== piece && otherPiece.currentIndex === closestPositionIndex) {
                    occupyingPiece = otherPiece;
                    break;
                }
            }
            
            // 3. 处理拼图交换逻辑 - 严格执行两块拼图互换，不影响其他拼图
            if (occupyingPiece) {
                // 交换两个拼图块的位置 - 简化版本，直接操作两个拼图块
                console.log(`交换拼图块: ${piece.originalIndex}(位置${piece.currentIndex}) 和 ${occupyingPiece.originalIndex}(位置${closestPositionIndex})`);
                
                // 保存两个拼图块当前的位置索引
                const pieceOldIndex = piece.currentIndex;
                const pieceNewIndex = closestPositionIndex;
                
                // 执行交换 - 确保只交换这两个拼图块，不影响其他拼图块
                piece.currentIndex = pieceNewIndex;
                occupyingPiece.currentIndex = pieceOldIndex;
                
                // 强制执行精确对齐 - 避免可能的位置偏移
                this.snapPieceToPosition(piece, pieceNewIndex);
                this.snapPieceToPosition(occupyingPiece, pieceOldIndex);
                
                console.log(`交换完成: 拼图 ${piece.originalIndex} 现在在位置 ${piece.currentIndex}`);
                console.log(`交换完成: 拼图 ${occupyingPiece.originalIndex} 现在在位置 ${occupyingPiece.currentIndex}`);
            } else {
                // 如果目标位置未被占用，直接将拼图块移到该位置
                console.log(`移动拼图块 ${piece.originalIndex} 到空位置 ${closestPositionIndex}`);
                
                // 更新拼图块索引
                piece.currentIndex = closestPositionIndex;
                
                // 移动拼图块到对应位置
                this.snapPieceToPosition(piece, closestPositionIndex);
            }
            
            // 使用边框颜色变化来提示拼图位置是否正确
            this.updateBorderColor(piece); // 更新当前拼图边框颜色
            
            // 如果有交换的拼图，也更新它的边框颜色
            if (occupyingPiece) {
                this.updateBorderColor(occupyingPiece);
            }
            
            // 额外验证拼图状态，确保没有位置冲突
            this.validatePuzzleState();
            
            // 更新进度并检查是否完成
            this.updateProgress();
            this.checkCompletion();
        } catch (error) {
            console.error('处理拼图块释放时出错:', error);
            // 发生错误时，确保拼图块回到原始位置
            try {
                this.snapPieceToPosition(piece, piece.currentIndex);
            } catch (e) {
                console.error('尝试恢复拼图块位置失败:', e);
            }
        }
    }
    
    // 辅助方法：将拼图块精确地对齐到指定位置
    snapPieceToPosition(piece, positionIndex) {
        if (!piece || positionIndex === undefined || !this.piecePositions[positionIndex]) {
            console.error(`无法对齐拼图块 - 无效参数: piece=${!!piece}, positionIndex=${positionIndex}, position=${!!this.piecePositions[positionIndex]}`);
            return;
        }
        
        const position = this.piecePositions[positionIndex];
        
        // 记录变化前的位置
        const oldX = piece.x;
        const oldY = piece.y;
        
        // 设置精确位置
        piece.x = position.x;
        piece.y = position.y;
        
        // 同步更新边框位置
        if (piece.border) {
            piece.border.x = position.x;
            piece.border.y = position.y;
        }
        
        // 根据拼图位置更新边框颜色
        this.updateBorderColor(piece);
        
        // 记录位置变化
        if (Math.abs(oldX - position.x) > 1 || Math.abs(oldY - position.y) > 1) {
            console.log(`拼图块 ${piece.originalIndex} 从 (${oldX.toFixed(1)},${oldY.toFixed(1)}) 移动到网格位置 ${positionIndex}: (${position.x.toFixed(1)},${position.y.toFixed(1)})`);
        }
    }
    
    // 添加简化版的验证函数，只做基本检查，不自动修复
    validatePuzzleState() {
        // 检查每个位置是否只被一个拼图块占用
        const positionOccupancy = {};
        let hasError = false;
        
        for (let piece of this.puzzlePieces) {
            if (!piece) continue;
            
            const index = piece.currentIndex;
            if (index === undefined) continue;
            
            if (positionOccupancy[index]) {
                console.error(`错误: 位置 ${index} 被多个拼图块占用`);
                console.error(`- 已占用: 拼图块 ${positionOccupancy[index].originalIndex}`);
                console.error(`- 重复占用: 拼图块 ${piece.originalIndex}`);
                hasError = true;
            } else {
                positionOccupancy[index] = piece;
            }
        }
        
        return !hasError;
    }
    
    // 增强版验证函数，提供更详细的状态验证
    validatePuzzleState() {
        // 检查每个位置是否只被一个拼图块占用
        const positionOccupancy = {};
        let hasError = false;
        let pieceCount = 0;
        let positionCount = 0;
        
        // 1. 检查位置占用情况
        for (let piece of this.puzzlePieces) {
            if (!piece) continue;
            
            pieceCount++;
            const index = piece.currentIndex;
            
            // 验证索引有效性
            if (index === undefined || index < 0 || index >= this.piecePositions.length) {
                console.error(`错误: 拼图块 ${piece.originalIndex} 的位置索引无效: ${index}`);
                hasError = true;
                continue;
            }
            
            // 验证位置占用
            if (positionOccupancy[index]) {
                console.error(`严重错误: 位置 ${index} 被多个拼图块占用!`);
                console.error(`- 已占用: 拼图块 ${positionOccupancy[index].originalIndex}`);
                console.error(`- 重复占用: 拼图块 ${piece.originalIndex}`);
                hasError = true;
            } else {
                positionOccupancy[index] = piece;
                positionCount++;
            }
            
            // 验证位置坐标
            const expectedPos = this.piecePositions[index];
            if (Math.abs(piece.x - expectedPos.x) > 1 || Math.abs(piece.y - expectedPos.y) > 1) {
                console.warn(`警告: 拼图块 ${piece.originalIndex} 位置 ${index} 坐标偏移: ` +
                             `期望(${expectedPos.x},${expectedPos.y}), 实际(${piece.x},${piece.y})`);
                // 自动修正
                piece.x = expectedPos.x;
                piece.y = expectedPos.y;
                if (piece.border) {
                    piece.border.x = expectedPos.x;
                    piece.border.y = expectedPos.y;
                }
            }
        }
        
        // 2. 汇总检查结果
        console.log(`状态验证: ${pieceCount}个拼图块, ${positionCount}个位置已占用, 错误: ${hasError}`);
        
        return !hasError;
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
        
        // 确保拼图块与正确位置的不匹配度足够高
        let correctlyPlaced = 0;
        const minDisplaced = Math.floor(this.puzzlePieces.length * 0.9); // 降低到90%
        
        // 设置拼图块到打乱后的位置，但保持在网格位置上（不添加随机偏移）
        for (let i = 0; i < this.puzzlePieces.length; i++) {
            const piece = this.puzzlePieces[i];
            if (!piece) continue; // 安全检查
            
            if (i === piece.originalIndex) {
                correctlyPlaced++;
            }
            
            // 更新拼图块位置 - 移除随机偏移，使拼图块整齐排列
            piece.x = positions[i].x;
            piece.y = positions[i].y;
            
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
        
        // 强制至少进行额外的位置交换，确保充分打乱
        if (this.puzzlePieces.length > 5) {
            for (let i = 0; i < 5; i++) { // 增加到5次交换
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
            
            // 添加文字 - 使用粉色和可爱风格
            this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height - 150,
                '这是我们最好的回忆',
                {
                    fontSize: '32px',
                    fill: '#FF69B4', // 粉色
                    fontFamily: 'Comic Sans MS, Arial, sans-serif', // 更可爱的字体
                    stroke: '#FFB6C1', // 浅粉色描边
                    strokeThickness: 5,
                    align: 'center',
                    wordWrap: { width: 500 },
                    shadow: { offsetX: 2, offsetY: 2, color: '#FFC0CB', blur: 5, fill: true }
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

    updateBorderColor(piece) {
        if (!piece || !piece.border) return;
        
        // 清除当前边框
        piece.border.clear();
        
        // 统一使用白色边框，不区分拼图是否在正确位置
        piece.border.lineStyle(2, 0xffffff, 0.8);
        
        // 绘制边框
        piece.border.strokeRect(
            -this.pieceWidth/2 + 2.5, 
            -this.pieceHeight/2 + 2.5, 
            this.pieceWidth - 5, 
            this.pieceHeight - 5
        );
    }
} 
