# DrawBoard-Online

draw together with yout coworker, enjoy the creating time
### [使用React 重构中]
## updated May 6 
> 优化界面效果
> 新增聊天发送图片

## 1、基于socket io 和 canvas  实现的共享画板

> 起初只是想要写个简单的画板,后面不知不觉的想起石墨文档有一个白板功能，就想将当前这个画布功能，开发成一个简易版的协作画板。
> 期待你们的PR🎉
> <hr>
> 在线演示：努力部署中，目前需要clone到本地运行。

## 2、运行

```bash
git clone <repository>

npm install

#>>>对于开发阶段：
#前端服务启动（利用webpack dev server）：
npm run dev

#后台服务启动(使用了nodemon 实时监听后端文件修改重启服务)
npm run start

#>>>对于生产阶段：
#打包前端文件,然后启动服务器即可
1、 npm run build
2、 npm run start
```

## 3、功能：

#### 开发完成:

- 画布缩放(✔)
- 画布颜色(✔)
- 画笔颜色(✔)
- 画笔粗细(✔)
- 历史记录（撤销，恢复）(✔)
- 聊天室(✔)
- 聊天发送图片（✔）
- 绘制协作(类似于石墨文档协作)（✔）
- UI 界面美化（✔）
  - 使用UI库（material Design）
- 聊天消息通知条右上角提示用户（✔）
- 基于WebRTC照相得到照片，在此基础上进行绘制 ~🔥（✔）


#### 待开发的功能：

- 文字控件（待开发）
- 上传图片，基于图片绘图（待开发）
- 绘图带基本形状可拖拽调控大小 （待开发）
- 聊天功能丰富（待开发）
  - 支持聊天表情
  - webRTC 视频聊天
  - 类似QQ抖动窗口提醒
- 其它未知功能（🤔）


## 4、最原始效果图

![效果图1](http://photo.forrestyuan.cn/draw1.gif)  

![效果图2](http://photo.forrestyuan.cn/draw2.gif)

## 5、使用MDUI后效果

![效果图3](http://photo.forrestyuan.cn/upgrade1.PNG)  
![效果图4](http://photo.forrestyuan.cn/upgrade2.PNG)

## 6、 新增聊天发送图片
![效果图5](http://photo.forrestyuan.cn/updateDemo.png)
## 7、 基于WebRTC照相得到照片，在此基础上进行绘制
![效果图6](http://photo.forrestyuan.cn/DB_RTC2.png)  
![效果图7](http://photo.forrestyuan.cn/DB_RTC1.png)

# License

MIT
