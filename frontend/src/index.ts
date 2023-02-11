import "./styles/index.css";
import "mdui/dist/css/mdui.min.css";
import { Tab, prompt } from "mdui";
import T from "@/utils/index";
import DrawBoard, { IDrawboradConf } from "@/module/drawboard/drawBoard";
import { UserStore } from "@/store/user";
import { ChatBoots } from "@/module/chat";
import { SnackBar } from "@/components/snackbar";
import { videoShot } from "@/module/videoshot";
import videoChat from "./module/videochat";
import Video from "./module/videochat/video";

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

  //实例化聊天对象
  let chat = ChatBoots(ctx);
  //视屏截图
  videoShot(chat, ctx, canvas);
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
  //视频会议
  videoChat(chat);
  //配置重置
  chat.getSocket().on("resetConfig", (data: string) => {
    try {
      const res: ISyncDrawConfProps = JSON.parse(data);
      console.log(res);
      if (res.username != UserStore.username) {
        if (!!res.config.travel) {
          db.travel(res.config.travel);
        }
        res.config.clearCanvas ? db.clearCanvas() : false;
        db.updateCtxStyle(res.config);
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
      JSON.stringify({ username: UserStore.username, config: { travel: -1 } })
    );
  };
  T.getEle("#forward").onclick = () => {
    db.travel(1);
    chat.sendData(
      "syncConfig",
      JSON.stringify({ username: UserStore.username, config: { travel: 1 } })
    );
  };

  T.getEle("#clearAll").onclick = () => {
    db.clearCanvas();
    chat.sendData(
      "syncConfig",
      JSON.stringify({
        username: UserStore.username,
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
        username: UserStore.username,
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
        username: UserStore.username,
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
        username: UserStore.username,
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
          username: UserStore.username,
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
        username: UserStore.username,
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
    chat.sendData("addUser", UserStore.username, (res) => {
      console.log(res);
    });
    sessionStorage.setItem("drawusername", UserStore.username);
    T.getEle(".userNameTag")!.innerHTML = UserStore.username;
  };

  prompt(
    "输入用户名，不输入则随机命名",
    (value) => {
      UserStore.username = value || UserStore.username;
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
  var tab = new Tab("#example4-tab");
  T.getEle("#example-4")!.addEventListener("open.mdui.dialog", () => {
    tab.handleUpdate();
  });
};
