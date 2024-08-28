import { Server, Socket } from "socket.io";
import ChatMessage from "../models/chatModel";

interface User {
  socketId: string;
  studentId: string;
  major: string;
  group: string;
}

const users: User[] = [];

const chatController = (io: Server) => {
  io.on("connection", async (socket: Socket) => {
    console.log("유저 연결 성공");

    socket.on("register", async ({ studentId, major }) => {
      const lastThreeDigits = studentId.slice(-3);
      const group = `${major}-${lastThreeDigits}`;

      const user: User = { socketId: socket.id, studentId, major, group };
      users.push(user);

      socket.join(group);
      console.log(`User ${studentId} joined group ${group}`);

      // 해당 그룹의 이전 메시지 불러오기
      try {
        const previousMessages = await ChatMessage.find({ group })
          .sort({ timestamp: -1 })
          .limit(50)
          .lean();
        socket.emit("previousMessages", previousMessages.reverse());
      } catch (error) {
        console.error("Error fetching previous messages:", error);
        socket.emit("error", "Failed to fetch previous messages");
      }
    });

    socket.on("chat message", async (msg) => {
      const user = users.find((u) => u.socketId === socket.id);
      if (user) {
        const messageWithInfo = new ChatMessage({
          studentId: user.studentId,
          message: msg,
          timestamp: new Date(),
          group: user.group,
        });

        try {
          await messageWithInfo.save();
          io.to(user.group).emit("chat message", messageWithInfo);
        } catch (error) {
          console.error("Error saving message:", error);
          socket.emit("error", "Failed to save message");
        }
      }
    });

    socket.on("disconnect", () => {
      const index = users.findIndex((u) => u.socketId === socket.id);
      if (index !== -1) {
        users.splice(index, 1);
      }
      console.log("유저 연결 종료");
    });
  });
};
export default chatController;
