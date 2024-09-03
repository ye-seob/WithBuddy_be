import { Server, Socket } from "socket.io";
import ChatMessage from "../models/chatModel";
// import cron from "node-cron";

export default function (io: Server): void {
  io.on("connection", (socket: Socket) => {
    socket.on("join room", async ({ major, studentId }) => {
      const room = `${major}-${studentId.slice(-3)}`;
      socket.join(room);

      const previousMessages = await ChatMessage.find({ group: room }).sort({
        timestamp: 1,
      });
      socket.emit("previous messages", previousMessages);
    });

    socket.on("chat message", async (data) => {
      const { studentId, major, message, name } = data;
      if (!studentId || !major || !message || !name) {
        console.error("필요한 정보가 누락되었습니다.");
        return;
      }
      const room = `${major}-${studentId.slice(-3)}`;

      const chatMessage = new ChatMessage({
        group: room,
        studentId,
        message,
        name,
      });
      await chatMessage.save();

      io.to(room).emit("chat message", chatMessage);
    });

    socket.on("disconnect", () => {});
  });
  // cron.schedule("0 0 * * *", async () => {
  //   try {
  //     const twoDaysAgo = new Date();
  //     twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  //     await ChatMessage.deleteMany({ timestamp: { $lt: twoDaysAgo } });
  //     console.log("2일 지난 메시지를 삭제했습니다.");
  //   } catch (error) {
  //     console.error("메시지 삭제 중 오류 발생:", error);
  //   }
  // });
}
