# 520 特别礼物 - 我们的回忆之旅

这是一个基于Phaser.js和Spring Boot开发的网页解密小游戏，作为520的特别礼物。游戏中包含了我们美好的回忆，通过解谜的方式来回顾我们在一起的点点滴滴。

## 技术栈

- 前端：Phaser 3 (HTML5游戏框架)
- 后端：Spring Boot 2.7
- 数据库：H2 (内存数据库)

## 项目结构

```
src/
├── main/
│   ├── java/
│   │   └── com/example/demo/
│   │       ├── DemoApplication.java       # Spring Boot主类
│   │       ├── ProgressController.java    # 进度保存API
│   │       ├── model/
│   │       │   └── Progress.java          # 进度实体类
│   │       └── repository/
│   │           └── ProgressRepository.java # 进度仓库
│   └── resources/
│       ├── static/                        # Phaser前端代码
│       │   ├── index.html                 # 游戏首页
│       │   ├── css/                       # 样式文件
│       │   │   └── style.css              
│       │   ├── js/                        # JavaScript文件
│       │   │   ├── phaser.min.js          # Phaser库文件
│       │   │   ├── game.js                # 游戏主逻辑
│       │   │   └── scenes/                # 游戏场景
│       │   │       ├── Boot.js            # 启动场景
│       │   │       ├── Preloader.js       # 资源加载场景
│       │   │       ├── MainMenu.js        # 主菜单场景
│       │   │       ├── StoryScene.js      # 故事场景
│       │   │       ├── PuzzleScene1.js    # 谜题1场景
│       │   │       ├── PuzzleScene2.js    # 谜题2场景
│       │   │       ├── PuzzleScene3.js    # 谜题3场景
│       │   │       └── FinalScene.js      # 最终场景
│       │   └── assets/                    # 图片、音频等资源
│       └── application.properties         # 配置文件
```

## 游戏功能

1. **主菜单**: 游戏入口，提供开始游戏和继续游戏选项
2. **故事场景**: 展示你们的故事背景
3. **谜题场景**: 三个与你们回忆相关的解密谜题
4. **最终场景**: 解开所有谜题后的惊喜告白场景
5. **进度保存**: 自动保存游戏进度，可以断点继续

## 运行方法

### 本地开发环境

1. 确保已安装Java 8或更高版本和Maven
2. 克隆项目到本地
3. 在项目根目录运行:

```bash
mvn spring-boot:run
```

4. 浏览器访问: http://localhost:8080

### 服务器部署

1. 打包项目:

```bash
mvn clean package
```

2. 将生成的JAR文件(`target/520project-0.0.1-SNAPSHOT.jar`)上传到服务器
3. 在服务器上运行:

```bash
java -jar 520project-0.0.1-SNAPSHOT.jar
```

4. 如需在后台运行，可使用:

```bash
nohup java -jar 520project-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
```

## 自定义游戏内容

### 修改谜题答案

编辑对应的谜题场景文件，修改constructor中的answer属性:

```javascript
// src/main/resources/static/js/scenes/PuzzleScene1.js
this.answer = "520"; // 修改为你们的特殊数字

// src/main/resources/static/js/scenes/PuzzleScene2.js
this.answer = "公园"; // 修改为你们的特殊地点

// src/main/resources/static/js/scenes/PuzzleScene3.js
this.answer = "巧克力"; // 修改为她最喜欢的礼物
```

### 修改故事内容

编辑故事场景文件中的storyTexts数组:

```javascript
// src/main/resources/static/js/scenes/StoryScene.js
this.storyTexts = [
    "这里写你们的故事...",
    "更多内容...",
    // ...
];
```

### 修改最终告白

编辑最终场景文件中的loveMessage文本:

```javascript
// src/main/resources/static/js/scenes/FinalScene.js
const loveMessage = this.add.text(width / 2, height / 2, '在这里写你的告白语...', {...});
```

### 更换资源

替换`src/main/resources/static/assets/`目录下的图片和音频文件，确保文件名与代码中引用的名称一致。

## 注意事项

- 在部署前请确保所有资源文件都已正确放置
- 默认使用H2内存数据库，如需持久化可修改配置
- 确保服务器开放了8080端口访问
- 针对移动设备访问，建议在服务器配置域名并使用HTTPS

## 祝福

希望这个小游戏能给你们的特殊日子带来美好的回忆！

祝520快乐！❤️ 