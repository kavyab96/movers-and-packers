const chatRouter = require("express").Router();
const { startConversation ,getMessages ,getMyChats,getConversationById} = require("../../Controllers/chatController");
const authMiddleware = require("../../Middleware/authMiddleware");
const roleMiddleware = require("../../Middleware/roleMiddleware");


//start convo or check a convo exists with this provider
chatRouter.post("/start", authMiddleware, roleMiddleware(['user','provider']), startConversation);
chatRouter.get("/message/:conversationId", authMiddleware, roleMiddleware(['user','provider']), getMessages);
chatRouter.get("/get-chats",authMiddleware,roleMiddleware(["user","provider"]),getMyChats);
//get a single conversation
chatRouter.get("/conversation/:id",authMiddleware,roleMiddleware(["user","provider"]),getConversationById);


module.exports = chatRouter;
