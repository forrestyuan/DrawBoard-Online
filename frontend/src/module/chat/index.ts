// import mdui from "mdui";
import { SnackBar } from "../../components/snackbar";
import Chat from "./chat";
import T from "../../utils/index";
import { UserStore } from "../../store/user";

/**
 * @description 聊天bootstrap
 * @param userStore 用户store
 * @param ctx 画板上下文
 */
export const ChatBoots = (
  userStore: UserStore,
  ctx: CanvasRenderingContext2D
) => {
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
                  userStore.isMyself(res.username)
                ).genChatImgTpl(res.username, res.msg);
              } else {
                msgBox.innerHTML += Chat.TPL(
                  userStore.isMyself(res.username)
                ).genChatTxtTpl(res.username, res.msg);
                if (!userStore.isMyself(res.username)) {
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
        socketName: "updateUserList",
        callback: (res) => {
          try {
            res = JSON.parse(res);
            T.getEle(".wrapUserList")!.innerHTML = "";
            res.forEach((item: any) => {
              T.getEle(".wrapUserList")!.innerHTML += Chat.TPL(
                userStore.isMyself(item.data)
              ).genUserTag(item.data);
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
            if (res.status && res.username != userStore.username) {
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
