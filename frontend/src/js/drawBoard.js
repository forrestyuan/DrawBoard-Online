export default class DrawBoard {
  //构造器
  constructor(obj, socket) {
    //画布对象和上下文
    this.socket = socket;
    this.canvas = obj.canvas;
    this.ctx = obj.ctx;
    this.winW = obj.winW; //屏幕宽
    this.winH = obj.winH; //屏幕高
    this.canvasW = this.winW * 0.985; //画布高
    this.canvasH = this.winH * 0.77; //画布高
    this.canvas.width = this.canvasW;
    this.canvas.height = this.canvasH;
    this.canvasPadding = 5; //画布padding，用于界定边框线
    //画笔 画布相关数据
    this.ctx.lineWidth = obj.penceilWeight || 2;
    this.ctx.strokeStyle = obj.penceilColor || "#222";
    this.canvas.style.backgroundColor = obj.canvasColor || "none";
    //绘制堆栈
    this.drawHistoryStack = [];
    this.scaleList = [1, 1]; //第一个参数用于调整画布的绘制缩放布宽为0.1，第二个参数为缩放倍率dpr
    //时间旅行步数
    this.timeTravelStep = -1;
    //设置画布宽高
    this.updateParam();
    this.init();
    this.ctx.beginPath();
    this.socket.on("getDrawData", (data) => {
      data = JSON.parse(data);
      if (data.username != sessionStorage.getItem("drawusername")) {
        this.ctx.lineTo(data.axis[0], data.axis[1]);
        this.ctx.stroke();
      }
    });
  }

  //更新参数 画布边界值和画布横纵坐标
  updateParam() {
    //预设参数2
    this.drawLayerLeft = this.canvas.offsetLeft; //画布横坐标
    this.drawLayerTop = this.canvas.offsetTop; //画布纵坐标
    this.cansLimitLt = this.canvasPadding; //左边界
    this.cansLimitRt = this.canvasW - this.canvasPadding; //右边界
    this.cansLimitTp = this.canvasPadding; //上边界
    this.cansLimitBt = this.canvasH - this.canvasPadding; //下边界
  }
  //更新上下文样式参数
  updateCtxStyle(obj) {
    console.log(obj);
    this.ctx.lineWidth = obj.penceilWeight || this.ctx.lineWidth;
    this.ctx.strokeStyle = obj.penceilColor || this.ctx.strokeStyle;
    this.canvas.style.backgroundColor =
      obj.canvasColor || this.canvas.style.backgroundColor;
  }

  /**
   * @desc 返回鼠标在画布上的横纵坐标
   * @param Object event 事件对象(可选)
   * @return Array [x,y]
   */
  mouseXY(event) {
    event = event || window.event;
    let x =
      event.clientX + window.scrollX ||
      event.pageX + window.scrollX ||
      event.touches[0].clientX + window.scrollX ||
      event.touches[0].pageX + window.scrollX;
    let y =
      event.clientY + window.scrollY ||
      event.pageY + window.scrollY ||
      event.touches[0].clientY + window.scrollY ||
      event.touches[0].pageY + window.scrollY;

    return [
      (x - this.drawLayerLeft) / this.scaleList[1],
      (y - this.drawLayerTop) / this.scaleList[1],
    ];
  }

  //绘制堆栈进入操作
  pushStack() {
    if (this.drawHistoryStack.length > 19) {
      this.drawHistoryStack.shift();
      this.drawHistoryStack.push(this.canvas.toDataURL());
    } else {
      this.timeTravelStep++;
      this.drawHistoryStack.push(this.canvas.toDataURL());
    }
  }

  /**
   * @desc 同步数据方法(通过socket.io传送数据)
   * @param Array axis 坐标数组
   */
  syncData(axis) {
    let data = JSON.stringify({
      username: sessionStorage.getItem("drawusername"),
      axis,
    });
    this.socket.emit("sendDrawData", data);
  }
  /**
   * @desc 绘制事件绑定监听
   * @param Boolean isunbind 解除所有是与绘制相关的绑定事件
   */
  drawEvent(isUnbind) {
    let eventStart = void 0,
      eventEnd = void 0,
      eventMove = void 0;
    if ("ontouchstart" in window) {
      eventStart = "ontouchstart";
      eventEnd = "ontouchend";
      eventMove = "ontouchmove";
    } else {
      eventStart = "onmousedown";
      eventEnd = "onmouseup";
      eventMove = "onmousemove";
    }
    if (isUnbind) {
      this.canvas[eventStart] = null;
      this.canvas[eventMove] = null;
      this.canvas[eventEnd] = null;
      return void 0;
    }
    //监听开始触摸（点击）屏幕事件
    this.canvas[eventStart] = (e) => {
      this.ctx.beginPath();
      //监听开始滑动绘制事件
      this.canvas[eventMove] = (e) => {
        let mouseAxis = this.mouseXY(e);
        if (
          mouseAxis[0] < this.cansLimitLt ||
          mouseAxis[0] > this.cansLimitRt ||
          mouseAxis[1] < this.cansLimitTp ||
          mouseAxis[1] > this.cansLimitBt
        ) {
          this.canvas[eventMove] = null;
        } else {
          this.ctx.lineTo(mouseAxis[0], mouseAxis[1]);
          this.syncData(mouseAxis);
        }
        this.ctx.stroke();
      };
    };
    //监听触摸（点击）屏幕事件结束，置空滑动事件和将当前画布信息进栈
    this.canvas[eventEnd] = (e) => {
      this.canvas[eventMove] = null;
      this.socket.emit(
        "canSetBeginPath",
        JSON.stringify({ username: sessionStorage.getItem("drawusername") })
      );
      this.pushStack();
    };
  }
  //画布历史穿梭（前进和后退）
  travel(dir) {
    if (this.drawHistoryStack.length > 0) {
      if (dir < 0) {
        if (--this.timeTravelStep < -1) {
          this.timeTravelStep = -1;
          return;
        }
      } else if (dir > 0) {
        if (++this.timeTravelStep >= this.drawHistoryStack.length) {
          this.timeTravelStep = this.drawHistoryStack.length - 1;
          return;
        }
      }
      let cmDrawImg = (cb) => {
        let img = new Image();
        img.src = this.drawHistoryStack[this.timeTravelStep];
        img.onload = () => this.ctx.drawImage(img, 0, 0);
      };
      this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
      cmDrawImg();
    }
  }
  //缩放画布
  scaleHandler(dprBox, isLarge) {
    if (isLarge) {
      dprBox.value = (+dprBox.value + 0.1).toFixed(1);
      this.scaleList[1] = +dprBox.value;
      if (this.scaleList[1] > 5) {
        this.scaleList[1] = 5;
        dprBox.value = 5;
        return;
      }
    } else {
      dprBox.value = (+dprBox.value - 0.1).toFixed(1);
      this.scaleList[1] = +dprBox.value;
      if (this.scaleList[1] < 0.1) {
        this.scaleList[1] = 0.1;
        dprBox.value = 0.1;
        return;
      }
    }
    this.canvas.style.width = this.canvasW * this.scaleList[1] + "px";
    this.canvas.style.height = this.canvasH * this.scaleList[1] + "px";
    this.updateParam();
  }
  //清除画布
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
    this.timeTravelStep = -1;
    this.drawHistoryStack = [];
  }

  //初始化
  init() {
    this.drawEvent();
    window.onresize = () => {
      this.drawEvent(true);
      this.updateParam();
      this.drawEvent();
      this.travel(0);
    };
  }
}
