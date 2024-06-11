const socketMain = (io) => {
  io.on("connection", (socket) => {
    let runningMachineMacAddress;
    const auth = socket.handshake.auth;
    if (auth.token == "aaeygaotohmodihe") {
      socket.join("nodeClient");
    } else if (auth.token == "harharmodi") {
      socket.join("reactClient");
    } else {
      socket.disconnect();
      console.log("You are out of here");
    }
    console.log(`Someone connected on worker ${process.pid}`);
    socket.emit(
      "welcome",
      "Welcome to our cluser driven socket.io server for performance moniter "
    );
    socket.on("prefData", (data) => {
      if (!runningMachineMacAddress) runningMachineMacAddress = data.mac;
      socket.to("reactClient").emit("prefData", data);
      io.to("reactClient").emit("isConnected", {
        runningMachineMacAddress,
        isLive: true,
      });
    });
    socket.on("disconnect", (anyReason) => {
      io.to("reactClient").emit("isConnected", {
        runningMachineMacAddress,
        isLive: false,
      });
    });
  });
};

module.exports = socketMain;
