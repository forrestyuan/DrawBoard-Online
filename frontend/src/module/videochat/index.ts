import { Dialog } from "mdui";
import { UserStore } from "@/store/user";
import { Tool as T } from "@/utils/index";
import { Chat } from "@/module/chat/chat";

const videoChat = (
  chat: Chat,
  ctx?: CanvasRenderingContext2D,
  canvas?: HTMLCanvasElement
) => {
  /*
   * 这里定义视屏截图
   */
  let inst_RTC = new Dialog("#videoChatBox", {
    modal: true,
    closeOnEsc: false,
    closeOnCancel: true,
    closeOnConfirm: true,
    destroyOnClosed: true,
  });
  let isVideoOn = false;

  T.getEle("#tool-rtc-chat").onclick = () => {
    if (isVideoOn) {
      return;
    }
    isVideoOn = true;
    const constraints = {
      audio: true,
      video: true,
    };
    T.getEle("#stopVideoChat").onclick = null;
    const myVideo = T.getEle(`#${UserStore.username}`)! as HTMLVideoElement;
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        //rtc准备好了，开启弹窗
        inst_RTC.open();
        console.log(stream);
        // myVideo.srcObject = stream;
        // myVideo.onloadedmetadata = () => myVideo.play();
        //这个 MediaRecoroder还在草案中, Typescript 对其一无所知，需要在global.d.ts中加入声明，跳过类型检查,safari不支持，请在chrome下体验

        //点击截图
        // T.getEle("#pauseVideoChat").onclick = () => {
        // let data = T.computeFrame(ctx, canvas, video);
        // console.log(data.data.buffer);
        // let buffer = "";
        // buffer += data.data[0];
        // data.data.forEach((b, idx) => {
        //   if (idx >= 1) buffer += "," + b;
        // });

        console.log("times go heer");
        let mc = new MediaRecorder(stream);
        const SENDITERVAL = setInterval(() => {
          // console.log(myVideo.currentSrc, myVideo.src, myVideo.srcObject);
          // chat.sendData("videoData", {
          //   username: UserStore.username,
          //   shot: { buffer: stream },
          // });
          mc.start();
          let stopTime = setTimeout(() => {
            mc.stop();
            clearTimeout(stopTime);
          }, 2980);

          mc.ondataavailable = function (e: any) {
            console.log("视频流");
            chat.sendData("videoData", {
              username: UserStore.username,
              shot: { buffer: e.data },
            });
          };
        }, 3000);
        //关闭rtc流
        T.getEle("#stopVideoChat").onclick = () => {
          isVideoOn = false;
          clearInterval(SENDITERVAL);
          stream.getTracks().forEach(function (track) {
            track.stop();
          });
        };
      })
      .catch(function (err) {
        /* 处理error */
        console.error(err);
      });
  };
};
export { videoChat };
export default videoChat;
