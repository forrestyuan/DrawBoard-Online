import "./styles/index.css";
import "mdui/dist/css/mdui.min.css";
import mdui from "mdui";
import T from "./utils/index";
import DrawBoard, { IDrawboradConf } from "./module/drawboard/drawBoard.js";
import { userStore } from "./store/user";
import { ChatBoots } from "./module/chat";
import { SnackBar } from "./components/snackbar";

export interface ISyncConf extends IDrawboradConf {
  travel: number;
  clearCanvas: boolean;
}
export interface ISyncDrawConfProps {
  username: string;
  config: ISyncConf;
}
window.onload = () => {
  //画布对象和上下文
  let canvas = T.getEle("#canvas")! as HTMLCanvasElement;
  let ctx = canvas.getContext("2d")!;
  //协作设置
  let msgInput = T.getEle(".msgTxt")! as HTMLTextAreaElement;
  /*
   * 这里定义视屏截图
   */
  let video = document.getElementById("VIDEO")! as HTMLVideoElement;
  let inst_RTC = new mdui.Dialog("#example-5", {
    modal: true,
    closeOnEsc: false,
    closeOnCancel: true,
    closeOnConfirm: true,
    destroyOnClosed: true,
  });
  let isVideoOn = false;

  //实例化聊天对象
  let chat = ChatBoots(userStore, ctx);

  //实例化画板
  const db = new DrawBoard(
    {
      canvas,
      ctx,
      penceilColor: "#ffffff",
      penceilWeight: 10,
      canvasColor: "#5e8780",
      winW: T.getTargetWH()[0],
      winH: T.getTargetWH()[1],
    },
    chat.getSocket()
  );

  //配置重置
  chat.getSocket().on("resetConfig", (data: string) => {
    try {
      const res: ISyncDrawConfProps = JSON.parse(data);
      console.log(res);
      if (res.username != userStore.username) {
        res.config.travel != 0 ? db.travel(res.config.travel) : false;
        res.config.clearCanvas ? db.clearCanvas() : false;
        res.config.penceilWeight
          ? db.updateCtxStyle({ penceilWeight: res.config.penceilWeight })
          : false;
        res.config.penceilColor
          ? db.updateCtxStyle({ penceilColor: res.config.penceilColor })
          : false;
        res.config.canvasColor
          ? db.updateCtxStyle({ canvasColor: res.config.canvasColor })
          : false;
      }
    } catch (error) {
      console.log(error);
    }
  });
  chat.getSocket().on("setScreenshot", (res: any) => {
    try {
      console.log(res);
      let data = res.shot.buffer.split(",");
      let imageData = new ImageData(
        new Uint8ClampedArray(data),
        res.shot.width,
        res.shot.height
      );

      ctx.putImageData(imageData, 0, 0);
    } catch (error) {
      console.log(error);
    }
  });
  //封装发送配置信息

  //相关事件监听//需要同步事件
  T.getEle("#backward").onclick = () => {
    db.travel(-1);
    chat.sendData(
      "syncConfig",
      JSON.stringify({ username: userStore.username, config: { travel: -1 } })
    );
  };
  T.getEle("#forward").onclick = () => {
    db.travel(1);
    chat.sendData(
      "syncConfig",
      JSON.stringify({ username: userStore.username, config: { travel: 1 } })
    );
  };

  T.getEle("#clearAll").onclick = () => {
    db.clearCanvas();
    chat.sendData(
      "syncConfig",
      JSON.stringify({
        username: userStore.username,
        config: { clearCanvas: true },
      })
    );
  };
  T.getEle("#penceilWeight").onchange = (event: Event) => {
    event = event ?? window.event;
    let target = event.target as HTMLInputElement;
    let value = +target?.value ?? 1;
    value = value > 120 ? 120 : value;
    value = value < 1 ? 1 : value;
    db.updateCtxStyle({ penceilWeight: value });
    chat.sendData(
      "syncConfig",
      JSON.stringify({
        username: userStore.username,
        config: { penceilWeight: value },
      })
    );
  };
  T.getEle("#penceilColor").onchange = (event: Event) => {
    event = event ?? window.event;
    let target = event.target as HTMLInputElement;

    db.updateCtxStyle({ penceilColor: target.value });
    chat.sendData(
      "syncConfig",
      JSON.stringify({
        username: userStore.username,
        config: { penceilColor: target.value },
      })
    );
  };
  T.getEle("#canvasColor").onchange = (event: Event) => {
    event = event ?? window.event;
    let target = event.target as HTMLInputElement;

    db.updateCtxStyle({ canvasColor: target.value });
    chat.sendData(
      "syncConfig",
      JSON.stringify({
        username: userStore.username,
        config: { canvasColor: target.value },
      })
    );
  };
  let scaleNum = T.getEle("#scaleNum")! as HTMLInputElement;
  T.getEle("#larger").onclick = () => {
    db.scaleHandler(scaleNum, true);
  };
  T.getEle("#smaller").onclick = () => {
    db.scaleHandler(scaleNum, false);
  };

  T.getEle("#tool-rtc").onclick = () => {
    if (isVideoOn) {
      return;
    }
    isVideoOn = true;
    const constraints = {
      audio: true,
      video: true,
    };
    T.getEle("#stopVideo").onclick = null;
    T.getEle("#pauseVideo").onclick = null;
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        inst_RTC.open();
        /* 使用这个stream stream */
        video.srcObject = stream;
        video.onloadedmetadata = () => video.play();
        T.getEle("#pauseVideo").onclick = () => {
          let data = T.computeFrame(ctx, canvas, video);
          console.log(data.data.buffer);
          let buffer = "";
          buffer += data.data[0];
          data.data.forEach((b, idx) => {
            if (idx >= 1) buffer += "," + b;
          });
          chat.sendData("screenshot", {
            username: userStore.username,
            shot: { width: data.width, height: data.height, buffer },
          });
        };
        T.getEle("#stopVideo").onclick = () => {
          isVideoOn = false;
          stream.getTracks().forEach(function (track) {
            track.stop();
          });
        };
      })
      .catch(function (err) {
        /* 处理error */
        console.log(err);
      });
  };

  T.getEle("#selectChatImgTrigger").onclick = () => {
    T.getEle("#chatImgSelect").click();
  };
  T.getEle("#chatImgSelect").onchange = (event: Event) => {
    event = event ?? window.event;
    let target = event.target as HTMLInputElement;
    T.getEle("#selectChatImgTrigger").style.cssText = "border:solid 1px red;";
    let img = document.createElement("img");
    img.src = target.files ? URL.createObjectURL(target.files[0]) : "";
    if (img.src === "") {
      SnackBar("发送图片失败");
      return;
    }
    img.onload = () => {
      var imgBase64 = T.genImgBase64(img);
      chat.sendData(
        "chatData",
        JSON.stringify({
          username: userStore.username,
          msg: imgBase64,
        }),
        () => {
          target.files = null;
        }
      );
    };
  };

  //发送聊天消息
  T.getEle(".sendBtn").onclick = function () {
    if (msgInput.value.replace(/ /gim, "") == "") {
      SnackBar("不要发送空消息");
      return;
    }
    chat.sendData(
      "chatData",
      JSON.stringify({
        username: userStore.username,
        msg: msgInput.value,
      }),
      (res) => {
        if (res) {
          msgInput.value = "";
          msgInput.focus();
        } else {
          SnackBar("发送消息中断");
        }
      }
    );
  };
  //添加用户
  let initUserData = () => {
    chat.sendData("addUser", userStore.username);
    sessionStorage.setItem("drawusername", userStore.username);
    T.getEle(".userNameTag")!.innerHTML = userStore.username;
  };

  mdui.prompt(
    "输入用户名，不输入则随机命名",
    (value) => {
      userStore.username = value || userStore.username;
      initUserData();
    },
    () => {
      initUserData();
    },
    {
      cancelText: "随机吧",
      confirmText: "填好了",
      modal: true,
      closeOnEsc: false,
      history: false,
    }
  );

  //弹出聊天界面事件绑定
  var tab = new mdui.Tab("#example4-tab");
  T.getEle("#example-4")!.addEventListener("open.mdui.dialog", () => {
    tab.handleUpdate();
  });
};
