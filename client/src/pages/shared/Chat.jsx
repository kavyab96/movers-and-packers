import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getMessages, getConversationById } from "../../services/chatService";
import { socket } from "@/socket/socket";
import { useSelector } from "react-redux";
import { CircleChevronLeft } from "lucide-react";

const Chat = () => {
    const navigate = useNavigate();

    const [params] = useSearchParams();
    const conversationId = params.get("conversationId");

    const user = useSelector((state) => state.user.user);

    const [receiver, setReceiver] = useState(null);

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        if (!conversationId || !user?._id) return;
        //api call//
        getConversationById(conversationId).then((res) => {
            const otherUser = res.data.participants.find(
                (p) => p._id !== user._id
            );
            setReceiver(otherUser);
        });
    }, [conversationId, user]);

    /*  Load old messages (REST) */
    useEffect(() => {
        if (!conversationId) return;

        getMessages(conversationId).then((res) => {
            setMessages(res.data);
        });
    }, [conversationId]);

    /* Listen for real-time messages */
    useEffect(() => {
        socket.on("receive_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, []);

    /*---------- Send message function-------- */
    const sendMessage = () => {
        if (!text.trim()) return;
        const messageData = {
            conversation_id: conversationId,
            sender_id: user._id,
            message: text,
        };
        socket.emit("send_message", messageData);

        // Optimistic UI (show immediately)
        // setMessages((prev) => [
        //   ...prev,
        //   { ...messageData, created_at: new Date() },
        // ]);

        setText("");
    };

    /*  Send on Enter key */
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
       
        <div className="flex flex-col h-[calc(92vh-64px)] border rounded-lg flex-1 min-h-0">
            <div className="flex-1 flex flex-col min-h-0">

                {/* HEADER */}
                <div className="border-b p-4 flex items-center gap-4 shrink-0">
                    <button
                        onClick={() => navigate(`/${user.role}/chatlist`)}
                        className="text-sm text-primary hover:underline"
                    >
                        <CircleChevronLeft />
                    </button>
                    <span className="font-semibold capitalize">{receiver?.name || "Chat"}</span>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-2 ">
                    {messages.length === 0 && (
                        <p className="text-gray-400 text-center">
                            No messages yet. Say hello 👋
                        </p>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-[75%] sm:max-w-[45%] px-4 py-2 rounded-lg text-sm mb-10
                             ${msg.sender_id === user._id
                                    ? "ml-auto  bg-linear-to-r from-gray-600 to-gray-500  text-white "
                                    : "mr-auto bg-linear-to-r from-gray-600 to-blue-400/50   text-white"
                                }`}
                        >
                            {msg.message}
                        </div>
                    ))}
                </div>

                {/* INPUT */}
                <div className="border-t p-3 py-6 flex gap-2 items-center shrink-0">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="flex-3 min-w-0 border rounded-full px-3 py-2 md:py-4 text-sm focus:outline-none"
                    />
                    <button
                        onClick={sendMessage}
                        className="flex-1 px-4 py-2 md:py-4 text-white rounded-full text-sm shrink-0
                        bg-linear-to-r from-sky-300 to-blue-500  hover:opacity-100"
                    >
                        Send
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Chat;
