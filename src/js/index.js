require("../css/index.css");
require("mdui/dist/css/mdui.min.css");
const mdui = require("mdui/dist/js/mdui.min.js");
import T from "../utils/index.js";
import Chat from "./chat.js";
import DrawBoard from "./drawBoard.js";

const userInfo = {};
window.onload = function () {
  //其它事件
  let showPanel = false;
  //画布对象和上下文
  let canvas = T.getEle("#canvas");
  let ctx = canvas.getContext("2d");
  userInfo.username = `游客${new Date().getTime()}`;
  //协作设置
  let msgBox = T.getEle(".msgBox");
  let msgInput = T.getEle(".msgTxt");

  //实例化聊天对象
  let chat = new Chat({
    receive: [
      {
        socketName: "getChatData",
        callback: (res) => {
          if (res) {
            try {
              res = JSON.parse(res);
              if (/data:image/.test(res.msg)) {
                msgBox.innerHTML += Chat.TPL().genChatImgTpl(
                  res.username,
                  res.msg
                );
              } else {
                msgBox.innerHTML += Chat.TPL().genChatTxtTpl(
                  res.username,
                  res.msg
                );
              }
            } catch (e) {
              mdui.snackbar({
                message: "数据格式有误",
                position: "top",
              });
            }
          }
        },
      },
      {
        socketName: "updateUserList",
        callback: (res) => {
          try {
            res = JSON.parse(res);
            T.getEle(".wrapUserList").innerHTML = "";
            res.forEach((item) => {
              T.getEle(".wrapUserList").innerHTML += `
							<div class="mdui-chip">
								<span class="mdui-chip-icon ${
                  item.data == userInfo.username
                    ? "mdui-color-yellow"
                    : "mdui-color-black"
                }">${item.data.substring(0, 1)}</span>
								<span class="mdui-chip-title mdui-text-truncate" style="max-width: 95px;">${
                  item.data
                }</span>
							</div>
							`;
            });
          } catch (error) {
            mdui.snackbar({
              message: "数据格式有误",
              position: "top",
            });
          }
        },
      },
      {
        socketName: "resetBeginPath",
        callback: (res) => {
          try {
            res = JSON.parse(res);
            if (res.status && res.username != userInfo.username) {
              ctx.beginPath();
            }
          } catch (error) {
            console.log(error);
          }
        },
      },
    ],
  });
  //实例化画板
  const db = new DrawBoard(
    {
      canvas,
      ctx,
      penceilWeight,
      winW: T.getTargetWH()[0],
      winH: T.getTargetWH()[1],
    },
    chat.getSocket()
  );
  //配置重置
  chat.getSocket().on("resetConfig", (res) => {
    try {
      res = JSON.parse(res);
      console.log(res);
      if (res.username != userInfo.username) {
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
  //封装发送配置信息

  //相关事件监听//需要同步事件
  T.getEle("#backward").onclick = () => {
    db.travel(-1);
    chat.sendData(
      "syncConfig",
      JSON.stringify({ username: userInfo.username, config: { travel: -1 } })
    );
  };
  T.getEle("#forward").onclick = () => {
    db.travel(1);
    chat.sendData(
      "syncConfig",
      JSON.stringify({ username: userInfo.username, config: { travel: 1 } })
    );
  };

  T.getEle("#clearAll").onclick = () => {
    db.clearCanvas();
    chat.sendData(
      "syncConfig",
      JSON.stringify({
        username: userInfo.username,
        config: { clearCanvas: true },
      })
    );
  };
  T.getEle("#penceilWeight").onchange = function () {
    this.value = this.value > 120 ? 120 : this.value;
    this.value = this.value < 1 ? 1 : this.value;
    db.updateCtxStyle({ penceilWeight: this.value });
    chat.sendData(
      "syncConfig",
      JSON.stringify({
        username: userInfo.username,
        config: { penceilWeight: this.value },
      })
    );
  };
  T.getEle("#penceilColor").onchange = function () {
    db.updateCtxStyle({ penceilColor: this.value });
    chat.sendData(
      "syncConfig",
      JSON.stringify({
        username: userInfo.username,
        config: { penceilColor: this.value },
      })
    );
  };
  T.getEle("#canvasColor").onchange = function () {
    db.updateCtxStyle({ canvasColor: this.value });
    chat.sendData(
      "syncConfig",
      JSON.stringify({
        username: userInfo.username,
        config: { canvasColor: this.value },
      })
    );
  };
  let scaleNum = T.getEle("#scaleNum");
  T.getEle("#larger").onclick = () => {
    db.scaleHandler(scaleNum, true);
  };
  T.getEle("#smaller").onclick = () => {
    db.scaleHandler(scaleNum, false);
  };
  T.getEle("#selectChatImgTrigger").onclick = () => {
    T.getEle("#chatImgSelect").click();
  };
  T.getEle("#chatImgSelect").onchange = function () {
    let that = this;
    T.getEle("#selectChatImgTrigger").style.cssText = "border:solid 1px red;";
    let img = document.createElement("img");
    img.src = URL.createObjectURL(this.files[0]);
    img.onload = () => {
      var imgBase64 = T.genImgBase64(img);
      chat.sendData(
        "chatData",
        JSON.stringify({
          username: userInfo.username,
          msg: imgBase64,
        }),
        (res) => {
          if (res) {
            that.files = null;
          }
        }
      );
    };
  };

  //发送聊天消息
  T.getEle(".sendBtn").onclick = function () {
    if (msgInput.value.replace(/ /gim, "") == "") {
      mdui.snackbar({
        message: "不要发送空消息",
        position: "top",
      });
      return;
    }
    chat.sendData(
      "chatData",
      JSON.stringify({
        username: userInfo.username,
        msg: msgInput.value,
      }),
      (res) => {
        if (res) {
          msgInput.value = "";
        } else {
          alert("发送消息中断");
        }
      }
    );
  };
  //添加用户
  let initUserData = (value) => {
    mdui.snackbar("欢迎" + value, {
      buttonColor: "lightpink",
      position: "top",
    });
    chat.sendData("addUser", userInfo.username);
    sessionStorage.setItem("drawusername", userInfo.username);
    T.getEle(".userNameTag").innerHTML = userInfo.username;
  };
  mdui.prompt(
    "输入用户名，不输入则随机命名",
    function (value) {
      userInfo.username = value || userInfo.username;
      initUserData(userInfo.username);
    },
    function (value) {
      initUserData(userInfo.username);
    },
    {
      cancelText: "随机吧",
      confirmText: "填好了",
      modal: false,
      closeOnEsc: false,
      confirmOnEnter: true,
      history: false,
    }
  );

  //弹出聊天界面事件绑定
  var tab = new mdui.Tab("#example4-tab");
  document
    .getElementById("example-4")
    .addEventListener("open.mdui.dialog", function () {
      tab.handleUpdate();
    });
};
