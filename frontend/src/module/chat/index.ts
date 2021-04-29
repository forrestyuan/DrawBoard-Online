// import mdui from "mdui";
import { SnackBar } from "../../components/snackbar";
import Chat from "./chat";
import T from "../../utils/index";
import { UserStore } from "../../store/user";
import Video from "../videochat/video";

/**
 * @description 聊天bootstrap
 * @param UserStore 用户store
 * @param ctx 画板上下文
 */
export const ChatBoots = (ctx: CanvasRenderingContext2D) => {
  //协作设置
  let msgBox = T.getEle(".msgBox")!;
  //实例化聊天对象
  return new Chat({
    receive: [
      {
        socketName: "getChatData",
        callback: (res) => {
          if (res) {
            try {
              res = JSON.parse(res);
              if (/data:image/.test(res.msg)) {
                msgBox.innerHTML += Chat.TPL(
                  UserStore.isMyself(res.username)
                ).genChatImgTpl(res.username, res.msg);
              } else {
                msgBox.innerHTML += Chat.TPL(
                  UserStore.isMyself(res.username)
                ).genChatTxtTpl(res.username, res.msg);
                if (!UserStore.isMyself(res.username)) {
                  SnackBar(`${res.username}发来消息: ${res.msg}`);
                }
              }
              msgBox.scrollTop = msgBox.offsetHeight;
            } catch (e) {
              SnackBar("数据格式有误");
            }
          }
        },
      },
      {
        socketName: "videoData",
        callback: (res: any) => {
          console.log(res);
          let data = res.shot.buffer;
          let username = res.username;
          let node = T.getEle(`#${username}`)! as HTMLVideoElement;
          console.log(data);
          let videoChuncks: BlobPart[] = [];
          videoChuncks.push(data);
          const blob = new Blob(videoChuncks, {
            type: "video/mp4; codecs=opus",
          });
          const videoURL = window.URL.createObjectURL(blob);
          node.src = videoURL;
          node.play();
          // node.srcObject = data;
          // node.onloadedmetadata = () => node.play();
        },
      },
      {
        socketName: "userDisconnect",
        callback: (username: string) => {
          Video.removeVideoTpl(username);
        },
      },
      {
        socketName: "updateUserList",
        callback: (res) => {
          try {
            res = JSON.parse(res);
            T.getEle(".wrapUserList")!.innerHTML = "";
            res.forEach((item: any) => {
              T.getEle(".wrapUserList")!.innerHTML += Chat.TPL(
                UserStore.isMyself(item.data)
              ).genUserTag(item.data);
              if (!UserStore.isMyself(item.data)) {
                Video.addVideoTpl(item.data);
              }
            });
          } catch (error) {
            SnackBar("数据格式有误");
          }
        },
      },
      {
        socketName: "resetBeginPath",
        callback: (res) => {
          try {
            res = JSON.parse(res);
            if (res.status && res.username != UserStore.username) {
              ctx.beginPath();
            }
          } catch (error) {
            console.log(error);
          }
        },
      },
    ],
  });
};
