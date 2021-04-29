class Video {
  static useList: string[] = [];
  static addVideoTpl(
    username: string,
    root: HTMLElement | null = document.getElementById("videoChatBoxCon")
  ) {
    let videoTpl = `
        <video id="${username}" width="300px" height="300px" ></video>
      `;
    if (root !== null) {
      root.innerHTML += videoTpl;
    } else {
      console.error("无法找到指定的容器用于放置视频");
    }
    return videoTpl;
  }
  static removeVideoTpl(
    username: string,
    root: HTMLElement | null = document.getElementById("videoChatBoxCon")
  ) {
    if (root !== null) {
      let child = root.querySelector(`#${username}`);
      root.removeChild(child as Node);
    } else {
      console.error("无法去除视频节点，无法找到指定放置视频的容器");
    }
  }
}

export { Video };
export default Video;
