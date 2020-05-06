const path = require('path')
const express = require('express');
const routes = require('./server/router');
const app = express();



app.use(express.static('dist'));
app.use('/',routes);



// Serve the files on port 3000.
const port = process.env.port || 3001;
const host = process.env.host || '127.0.0.1'
const server = app.listen(port, () => {
  console.log(`app listening at ${host}:${port}!\n`);
});


let userList = [];
var io = require('socket.io')(server);
io.on('connection', socket => {
  console.log('user connected')
  //聊天内容
  socket.on('chatData', (data, callback) => {
    try {
      callback(data);
      io.emit('getChatData', data);
    } catch (error) {
      console.error('json 数据格式不正确'+error);
    }
  }); 
  //用户进入
  socket.on('addUser', (data)=>{
    userList.push({id:socket.id, data:data});
    console.log(socket.id)
    io.emit("updateUserList", JSON.stringify(userList)); 
    io.emit('getChatData', JSON.stringify({username: '系统',msg:data+'加入了协作'}));
  });
  socket.on('sendDrawData',data=>{
    io.emit('getDrawData',data);
  }); 

  socket.on('canSetBeginPath',data=>{
    JSON.parse(data);
    io.emit('resetBeginPath',JSON.stringify({"username":data.username,"status":true}))
  });

  socket.on('syncConfig', data=>{
    io.emit('resetConfig',data);
  });

  //退出链接
  socket.on('disconnect',e=>{
    let tmpList = JSON.parse(JSON.stringify(userList));
    tmpList.forEach((item,key)=>{
      if(item.id == socket.id){
        let exitUser = userList.splice(key,1);
        io.emit('getChatData', JSON.stringify({username:'系统',msg:exitUser.data+'退出出了协作'}));
      }
    });
    console.log(JSON.stringify(userList));
    io.emit("updateUserList",JSON.stringify(userList));
    console.log('user disconnected')
  });
});


