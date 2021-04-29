import { Dialog } from "mdui";
import { UserStore } from "@/store/user";
import { Tool as T } from "@/utils/index";
import { Chat } from "@/module/chat/chat";

const videoShot = (
  chat: Chat,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => {
  /*
   * 这里定义视屏截图
   */
  let video = document.getElementById("VIDEO")! as HTMLVideoElement;
  let inst_RTC = new Dialog("#example-5", {
    modal: true,
    closeOnEsc: false,
    closeOnCancel: true,
    closeOnConfirm: true,
    destroyOnClosed: true,
  });
  let isVideoOn = false;

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
        //rtc准备好了，开启弹窗
        inst_RTC.open();
        /* 将rtc给回的流数据放到video播放 */
        video.srcObject = stream;
        video.onloadedmetadata = () => video.play();
        //点击截图
        T.getEle("#pauseVideo").onclick = () => {
          //将视屏当前帧渲染到canvas，并拿到当前帧的二进制数据
          let data = T.computeFrame(ctx, canvas, video);
          console.log(data.data.buffer);
          let buffer = "";
          buffer += data.data[0];
          data.data.forEach((b, idx) => {
            if (idx >= 1) buffer += "," + b;
          });
          //将二进制数据通过socket.io同步到其它用户终端
          chat.sendData("screenshot", {
            username: UserStore.username,
            shot: { width: data.width, height: data.height, buffer },
          });
        };
        //关闭rtc流
        T.getEle("#stopVideo").onclick = () => {
          isVideoOn = false;
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
export { videoShot };
export default videoShot;
