import { Server, Socket } from "socket.io";
import ChatMessage from "../models/chatModel";
import { error } from "console";

export default function (io: Server): void {
  io.on("connection", (socket: Socket) => {
    console.log("새로운 클라이언트가 연결되었습니다.");

    socket.on("join room", async ({ major, studentId }) => {
      const room = `${major}-${studentId.slice(-3)}`;
      socket.join(room);
      console.log(`${room} 방에 참가했습니다.`);

      // 클라이언트에게 해당 방의 과거 메시지 전송
      const previousMessages = await ChatMessage.find({ group: room }).sort({
        timestamp: 1,
      });
      socket.emit("previous messages", previousMessages);
    });

    socket.on("chat message", async (data) => {
      const { studentId, major, message } = data;
      if (!studentId || !major || !message) {
        console.error("필요한 정보가 누락되었습니다.", error);
        return;
      }
      const room = `${major}-${studentId.slice(-3)}`;

      const chatMessage = new ChatMessage({
        group: room,
        studentId,
        message,
      });
      await chatMessage.save();

      io.to(room).emit("chat message", chatMessage);
    });

    socket.on("disconnect", () => {
      console.log("클라이언트가 연결을 끊었습니다.");
    });
  });
}
