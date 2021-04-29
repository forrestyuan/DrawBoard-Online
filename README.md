## DrawBoard-Online

Draw together with your coworker, enjoy the creating time!😊  
绘你所想，画你所爱！

起初只是想要写个简单的画板,后面不知不觉的想起石墨文档有一个白板功能，就想将当前这个画布功能，开发成一个简易版的协作画板。

直到目前已经更新了几个版本，从最初简陋的只能画画，到后面的聊天，再到后面调用摄像头获取画面等等一系列的功能补充，都是在工作之余挤牙膏般的挤时间来完善。

之前这个应用都是用传统的开发方式开发的，后续将用 vue 或 react 重构整个应用，目前还有很多功能没有完善。`期待你们的 pull request`一起完善这个应用的功能 🤣

这里不做具体的实现细节，具体的可以`fork`源码，相信机智的你一定可以秒懂，喜欢别忘了给个 🌟`star`一下哦，这是我持续更新的动力 😁。

**最新更新状态 🚩：**

> `🔥注意！！！已更新`:
>
> 1. 修改目录结构。
> 2. 使用 typescript 重构（完成大约～ 75%）
> 3. 🔥🔥 **`新增视屏会议`** 🔥🔥（safari,IE 不支持，用到最新特性，在 chrome 下体验）

### 1、共享协作画板仓库

前端界面用 webpack 进行了打包，后台服务使用了 express，协作方面采用 socket.io 来承载聊天内容以及绘画数据的沟通能力、数据的协同传输。

> _在线演示_：努力部署中，目前需要 clone 到本地运行。  
>  `fork`代码到自己的仓库，补充完善代码不如`pull request`一下  
> 🏭 仓库地址：[https://github.com/forrestyuan/DrawBoard-Online](https://github.com/forrestyuan/DrawBoard-Online)  
> 💬 仓库讨论区：[https://github.com/forrestyuan/DrawBoard-Online/discussions](https://github.com/forrestyuan/DrawBoard-Online/discussions)

### 2、如何在本地运行

想要体验这个应用，你可以按照下面的步骤启动应用哦！！！  
💻 开发模式：1-2-3 步骤  
💻 预览模式：1-2-4 步骤

1. 下载仓库

```bash
git clone <repository>
```

2. 安装依赖

```bash
cd frontend
npm install

cd server
npm install
```

`注意！ 如果你是查看的同时也是需要修改代码，接下来请执行下面 -第3步骤- 即可， 如果只是查看但是不需要修改代码，请执行 -第4步骤- 即可`

3. 对于开发阶段（请走这个步骤）

```bash
#前端服务启动（利用webpack dev server）：
cd frontend
npm run dev

#后台服务启动(使用了nodemon 实时监听后端文件修改重启服务)
cd server
npm run start

#启动后在浏览器输入url： http://127.0.0.1:8082
```

4.  对于生产阶段（请走这个步骤）

```bash
#打包前端文件,然后启动服务器即可
cd frontend
npm run build

cd server
npm run start

#启动后在浏览器输入url： http://127.0.0.1:3001
```

### 3、共享协作画板目前具有的功能

1. 开发完成:

- 画布缩放(✔)
- 画布颜色(✔)
- 画笔颜色(✔)
- 画笔粗细(✔)
- 历史记录（撤销，恢复）(✔)
- 聊天室(✔)
- 聊天发送图片（✔）
- 绘制协作(类似于石墨文档协作)（✔）
- UI 界面美化（✔）
  - 使用 UI 库（material Design）
- 聊天消息通知条右上角提示用户（✔）
- 基于 WebRTC 照相得到照片，在此基础上进行绘制 ~🔥（✔）
- webRTC 视频会议～ 🔥🔥（✔）

2. 待开发的功能：

- 文字控件（待开发）
- 上传图片，基于图片绘图（待开发）
- 绘图带基本形状可拖拽调控大小 （待开发）
- 聊天功能丰富（待开发）
  - 支持聊天表情
  - 类似 QQ 抖动窗口提醒
- 其它未知功能（🤔）

#### 3-1、最原始效果图（是不是惨不忍睹 😝，下面有最新的效果图哦）

![效果图1](http://photo.forrestyuan.cn/draw1.gif)

![效果图2](http://photo.forrestyuan.cn/draw2.gif)

#### 3-2、使用 MDUI 后效果

![主页面](https://ftp.bmp.ovh/imgs/2021/04/66ef3d125a2f1359.png)

![聊天界面](https://ftp.bmp.ovh/imgs/2021/04/142f399de96c884b.png)

#### 3-3、 基于 WebRTC 照相得到照片，在此基础上进行绘制

![效果图6](http://photo.forrestyuan.cn/DB_RTC2.png)

#### 3-4、 视频会议

![](https://ftp.bmp.ovh/imgs/2021/04/49ca2a0b7a86d982.png)

### License

MIT
