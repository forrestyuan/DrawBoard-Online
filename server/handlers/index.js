module.exports = function (IMSERVER_IO, userList) {
  if (IMSERVER_IO) {
    IMSERVER_IO.on("connection", (socket) => {
      console.log("user connected");
      //聊天内容
      socket.on("chatData", (data, callback) => {
        try {
          callback(data);
          IMSERVER_IO.emit("getChatData", data);
        } catch (error) {
          console.error("json 数据格式不正确" + error);
        }
      });
      //用户进入
      socket.on("addUser", (data) => {
        userList.push({ id: socket.id, data: data });
        console.log(socket.id);
        IMSERVER_IO.emit("updateUserList", JSON.stringify(userList));
        IMSERVER_IO.emit(
          "getChatData",
          JSON.stringify({ username: "系统", msg: data + "加入了协作" })
        );
      });
      socket.on("sendDrawData", (data) => {
        IMSERVER_IO.emit("getDrawData", data);
      });

      socket.on("canSetBeginPath", (data) => {
        JSON.parse(data);
        IMSERVER_IO.emit(
          "resetBeginPath",
          JSON.stringify({ username: data.username, status: true })
        );
      });

      socket.on("syncConfig", (data) => {
        IMSERVER_IO.emit("resetConfig", data);
      });
      socket.on("screenshot", (data) => {
        IMSERVER_IO.emit("setScreenshot", data);
      });

      //退出链接
      socket.on("disconnect", (e) => {
        let tmpList = JSON.parse(JSON.stringify(userList));
        tmpList.forEach((item, key) => {
          if (item.id == socket.id) {
            let exitUser = userList.splice(key, 1);
            IMSERVER_IO.emit(
              "getChatData",
              JSON.stringify({
                username: "系统",
                msg: exitUser.data + "退出出了协作",
              })
            );
          }
        });
        console.log(JSON.stringify(userList));
        IMSERVER_IO.emit("updateUserList", JSON.stringify(userList));
        console.log("user disconnected");
      });
    });
  } else {
    console.error("即时通信服务异常!");
  }
};
