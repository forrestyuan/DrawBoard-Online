class Tool {
  static getEle(selector: string) {
    return document.querySelector(selector) as HTMLElement;
  }
  static getEleList(selector: string) {
    return document.querySelectorAll(selector);
  }

  static getTargetWH(obj: boolean | HTMLElement = false) {
    let res = null;
    if (typeof obj === "boolean" && !obj) {
      res = [
        window.document.body.offsetWidth ||
          document.documentElement.clientWidth,
        window.document.body.offsetHeight ||
          document.documentElement.clientHeight,
      ];
    }

    if (typeof obj !== "boolean") {
      res = [obj.offsetWidth, obj.offsetHeight];
    }
    return res ?? [];
  }

  static genImgBase64(img: HTMLImageElement) {
    let canvas: HTMLCanvasElement | null = document.createElement("canvas"); //创建canvas DOM元素，并设置其宽高和图片一样
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0, img.width, img.height); //使用画布画图
    let dataURL = canvas.toDataURL("image/jpeg"); //返回的是一串Base64编码的URL并指定格式
    canvas = null; //释放
    return dataURL;
  }

  static computeFrame(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    video: HTMLVideoElement
  ) {
    ctx.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);
    let data = ctx.getImageData(0, 0, video.offsetWidth, video.offsetHeight);
    return data;
  }
}
export { Tool };
export default Tool;
