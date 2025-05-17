const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#fce4ec',
    scene: [
        Boot, 
        Preloader, 
        MainMenu, 
        StoryScene, 
        PuzzleScene1, 
        PuzzleScene2, 
        PuzzleScene3, 
        FinalScene,
        RiddleScene,
        QuizScene,
        PuzzleScene
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    dom: {
        createContainer: true
    }
};

// 游戏实例
const game = new Phaser.Game(config);

// 游戏全局变量
game.global = {
    playerName: '',
    progress: 0,
    savedState: null,
    
    // 保存游戏进度到服务器
    saveProgress: function(currentLevel, gameState) {
        const progressData = {
            playerId: this.playerName || 'default',
            currentLevel: currentLevel,
            gameState: JSON.stringify(gameState)
        };
        
        fetch('/api/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(progressData)
        })
        .then(response => response.json())
        .then(data => console.log('Progress saved:', data))
        .catch(error => console.error('Error saving progress:', error));
    },
    
    // 从服务器加载游戏进度
    loadProgress: function() {
        const playerId = this.playerName || 'default';
        
        return fetch(`/api/progress/${playerId}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                return null;
            })
            .then(data => {
                if (data) {
                    this.progress = data.currentLevel;
                    try {
                        this.savedState = JSON.parse(data.gameState);
                    } catch (e) {
                        console.error('Error parsing saved game state:', e);
                        this.savedState = null;
                    }
                    return true;
                }
                return false;
            })
            .catch(error => {
                console.error('Error loading progress:', error);
                return false;
            });
    }
}; 