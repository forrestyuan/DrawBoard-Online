// const io = require("socket.io-client/dist/socket.io");
import io from "socket.io-client";
export interface IChatConstructRecieveProps {
  socketName: string;
  callback?: (arg: any) => any;
}
export interface IChatConstructProps {
  receive: null | Array<IChatConstructRecieveProps>;
}
export interface IScreenShotProps {
  username: string;
  shot: any;
}
export type SendRecieveCallBack = (arg: any) => void;

class Chat {
  constructor(obj: IChatConstructProps) {
    if (!obj.receive) {
      console.error(`缺失绑定的参数值：send 和 receive，请检查参数!!!`);
      return;
    }

    //监听接收数据
    for (let i = 0; i < obj.receive.length; i++) {
      this.receiveData(obj.receive[i].socketName, obj.receive[i].callback);
    }
  }
  socket = io();
  //发送消息
  sendData(
    socketName: string,
    data: string | IScreenShotProps,
    cb?: SendRecieveCallBack
  ) {
    this.socket.emit(socketName, data, (res?: string) => {
      if (typeof cb === "function") {
        cb(res);
      }
    });
  }
  //接受消息
  receiveData(socketName: string, cb?: SendRecieveCallBack) {
    this.socket.on(socketName, (res?: string) => {
      if (typeof cb === "function") {
        cb(res);
      }
    });
  }
  //返回实力化socket
  getSocket() {
    return this.socket;
  }

  static TPL(isMyself: boolean = false) {
    return {
      genChatTxtTpl: (name = "unkonw", content = "unkonw") => {
        return `
          <div class="chat-msg-warpper ${
            isMyself ? "chat-msg-myself" : "chat-msg-friend"
          }" style="line-height:1.5em;">
            <div class="mdui-chip">
              ${isMyself ? `<span class="mdui-chip-title">${name}</span>` : ""}
              <span class="mdui-chip-icon mdui-color-blue"><i class="mdui-icon material-icons">face</i></span>
              
              ${!isMyself ? `<span class="mdui-chip-title">${name}</span>` : ""}
            </div>
            <div class="chat-content-box">
              <div class="txt-user-text">
                <pre>${content}</pre>
              </div>
            </div>
          </div>    `;
      },
      genChatImgTpl: (name = "unknow", content = "unkonw") => {
        let imgStyle =
          "max-height: 130px;vertical-align: top;min-width: 100px;";
        return `
          <div  class="chat-msg-warpper ${
            isMyself ? "chat-msg-myself" : "chat-msg-friend"
          }"  style="margin-top:15px">
          <div class="mdui-chip">
          ${isMyself ? `<span class="mdui-chip-title">${name}</span>` : ""}
          <span class="mdui-chip-icon mdui-color-blue"><i class="mdui-icon material-icons">face</i></span>
          ${!isMyself ? `<span class="mdui-chip-title">${name}</span>` : ""}
        </div>
        <div class="chat-content-box">
          <div class="txt-user-text">
          <img mdui-tooltip="{content: '未完善，当前请右键新标签打开查看大图', position: 'top'}" style="${imgStyle}" src="${content}" />
          </div>
        </div>
          </div>
        `;
      },
      genUserTag: (username: string) => {
        return `
            <div class="mdui-chip">
              <span class="mdui-chip-icon ${
                isMyself ? "mdui-color-yellow" : "mdui-color-black"
              }">
                ${isMyself ? "我" : username.substring(0, 2)}
              </span>
              <span class="mdui-chip-title mdui-text-truncate" style="max-width: 95px;">${username}</span>
            </div>
          `;
      },
    };
  }
}

export { Chat };
export default Chat;
