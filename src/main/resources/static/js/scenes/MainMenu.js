class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 背景 - 使用更好的方式确保背景铺满屏幕
        const bg = this.add.image(width / 2, height / 2, 'background');
        bg.setDisplaySize(width, height);
        
        // 当窗口大小改变时，调整背景图片大小
        this.scale.on('resize', (gameSize) => {
            bg.setPosition(gameSize.width / 2, gameSize.height / 2);
            bg.setDisplaySize(gameSize.width, gameSize.height);
            
            // 调整520文本位置
            if (this.text520) {
                this.text520.setPosition(gameSize.width / 2, gameSize.height - 200);
            }
        });
        
        // 创建粒子效果 - 使用Phaser 3.70.0的新API
        try {
            // 直接创建粒子 - 使用Phaser 3.70.0兼容语法
            // 这种方式在3.70.0中仍然有效
            this.add.particles(width / 2, height / 2, 'heart', {
                lifespan: 2000,
                speed: { min: 50, max: 100 },
                angle: { min: 0, max: 360 },
                scale: { start: 0.2, end: 0 },
                quantity: 1,
                frequency: 500
            });
        } catch(e) {
            console.error('创建粒子效果失败:', e);
            
            // 如果粒子系统失败，使用备用方案
            try {
                // 创建几个心形图像作为替代
                for (let i = 0; i < 5; i++) {
                    const heart = this.add.image(
                        Phaser.Math.Between(width * 0.3, width * 0.7),
                        Phaser.Math.Between(height * 0.3, height * 0.7),
                        'heart'
                    );
                    
                    heart.setAlpha(0.5);
                    heart.setScale(0.15);
                    
                    // 添加简单动画
                    this.tweens.add({
                        targets: heart,
                        alpha: { from: 0.5, to: 0 },
                        scale: { from: 0.15, to: 0.05 },
                        y: heart.y - 100,
                        duration: 2000,
                        repeat: -1
                    });
                }
            } catch (e2) {
                console.error('备用动画创建失败:', e2);
            }
        }
        
        // 添加游戏选择文本 - 向下调整位置
        this.add.text(width / 2, height / 3.5, '选择游戏模式', {
            fontSize: '36px', // 增大字体
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: { offsetX: 2, offsetY: 2, color: '#ff69b4', blur: 8, fill: true }
        }).setOrigin(0.5);
        
        // 原始游戏按钮 - 整体向上移动
        const startButton = this.add.image(width / 2, height / 2 - 80, 'start-btn');
        startButton.setInteractive({ useHandCursor: true });
        startButton.on('pointerover', () => startButton.setScale(1.1));
        startButton.on('pointerout', () => startButton.setScale(1));
        startButton.on('pointerdown', () => {
            // 安全播放音效
            if (this.game.global && this.game.global.playSound) {
                this.game.global.playSound('click');
            }
            // 检查是否已有名字，有则直接进入，无则输入
            if (this.game.global && this.game.global.playerName) {
                this.scene.start('StoryScene');
            } else {
                this.showNameInput('story');
            }
        });
        
        // 添加原始游戏文本
        this.add.text(width / 2, height / 2 - 80, '故事模式', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // 解密游戏按钮
        const riddleButton = this.add.image(width / 2, height / 2 - 20, 'start-btn');
        riddleButton.setInteractive({ useHandCursor: true });
        riddleButton.on('pointerover', () => riddleButton.setScale(1.1));
        riddleButton.on('pointerout', () => riddleButton.setScale(1));
        riddleButton.on('pointerdown', () => {
            // 安全播放音效
            if (this.game.global && this.game.global.playSound) {
                this.game.global.playSound('click');
            }
            // 检查是否已有名字，有则直接进入，无则输入
            if (this.game.global && this.game.global.playerName) {
                this.scene.start('RiddleScene');
            } else {
                this.showNameInput('riddle');
            }
        });
        
        // 添加解密游戏文本
        this.add.text(width / 2, height / 2 - 20, '寻找回忆', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // 问答游戏按钮
        const quizButton = this.add.image(width / 2, height / 2 + 40, 'start-btn');
        quizButton.setInteractive({ useHandCursor: true });
        quizButton.on('pointerover', () => quizButton.setScale(1.1));
        quizButton.on('pointerout', () => quizButton.setScale(1));
        quizButton.on('pointerdown', () => {
            // 安全播放音效
            if (this.game.global && this.game.global.playSound) {
                this.game.global.playSound('click');
            }
            // 检查是否已有名字，有则直接进入，无则输入
            if (this.game.global && this.game.global.playerName) {
                this.scene.start('QuizScene');
            } else {
                this.showNameInput('quiz');
            }
        });
        
        // 添加问答游戏文本
        this.add.text(width / 2, height / 2 + 40, '爱的问答', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // 拼图游戏按钮
        const puzzleButton = this.add.image(width / 2, height / 2 + 100, 'start-btn');
        puzzleButton.setInteractive({ useHandCursor: true });
        puzzleButton.on('pointerover', () => puzzleButton.setScale(1.1));
        puzzleButton.on('pointerout', () => puzzleButton.setScale(1));
        puzzleButton.on('pointerdown', () => {
            // 安全播放音效
            if (this.game.global && this.game.global.playSound) {
                this.game.global.playSound('click');
            }
            // 检查是否已有名字，有则直接进入，无则输入
            if (this.game.global && this.game.global.playerName) {
                this.scene.start('PuzzleScene');
            } else {
                this.showNameInput('puzzle');
            }
        });
        
        // 添加拼图游戏文本
        this.add.text(width / 2, height / 2 + 100, '回忆拼图', {
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
            // 安全播放音效
            if (this.game.global && this.game.global.playSound) {
                this.game.global.playSound('click');
            }
            this.loadSavedGame();
        });
        
        // 检查背景音乐是否在播放，如果没有则尝试播放
        try {
            if (this.game.global && this.game.global.sounds && this.game.global.sounds.bgm) {
                if (!this.game.global.sounds.bgm.isPlaying) {
                    this.game.global.sounds.bgm.play();
                }
            }
        } catch (e) {
            console.warn('背景音乐播放失败，但游戏会继续运行', e);
        }
        
        // 添加5·20特效
        const style = {
            fontSize: '72px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#ff4081'
        };
        
        this.text520 = this.add.text(width / 2, height - 200, '520', style);
        this.text520.setOrigin(0.5);
        
        // 添加闪烁动画
        this.tweens.add({
            targets: this.text520,
            alpha: { from: 1, to: 0.5 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }
    
    showNameInput(gameMode) {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 首先尝试清理可能存在的之前的DOM元素
        this.cleanupExistingInputs();
        
        // 为每次调用生成唯一ID
        const uniquePrefix = Date.now().toString();
        const inputId = `player-name-input-${uniquePrefix}`;
        const formId = `name-form-${uniquePrefix}`;
        
        // 创建半透明背景
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0);
        
        // 创建对话框
        const dialog = this.add.rectangle(width / 2, height / 2, 400, 240, 0xffffff);
        dialog.setOrigin(0.5);
        dialog.setStrokeStyle(4, 0xff4081);
        
        // 提示文本
        const promptText = this.add.text(width / 2, height / 2 - 70, '亲爱的，请输入你的名字:', {
            fontSize: '22px',
            fill: '#000000',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });
        promptText.setOrigin(0.5);
        
        // 创建DOM输入框
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.id = inputId; // 使用唯一ID
        inputElement.name = `playerName-${uniquePrefix}`; // 使用唯一name
        inputElement.style = `
            width: 300px;
            padding: 12px;
            font-size: 18px;
            border: 3px solid #ff4081;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(255, 64, 129, 0.5);
            background-color: #fff8f8;
            color: #333;
            outline: none;
        `;
        inputElement.maxLength = 20;
        inputElement.placeholder = '在这里输入你的名字...';
        
        // 创建包装div - 使用表单可以更好地管理输入
        const formElement = document.createElement('form');
        formElement.id = formId;
        formElement.appendChild(inputElement);
        
        // 防止表单提交导致页面刷新
        formElement.onsubmit = (e) => {
            e.preventDefault();
            return false;
        };
        
        // 添加DOM元素到Phaser
        const inputDOM = this.add.dom(width / 2, height / 2 - 10).createFromHTML(formElement.outerHTML);
        
        // 获取实际的DOM输入元素（添加到Phaser后的）
        const actualForm = document.getElementById(formId);
        const actualInputElement = document.getElementById(inputId);
        
        // 自动聚焦输入框
        setTimeout(() => {
            if (actualInputElement) {
                actualInputElement.focus();
            }
        }, 100);
        
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.id = `button-container-${uniquePrefix}`;
        buttonContainer.style = `
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 10px;
        `;
        
        // 确定按钮
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '确定';
        confirmBtn.style = `
            background-color: #ff4081;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 30px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
        `;
        
        // 取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style = `
            background-color: #f0f0f0;
            color: #666;
            border: none;
            border-radius: 8px;
            padding: 12px 30px;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
        `;
        
        buttonContainer.appendChild(confirmBtn);
        buttonContainer.appendChild(cancelBtn);
        
        // 添加按钮DOM到Phaser
        const buttonsDOM = this.add.dom(width / 2, height / 2 + 70).createFromHTML(buttonContainer.outerHTML);
        
        // 获取按钮元素
        const actualConfirmBtn = buttonsDOM.node.querySelector('button:first-child');
        const actualCancelBtn = buttonsDOM.node.querySelector('button:last-child');
        
        // 添加按钮悬停效果
        if (actualConfirmBtn) {
            actualConfirmBtn.onmouseover = () => {
                actualConfirmBtn.style.transform = 'scale(1.05)';
                actualConfirmBtn.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
            };
            actualConfirmBtn.onmouseout = () => {
                actualConfirmBtn.style.transform = 'scale(1)';
                actualConfirmBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            };
        }
        
        if (actualCancelBtn) {
            actualCancelBtn.onmouseover = () => {
                actualCancelBtn.style.transform = 'scale(1.05)';
                actualCancelBtn.style.backgroundColor = '#e6e6e6';
            };
            actualCancelBtn.onmouseout = () => {
                actualCancelBtn.style.transform = 'scale(1)';
                actualCancelBtn.style.backgroundColor = '#f0f0f0';
            };
        }
        
        // 添加按钮点击事件
        if (actualConfirmBtn) {
            actualConfirmBtn.onclick = () => {
                // 安全播放音效
                try {
                    if (this.game.global && this.game.global.playSound) {
                        this.game.global.playSound('click');
                    }
                } catch(e) {
                    console.log('音效播放失败，但继续执行');
                }
                
                try {
                    // 获取输入值
                    const name = actualInputElement ? actualInputElement.value.trim() : '';
                    console.log('输入的名字:', name);
                    if (name) {
                        // 检查名字是否为有效名字（isla、张歪歪或张雅媛）
                        const validNames = ['isla', '张歪歪', '张雅媛'];
                        if (!validNames.includes(name.toLowerCase())) {
                            // 名字不正确，播放错误视频
                            console.log('名字不正确，播放错误视频');
                            
                            // 清除输入框和按钮
                            const elementsToDestroy = [
                                { name: 'inputDOM', element: inputDOM },
                                { name: 'buttonsDOM', element: buttonsDOM }
                            ];
                            
                            for (const item of elementsToDestroy) {
                                try {
                                    if (item.element && typeof item.element.destroy === 'function') {
                                        item.element.destroy();
                                    }
                                } catch (err) {
                                    console.error(`销毁元素时出错 ${item.name}:`, err);
                                }
                            }
                            
                            // 修改提示文本
                            promptText.setText('密码错误!');
                            promptText.setStyle({ fontSize: '32px', fill: '#ff0000', fontWeight: 'bold' });
                            
                            // 创建视频元素
                            const videoElement = document.createElement('video');
                            videoElement.id = 'wrong-video';
                            videoElement.style = `
                                width: 320px;
                                height: 240px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(255, 0, 0, 0.7);
                            `;
                            videoElement.src = 'assets/videos/wrong.mp4';
                            videoElement.autoplay = true;
                            
                            // 当视频结束时删除元素并返回主菜单
                            videoElement.onended = () => {
                                try {
                                    // 清除所有元素
                                    const allElementsToDestroy = [
                                        { name: 'overlay', element: overlay },
                                        { name: 'dialog', element: dialog },
                                        { name: 'promptText', element: promptText }
                                    ];
                                    
                                    for (const item of allElementsToDestroy) {
                                        if (item.element && typeof item.element.destroy === 'function') {
                                            item.element.destroy();
                                        }
                                    }
                                    
                                    // 移除视频DOM
                                    if (videoDOM && typeof videoDOM.destroy === 'function') {
                                        videoDOM.destroy();
                                    }
                                    
                                    // 强制清理残留的DOM元素
                                    this.cleanupExistingInputs();
                                    
                                    // 回到主菜单
                                    this.scene.restart();
                                } catch (err) {
                                    console.error('清理视频元素时出错:', err);
                                    this.scene.restart();
                                }
                            };
                            
                            // 添加视频DOM到Phaser
                            const videoDOM = this.add.dom(width / 2, height / 2 + 30).createFromHTML(videoElement.outerHTML);
                            
                            return; // 不继续执行后面的代码
                        }
                        
                        // 设置玩家名字
                        if (this.game.global) {
                            this.game.global.playerName = name;
                            console.log('设置玩家名字:', name);
                        } else {
                            console.warn('game.global不存在，无法保存玩家名字');
                        }
                        
                        // 先禁用按钮，防止重复点击
                        if (actualConfirmBtn) actualConfirmBtn.disabled = true;
                        if (actualCancelBtn) actualCancelBtn.disabled = true;
                        
                        console.log('准备清除对话框元素');
                        
                        // 清除对话框 - 添加检查确保元素存在
                        const elementsToDestroy = [
                            { name: 'overlay', element: overlay },
                            { name: 'dialog', element: dialog },
                            { name: 'promptText', element: promptText },
                            { name: 'inputDOM', element: inputDOM },
                            { name: 'buttonsDOM', element: buttonsDOM }
                        ];
                        
                        for (const item of elementsToDestroy) {
                            try {
                                if (item.element && typeof item.element.destroy === 'function') {
                                    console.log(`销毁元素: ${item.name}`);
                                    item.element.destroy();
                                } else {
                                    console.warn(`元素不存在或无法销毁: ${item.name}`);
                                }
                            } catch (err) {
                                console.error(`销毁元素时出错 ${item.name}:`, err);
                            }
                        }
                        
                        console.log('切换到场景:', gameMode);
                        
                        // 使用setTimeout确保UI元素已完全销毁后再切换场景
                        setTimeout(() => {
                            try {
                                console.log('开始切换场景...');
                                // 根据游戏模式跳转到不同场景
                                switch(gameMode) {
                                    case 'story':
                                        console.log('切换到故事场景');
                                        this.scene.start('StoryScene');
                                        break;
                                    case 'riddle':
                                        console.log('切换到解密场景');
                                        this.scene.start('RiddleScene');
                                        break;
                                    case 'quiz':
                                        console.log('切换到问答场景');
                                        this.scene.start('QuizScene');
                                        break;
                                    case 'puzzle':
                                        console.log('切换到拼图场景');
                                        // 确保场景已注册
                                        if (this.scene.get('PuzzleScene')) {
                                            this.scene.start('PuzzleScene');
                                        } else {
                                            console.error('拼图场景未注册，尝试使用自定义路径');
                                            // 尝试启动可能的备选场景名
                                            if (this.scene.get('custom/PuzzleScene')) {
                                                this.scene.start('custom/PuzzleScene');
                                            } else {
                                                console.error('所有拼图场景尝试均失败');
                                                alert('场景加载失败，请刷新页面');
                                                this.scene.start('MainMenu');
                                            }
                                        }
                                        break;
                                    default:
                                        console.log('切换到默认场景(故事场景)');
                                        this.scene.start('StoryScene');
                                        break;
                                }
                            } catch (sceneErr) {
                                console.error('切换场景时出错:', sceneErr);
                                // 如果切换场景失败，重新加载当前场景
                                alert('场景加载失败，即将返回主菜单');
                                this.scene.start('MainMenu');
                            }
                        }, 100);
                    } else {
                        // 如果没有输入名字，显示提示
                        alert('请输入你的名字后再继续');
                    }
                } catch(e) {
                    console.error('确认按钮处理过程中发生错误:', e);
                    alert('发生错误，请刷新页面重试');
                    
                    // 强制清理UI
                    try {
                        // 先禁用按钮，防止重复点击
                        if (actualConfirmBtn) actualConfirmBtn.disabled = true;
                        if (actualCancelBtn) actualCancelBtn.disabled = true;
                        
                        const elementsToDestroy = [
                            { name: 'overlay', element: overlay },
                            { name: 'dialog', element: dialog },
                            { name: 'promptText', element: promptText },
                            { name: 'inputDOM', element: inputDOM },
                            { name: 'buttonsDOM', element: buttonsDOM }
                        ];
                        
                        for (const item of elementsToDestroy) {
                            try {
                                if (item.element && typeof item.element.destroy === 'function') {
                                    item.element.destroy();
                                }
                            } catch (err) {
                                console.error(`清理UI时出错 ${item.name}:`, err);
                            }
                        }
                        
                        // 如果清理UI后仍然有问题，重新加载场景
                        this.scene.restart();
                    } catch(e2) {
                        console.error('清理UI时发生错误:', e2);
                        this.scene.restart();
                    }
                }
            };
        }
        
        if (actualCancelBtn) {
            actualCancelBtn.onclick = () => {
                try {
                    // 安全播放音效
                    if (this.game.global && this.game.global.playSound) {
                        this.game.global.playSound('click');
                    }
                    
                    console.log('取消按钮被点击，关闭对话框');
                    
                    // 先禁用按钮，防止重复点击
                    if (actualConfirmBtn) actualConfirmBtn.disabled = true;
                    if (actualCancelBtn) actualCancelBtn.disabled = true;
                    
                    // 清除DOM元素
                    this.cleanupExistingInputs();
                    
                    // 清除对话框
                    const elementsToDestroy = [
                        { name: 'overlay', element: overlay },
                        { name: 'dialog', element: dialog },
                        { name: 'promptText', element: promptText },
                        { name: 'inputDOM', element: inputDOM },
                        { name: 'buttonsDOM', element: buttonsDOM }
                    ];
                    
                    for (const item of elementsToDestroy) {
                        try {
                            if (item.element && typeof item.element.destroy === 'function') {
                                console.log(`销毁元素: ${item.name}`);
                                item.element.destroy();
                            } else {
                                console.warn(`元素不存在或无法销毁: ${item.name}`);
                            }
                        }
                        catch (err) {
                            console.error(`销毁元素时出错 ${item.name}:`, err);
                        }
                    }
                    
                    // 确保场景中没有残留的DOM元素
                    setTimeout(() => {
                        try {
                            this.cleanupExistingInputs();
                        } catch (err) {
                            console.error('清理残留DOM元素失败:', err);
                        }
                    }, 200);
                    
                } catch(e) {
                    console.error('取消按钮处理过程中发生错误:', e);
                    
                    // 强制刷新场景
                    this.scene.restart();
                }
            };
        }
        
        // 添加回车键提交
        if (actualInputElement) {
            actualInputElement.onkeydown = (e) => {
                if (e.key === 'Enter' && actualConfirmBtn) {
                    actualConfirmBtn.click();
                }
            };
        }
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
        dialog.setStrokeStyle(4, 0xff4081);
        
        // 提示文本
        const promptText = this.add.text(width / 2, height / 2 - 30, '未找到保存的游戏进度', {
            fontSize: '22px',
            fill: '#000000',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });
        promptText.setOrigin(0.5);
        
        // 创建确定按钮
        const buttonElement = document.createElement('button');
        buttonElement.textContent = '确定';
        buttonElement.style = `
            background-color: #ff4081;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 30px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
        `;
        
        // 创建包装div
        const buttonDiv = document.createElement('div');
        buttonDiv.appendChild(buttonElement);
        
        // 添加按钮到Phaser
        const buttonDOM = this.add.dom(width / 2, height / 2 + 30).createFromHTML(buttonDiv.outerHTML);
        
        // 获取实际按钮元素
        const actualButton = buttonDOM.node.querySelector('button');
        
        // 添加悬停效果
        if (actualButton) {
            actualButton.onmouseover = () => {
                actualButton.style.transform = 'scale(1.05)';
                actualButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
            };
            
            actualButton.onmouseout = () => {
                actualButton.style.transform = 'scale(1)';
                actualButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            };
            
            // 添加点击事件
            actualButton.onclick = () => {
                overlay.destroy();
                dialog.destroy();
                promptText.destroy();
                buttonDOM.destroy();
                
                // 安全播放音效
                if (this.game.global && this.game.global.playSound) {
                    this.game.global.playSound('click');
                }
            };
        }
    }
    
    cleanupExistingInputs() {
        // 查找并移除所有可能存在的之前的DOM元素
        const oldForms = document.querySelectorAll('form[id^="name-form-"]');
        oldForms.forEach(form => {
            try {
                if (form && form.parentNode) {
                    form.parentNode.removeChild(form);
                    console.log('已移除旧表单元素:', form.id);
                }
            } catch (e) {
                console.error('移除旧表单元素失败:', e);
            }
        });
        
        // 移除潜在的按钮容器
        const oldButtonContainers = document.querySelectorAll('div[id^="button-container-"]');
        oldButtonContainers.forEach(container => {
            try {
                if (container && container.parentNode) {
                    container.parentNode.removeChild(container);
                    console.log('已移除旧按钮容器:', container.id);
                }
            } catch (e) {
                console.error('移除旧按钮容器失败:', e);
            }
        });
        
        // 查找所有未被移除的输入框和按钮元素
        const oldInputs = document.querySelectorAll('input[id^="player-name-input-"]');
        oldInputs.forEach(input => {
            try {
                if (input && input.parentNode) {
                    input.parentNode.removeChild(input);
                    console.log('已移除孤立的输入框元素:', input.id);
                }
            } catch (e) {
                console.error('移除旧输入框元素失败:', e);
            }
        });
        
        // 移除可能的孤立按钮元素
        const oldButtons = document.querySelectorAll('button');
        oldButtons.forEach(button => {
            // 只移除没有父容器或者名字相关的按钮
            if (!button.parentNode || 
                (button.textContent && (button.textContent === '确定' || button.textContent === '取消'))) {
                try {
                    if (button.parentNode) {
                        button.parentNode.removeChild(button);
                    }
                    console.log('已移除孤立的按钮元素');
                } catch (e) {
                    console.error('移除孤立按钮元素失败:', e);
                }
            }
        });
    }
} 