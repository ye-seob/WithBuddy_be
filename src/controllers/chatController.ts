// 백엔드 코드 수정 (notification 이벤트 추가)
import { Server, Socket } from "socket.io";
import ChatMessage from "../models/chatModel";

export default function (io: Server): void {
  io.on("connection", (socket: Socket) => {
    socket.on("join room", async (room) => {
      socket.join(room);
      const previousMessages = await ChatMessage.find({ room: room }).sort({
        timestamp: 1,
      });
      socket.emit("previous messages", previousMessages);
    });

    // 채팅 메시지 전송
    socket.on("chat message", async (data) => {
      const { studentId, major, message, name, roomBuddyId } = data;
      if (!studentId || !major || !message || !name) {
        console.error("필요한 정보가 누락되었습니다.");
        return;
      }

      const room = `${Math.min(
        parseInt(studentId),
        parseInt(roomBuddyId)
      )}-${Math.max(parseInt(studentId), parseInt(roomBuddyId))}`;

      const chatMessage = new ChatMessage({
        room,
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
