class tool{
   static getEle(selector, isList = false){
    return !isList ? document.querySelector(selector) : document.querySelectorAll(selector);
  }

  static getTargetWH(obj = false){
    let res = null;
    if(!obj){
      res = [
        window.document.body.offsetWidth || document.documentElement.clientWidth, 
        window.document.body.offsetHeight || document.documentElement.clientHeight
      ];
    }else{
      res = [
        obj.offsetWidth,
        obj.offsetHeight
      ]
    }
    return res;
  }
}

module.exports =  tool;