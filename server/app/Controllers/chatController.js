

import Conversation from "../Models/conversationModel.js";
import Message from "../Models/messageModel.js"

/*start conversation 
*cheks for conversation exissts/not
* if yes return conversation_id
* if no existing conversation create new conversation for user-preovider pair and return its conversation_id
*/
export const startConversation = async (req, res, next) => {
    try {
        const userId = req.user.id; // from auth middleware
        const { provider_id } = req.body;

        if (!provider_id) {
            return res.status(400).json({
                message: "Provider ID is required"
            });
        }

        //  Check if conversation already exists
        const existingConversation = await Conversation.findOne({
            participants: { $all: [userId, provider_id] }
        });

        if (existingConversation) {
            return res.status(200).json({
                conversation_id: existingConversation._id
            });
        }

        // Create new conversation
        const newConversation = await Conversation.create({
            participants: [userId, provider_id]
        });

        return res.status(201).json({
            conversation_id: newConversation._id
        });

    } catch (error) {
        next(error);
    }
}



/*getting existing messages */
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversation_id: conversationId
    }).sort({ created_at: 1 });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};

/* fetching all chats of user so far */
export const getMyChats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate("participants", "name email")
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    next(err);
  }
};

/* get single conversation details */
export const getConversationById = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate("participants", "name email");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(conversation);
  } catch (err) {
    next(err);
  }
};
