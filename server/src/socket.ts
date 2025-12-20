const { Server } = require("socket.io");

/**
 * @param {import('http').Server | import('https').Server} server
 */
const initSocket = (server: import('http').Server | import('https').Server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket: import('socket.io').Socket) => {
    socket.on("message", (data: any) => {
      io.emit("message", data);
    });
  });
};

module.exports = { initSocket };
