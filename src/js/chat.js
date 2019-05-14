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
  
}
