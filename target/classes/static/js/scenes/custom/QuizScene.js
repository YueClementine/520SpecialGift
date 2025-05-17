class QuizScene extends Phaser.Scene {
    constructor() {
        super('QuizScene');
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        // 问题库（可以根据需要修改内容）
        this.questions = [
            {
                question: "我们第一次相遇是在哪里？",
                options: ["咖啡厅", "图书馆", "朋友聚会", "学校"],
                correctAnswer: 2,
                explanation: "记得那天，在李明的生日聚会上我们初次见面..."
            },
            {
                question: "我最喜欢的颜色是什么？",
                options: ["蓝色", "粉色", "紫色", "绿色"],
                correctAnswer: 1,
                explanation: "你总是说粉色充满了温暖和浪漫的感觉..."
            },
            {
                question: "我们一起去过的第一个城市是？",
                options: ["上海", "杭州", "北京", "成都"],
                correctAnswer: 3,
                explanation: "那次成都之行，我们一起吃了很多美食，还看了熊猫..."
            },
            {
                question: "我最喜欢的电影类型是？",
                options: ["爱情片", "科幻片", "动作片", "动画片"],
                correctAnswer: 0,
                explanation: "你总是说爱情片让你相信世界上真的有美好的爱情..."
            },
            {
                question: "我们之间的纪念日是几月几日？",
                options: ["5月2日", "5月20日", "6月1日", "7月7日"],
                correctAnswer: 1,
                explanation: "520，我爱你的谐音，是我们相爱的日子..."
            }
        ];
    }

    preload() {
        // 加载场景资源
        this.load.image('quiz-bg', 'assets/custom/quiz-bg.jpg');
        this.load.image('option-btn', 'assets/custom/option-btn.png');
        this.load.image('quiz-panel', 'assets/custom/quiz-panel.png');
        this.load.image('result-panel', 'assets/custom/result-panel.png');
        this.load.image('next-btn', 'assets/custom/next-btn.png');
        this.load.image('finish-btn', 'assets/custom/finish-btn.png');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 添加背景
        this.add.image(width / 2, height / 2, 'quiz-bg').setDisplaySize(width, height);
        
        // 添加标题
        this.add.text(width / 2, 50, '了解彼此的小测验', {
            fontSize: '36px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // 创建问题面板
        this.questionPanel = this.add.container(width / 2, 200);
        
        // 问题面板背景
        this.panelBg = this.add.image(0, 0, 'quiz-panel').setScale(0.8);
        this.questionPanel.add(this.panelBg);
        
        // 问题文本
        this.questionText = this.add.text(0, -80, '', {
            fontSize: '28px',
            fill: '#000000',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 500 }
        }).setOrigin(0.5);
        this.questionPanel.add(this.questionText);
        
        // 创建选项按钮
        this.optionButtons = [];
        const startY = 0;
        const spacing = 70;
        
        for (let i = 0; i < 4; i++) {
            const y = startY + i * spacing;
            
            const button = this.add.image(0, y, 'option-btn').setScale(0.8);
            button.setInteractive({ useHandCursor: true });
            
            const text = this.add.text(0, y, '', {
                fontSize: '22px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
            
            button.on('pointerover', () => button.setTint(0xdddddd));
            button.on('pointerout', () => button.clearTint());
            button.on('pointerdown', () => this.checkAnswer(i));
            
            this.questionPanel.add(button);
            this.questionPanel.add(text);
            
            this.optionButtons.push({ button, text });
        }
        
        // 创建结果面板（初始隐藏）
        this.resultPanel = this.add.container(width / 2, height / 2).setVisible(false);
        
        // 结果面板背景
        const resultBg = this.add.image(0, 0, 'result-panel').setScale(0.8);
        this.resultPanel.add(resultBg);
        
        // 结果文本
        this.resultText = this.add.text(0, -50, '', {
            fontSize: '28px',
            fill: '#000000',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 500 }
        }).setOrigin(0.5);
        this.resultPanel.add(this.resultText);
        
        // 解释文本
        this.explanationText = this.add.text(0, 30, '', {
            fontSize: '22px',
            fill: '#000000',
            fontFamily: 'Arial',
            align: 'center',
            fontStyle: 'italic',
            wordWrap: { width: 500 }
        }).setOrigin(0.5);
        this.resultPanel.add(this.explanationText);
        
        // 下一题按钮
        this.nextButton = this.add.image(0, 120, 'next-btn').setScale(0.8);
        this.nextButton.setInteractive({ useHandCursor: true });
        this.nextButton.on('pointerover', () => this.nextButton.setTint(0xdddddd));
        this.nextButton.on('pointerout', () => this.nextButton.clearTint());
        this.nextButton.on('pointerdown', () => this.showNextQuestion());
        this.resultPanel.add(this.nextButton);
        
        // 分数显示
        this.scoreText = this.add.text(width - 150, height - 50, '得分: 0', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 3
        });
        
        // 显示第一个问题
        this.showQuestion(this.currentQuestionIndex);
    }
    
    showQuestion(index) {
        const question = this.questions[index];
        
        // 更新问题文本
        this.questionText.setText(question.question);
        
        // 更新选项
        for (let i = 0; i < this.optionButtons.length; i++) {
            this.optionButtons[i].text.setText(question.options[i]);
            this.optionButtons[i].button.clearTint();
            this.optionButtons[i].button.setInteractive();
        }
        
        // 隐藏结果面板
        this.resultPanel.setVisible(false);
        
        // 显示问题面板
        this.questionPanel.setVisible(true);
    }
    
    checkAnswer(optionIndex) {
        const question = this.questions[this.currentQuestionIndex];
        const correct = (optionIndex === question.correctAnswer);
        
        // 禁用所有按钮
        this.optionButtons.forEach(option => option.button.disableInteractive());
        
        // 高亮显示正确答案
        this.optionButtons[question.correctAnswer].button.setTint(0x00ff00);
        
        // 如果选择错误，高亮显示错误答案
        if (!correct) {
            this.optionButtons[optionIndex].button.setTint(0xff0000);
        }
        
        // 更新分数
        if (correct) {
            this.score += 20; // 每题20分
            this.scoreText.setText(`得分: ${this.score}`);
        }
        
        // 设置结果文本
        this.resultText.setText(correct ? '回答正确！' : '回答错误！');
        this.explanationText.setText(question.explanation);
        
        // 延迟显示结果面板
        this.time.delayedCall(1000, () => {
            this.questionPanel.setVisible(false);
            this.resultPanel.setVisible(true);
            
            // 如果是最后一题，显示完成按钮
            if (this.currentQuestionIndex === this.questions.length - 1) {
                this.nextButton.setTexture('finish-btn');
            }
        });
    }
    
    showNextQuestion() {
        this.currentQuestionIndex++;
        
        // 检查是否还有问题
        if (this.currentQuestionIndex < this.questions.length) {
            this.showQuestion(this.currentQuestionIndex);
        } else {
            // 游戏结束，显示最终结果
            this.showFinalResult();
        }
    }
    
    showFinalResult() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 清除所有现有UI
        this.questionPanel.setVisible(false);
        this.resultPanel.setVisible(false);
        
        // 创建最终结果面板
        const finalPanel = this.add.container(width / 2, height / 2);
        
        // 添加背景
        const finalBg = this.add.rectangle(0, 0, 600, 400, 0x000000, 0.8);
        finalPanel.add(finalBg);
        
        // 添加标题
        const titleText = this.add.text(0, -150, '测验完成！', {
            fontSize: '36px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        finalPanel.add(titleText);
        
        // 添加分数
        const scoreText = this.add.text(0, -80, `你的得分: ${this.score}/100`, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        finalPanel.add(scoreText);
        
        // 添加评价
        let feedbackText = '';
        if (this.score === 100) {
            feedbackText = '太棒了！你真的非常了解我！';
        } else if (this.score >= 80) {
            feedbackText = '很不错！你对我的了解相当深入！';
        } else if (this.score >= 60) {
            feedbackText = '还不错，但还有进步空间！';
        } else {
            feedbackText = '看来我们需要多花时间相互了解~';
        }
        
        const feedback = this.add.text(0, 0, feedbackText, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 500 }
        }).setOrigin(0.5);
        finalPanel.add(feedback);
        
        // 添加进入下一场景按钮
        const nextSceneBtn = this.add.image(0, 100, 'next-scene-btn').setScale(0.8);
        nextSceneBtn.setInteractive({ useHandCursor: true });
        nextSceneBtn.on('pointerover', () => nextSceneBtn.setTint(0xdddddd));
        nextSceneBtn.on('pointerout', () => nextSceneBtn.clearTint());
        nextSceneBtn.on('pointerdown', () => {
            this.scene.start('PuzzleScene');
        });
        finalPanel.add(nextSceneBtn);
        
        // 添加爱心粒子效果
        const particles = this.add.particles('heart');
        particles.createEmitter({
            x: { min: width / 2 - 300, max: width / 2 + 300 },
            y: { min: height / 2 - 200, max: height / 2 + 200 },
            speed: { min: 50, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            lifespan: 2000,
            quantity: 2,
            frequency: 200
        });
    }
} 