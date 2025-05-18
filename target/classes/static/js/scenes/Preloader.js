class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
        this.audioLoaded = {
            bgm: false
            // 移除click和success音效
        };
    }

    preload() {
        // 创建加载界面
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 加载背景 - 背景中已包含"loading"字样
        const bg = this.add.image(width / 2, height / 2, 'loading-background');
        bg.setDisplaySize(width, height);
        
        // 移除加载进度条和加载文本
        
        // 添加加载失败的处理
        this.load.on('loaderror', (file) => {
            console.error('资源加载失败：', file.key);
            
            // 减少加载计数，避免卡在加载界面
            this.load.totalFailed--;
            this.load.totalToLoad--;
        });
        
        // 动态加载心形光标JS脚本
        try {
            // 创建脚本标签
            const script = document.createElement('script');
            script.src = 'js/heartCursor.js';
            script.onload = () => console.log('心形光标脚本加载成功');
            script.onerror = (e) => console.error('心形光标脚本加载失败:', e);
            document.head.appendChild(script);
        } catch (e) {
            console.error('加载心形光标脚本失败:', e);
        }
        
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
        
        // 添加音频加载成功/失败事件处理
        this.load.on('filecomplete-audio', (key) => {
            console.log(`音频 ${key} 加载成功`);
            if (this.audioLoaded.hasOwnProperty(key)) {
                this.audioLoaded[key] = true;
            }
        });
        
        this.load.on('filecomplete', (key, type) => {
            if (type === 'audio') {
                console.log(`音频 ${key} 加载成功`);
                if (this.audioLoaded.hasOwnProperty(key)) {
                    this.audioLoaded[key] = true;
                }
            }
        });
        
        // 尝试加载音频资源，但添加错误处理使游戏能继续
        try {
            // 只加载背景音乐，移除click和success
            this.load.audio('bgm', ['assets/bgm.mp3', 'assets/bgm.ogg', 'assets/bgm.wav']);
        } catch (e) {
            console.error('音频预加载失败：', e);
        }
        
        // 尝试预加载视频资源（但即使失败也能继续）
        try {
            console.log('开始加载视频资源...');
            // 添加视频加载事件监听
            this.load.on('filecomplete-video', (key) => {
                console.log(`视频 ${key} 加载成功`);
            });
            
            this.load.on('loaderror-video', (file) => {
                console.error(`视频 ${file.key} 加载失败`);
            });
            
            // 使用统一的错误视频
            this.load.video('wrong-video', 'assets/videos/wrong.mp4', 'loadeddata', false, true);
        } catch (e) {
            console.error('视频预加载失败：', e);
        }
    }

    create() {
        // 创建全局对象（如果不存在）
        this.game.global = this.game.global || {};
        
        // 创建音频对象，并处理可能的错误
        try {
            // 检查音频是否已加载
            if (this.audioLoaded.bgm && this.cache.audio.exists('bgm')) {
                this.game.global.sounds = {
                    bgm: this.sound.add('bgm', { loop: true, volume: 0.5 })
                };
                
                // 尝试自动播放背景音乐
                this.game.global.sounds.bgm.play();
                
                // 检测音频是否真的在播放（处理浏览器自动播放策略）
                if (!this.game.global.sounds.bgm.isPlaying) {
                    console.log('背景音乐未能自动播放，等待用户交互...');
                    
                    // 添加一次性事件监听器，在用户交互时播放音乐
                    const resumeAudio = () => {
                        if (this.game.global.sounds.bgm && !this.game.global.sounds.bgm.isPlaying) {
                            this.game.global.sounds.bgm.play();
                        }
                        document.removeEventListener('click', resumeAudio);
                        document.removeEventListener('touchstart', resumeAudio);
                        document.removeEventListener('keydown', resumeAudio);
                    };
                    
                    document.addEventListener('click', resumeAudio);
                    document.addEventListener('touchstart', resumeAudio);
                    document.addEventListener('keydown', resumeAudio);
                }
            } else {
                console.warn('背景音乐加载失败，游戏将继续但没有背景音乐');
                this.game.global.sounds = { bgm: null };
            }
            
            // 移除success和click音效的初始化，但保留空值，保证代码兼容性
            this.game.global.sounds.success = null;
            this.game.global.sounds.click = null;
            
        } catch (e) {
            console.error('创建音频对象失败：', e);
            // 确保全局音频对象存在，即使为空
            this.game.global.sounds = {
                bgm: null,
                success: null,
                click: null
            };
        }
        
        // 检查视频资源是否加载成功
        try {
            const hasVideo = this.cache.video && this.cache.video.exists && this.cache.video.exists('wrong-video');
            console.log('视频缓存检查:', hasVideo);
            
            // 创建存储视频加载状态的全局变量
            this.game.global.videoLoaded = {
                // 检查视频是否已加载
                'wrong-video': hasVideo
            };
            
            // 如果视频加载失败，不阻止游戏继续
            if (!hasVideo) {
                console.warn('错误视频加载失败，游戏将继续但某些功能可能受限');
            }
        } catch (e) {
            console.error('视频状态检查失败:', e);
            this.game.global.videoLoaded = {
                'wrong-video': false
            };
        }
        
        console.log('视频加载状态：', this.game.global.videoLoaded);
        console.log('音频加载状态：', this.audioLoaded);
        
        // 添加安全的音频播放方法
        this.game.global.playSound = (key) => {
            try {
                // 对于click和success，不执行任何操作
                if (key === 'click' || key === 'success') {
                    return;
                }
                
                if (this.game.global.sounds && this.game.global.sounds[key]) {
                    this.game.global.sounds[key].play();
                }
            } catch (e) {
                console.error(`播放音频 ${key} 失败：`, e);
            }
        };
        
        // 进入主菜单
        this.scene.start('MainMenu');
    }
} 