import { Server, Socket } from "socket.io";
import ChatMessage from "../models/chatModel";

export default function (io: Server): void {
  io.on("connection", (socket: Socket) => {
    socket.on("join room", async ({ major, studentId }) => {
      const lastThree = parseInt(studentId.slice(-3), 10);
      let roomRange;

      if (lastThree >= 1 && lastThree <= 19) {
        roomRange = "1번방";
      } else if (lastThree >= 20 && lastThree <= 39) {
        roomRange = "2번방";
      } else if (lastThree >= 40 && lastThree <= 59) {
        roomRange = "3번방";
      } else if (lastThree >= 60 && lastThree <= 90) {
        roomRange = "4번방";
      } else if (lastThree > 90 && lastThree <= 200) {
        roomRange = "5번방";
      } else {
        socket.emit("error", "적절한 학번 구간에 속하지 않습니다.");
        return;
      }

      const room = `${major}-${roomRange}`;
      socket.join(room);

      // 이전 메시지를 불러오기
      const previousMessages = await ChatMessage.find({ group: room }).sort({
        timestamp: 1,
      });
      socket.emit("previous messages", previousMessages);
    });

    // 채팅 메시지 전송
    socket.on("chat message", async (data) => {
      const { studentId, major, message, name } = data;
      if (!studentId || !major || !message || !name) {
        console.error("필요한 정보가 누락되었습니다.");
        return;
      }
      const lastThree = parseInt(studentId.slice(-3), 10);
      let roomRange;

      // 메시지를 보낼 방 결정 ("몇 번방" 형식)
      if (lastThree >= 1 && lastThree <= 19) {
        roomRange = "1번방";
      } else if (lastThree >= 20 && lastThree <= 39) {
        roomRange = "2번방";
      } else if (lastThree >= 40 && lastThree <= 59) {
        roomRange = "3번방";
      } else if (lastThree >= 60 && lastThree <= 90) {
        roomRange = "4번방";
      } else if (lastThree > 90 && lastThree <= 200) {
        roomRange = "5번방";
      } else {
        socket.emit("error", "적절한 학번 구간에 속하지 않습니다.");
        return;
      }

      const room = `${major}-${roomRange}`;

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
}
