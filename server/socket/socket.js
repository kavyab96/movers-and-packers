const Message = require("../app/Models/messageModel");
const Conversation = require("../app/Models/conversationModel");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔥🔥🔥 SOCKET CONNECTED:", socket.id);

    socket.on("send_message", async (data) => {
      try {
        const { conversation_id, sender_id, message } = data;

        // 1 Find conversation
        const conversation = await Conversation.findById(conversation_id);
        if (!conversation) return;

        // 2 Find receiver
        const receiver_id = conversation.participants.find(
          (id) => id.toString() !== sender_id
        );

        // 3️ Save message
        const savedMessage = await Message.create({
          conversation_id,
          sender_id,
          receiver_id,
          message,
        });


        // 4️ UPDATE CONVERSATION
        await Conversation.findByIdAndUpdate(conversation_id, {
          last_message: message,
          updatedAt: new Date(),
        });

        // 5 Emit to all connected clients
        io.emit("receive_message", savedMessage);

      } catch (err) {
        console.error("Send message error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(" Socket disconnected:", socket.id);
    });
  });
};
