import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";
import app from "./app";
import { config } from "./config";

const PORT = config.port;

const server = http.createServer(app.callback());
export const io = new SocketIOServer(server);

io.on("connection", (socket: Socket) => {
  console.log("Client connected");

  socket.on("documentPublished", (newContent: string) => {
    socket.broadcast.emit("documentPublished", newContent);
  });

  socket.on("documentUpdated", (newContent: string) => {
    socket.broadcast.emit("documentUpdated", newContent);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, async () => {
  console.log(`Server running on ${PORT}`);
});
