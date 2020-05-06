const io = require('socket.io-client/dist/socket.io');
export default class Chat {
  constructor(obj = {receive:false}){
    if(!obj.receive){
      console.error(
        `缺失绑定的参数值：send 和 receive，请检查参数!!!`,
      )
      return;
    }
    
    this.socket = io();
    //监听接收数据
    for(let i = 0; i < obj.receive.length; i++){
      this.receiveData(obj.receive[i].socketName, obj.receive[i].callback);
    }
  }
  sendData(socketName,data,cb){
    this.socket.emit(socketName,data, (res)=>{
        // console.log(typeof cb);
        if( typeof cb === 'function'){
          cb(res);
        }
    });
  }
  receiveData(socketName, cb){
    this.socket.on(socketName, res=>{
      if(typeof cb === 'function'){
        cb(res);
      }

    });
  }
   getSocket(){
    return this.socket;
  }

  static TPL(){
    return{
      genChatTxtTpl:(name = 'unkonw', content = 'unkonw') => {
                    return `
                      <div style="line-height:1.5em;">
                        <span>${name}说:&nbsp;&nbsp;${content}</span><br>
                      </div>    `
                  },
      genChatImgTpl:(name = 'unknow', content = 'unkonw') => {
                      return `
                        <div style="margin-top:15px">
                          <span>${name}说:&nbsp;&nbsp;</span>
                          <img mdui-tooltip="{content: '未完善，当前请右键新标签打开查看大图', position: 'top'}" style="max-height: 130px;vertical-align: top;min-width: 100px;background: #efefef;padding: 5px;box-shadow: 0 0 10px 1px #ccc;" src="${content}" />
                        </div>
                      `
                  }
    }
    
  };

}
