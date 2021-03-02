export default class Tool {
  static getEle(selector, isList = false) {
    return !isList
      ? document.querySelector(selector)
      : document.querySelectorAll(selector);
  }

  static getTargetWH(obj = false) {
    let res = null;
    if (!obj) {
      res = [
        window.document.body.offsetWidth ||
          document.documentElement.clientWidth,
        window.document.body.offsetHeight ||
          document.documentElement.clientHeight,
      ];
    } else {
      res = [obj.offsetWidth, obj.offsetHeight];
    }
    return res;
  }

  static genImgBase64(img) {
    let canvas = document.createElement("canvas"); //创建canvas DOM元素，并设置其宽高和图片一样
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height); //使用画布画图
    let dataURL = canvas.toDataURL("image/jpeg"); //返回的是一串Base64编码的URL并指定格式
    canvas = null; //释放
    return dataURL;
  }

  static computeFrame(ctx, canvas, video) {
    ctx.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight);
    let data = ctx.getImageData(0, 0, video.offsetWidth, video.offsetHeight);
    return data;
  }
  static processVideoFrame(frame) {
    let l = frame.data.length / 4;

    for (let i = 0; i < l; i++) {
      let r = frame.data[i * 4 + 0];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];
      if (g > 100 && r > 100 && b < 43) frame.data[i * 4 + 3] = 0;
    }
    return frame;
  }
}
