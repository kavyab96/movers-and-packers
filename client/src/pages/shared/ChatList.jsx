import { useEffect, useState } from "react";
import { getMyChats } from "../../services/chatService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FullPageLoader from "../../components/loaders/FullPageLoader";

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const [loading, setLoading] = useState(true);


    // useEffect(() => {
    //     getMyChats().then((res) => {
    //         setChats(res.data);
    //     });
    // }, []);
    useEffect(() => {
    const fetchChats = async () => {
        try {
            setLoading(true);
            const res = await getMyChats();
            setChats(res.data);
        } catch (err) {
            console.error("Failed to load chats", err);
        } finally {
            setLoading(false);
        }
    };

    fetchChats();
}, []);



    return (
        <div className="w-full  overflow-y-auto">
             {loading && <FullPageLoader />}


            <h2 className="p-4 font-semibold">Chat List</h2>

           {!loading && chats.length === 0 && (
                <div className=" flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">

                    {/* Illustration */}
                    <img
                        src="/images/empty-chat.png"
                        alt="No chats"
                        className="h:20 md:h-60  mb-4 opacity-80"
                    />

                    {/* Title */}
                    <h3 className="text-xs md:text-lg font-semibold text-gray-700">
                        No conversations yet
                    </h3>

                    {/* Subtitle */}
                    <p className="text-sm mt-2 max-w-xs">
                        Start a chat by booking a service or messaging a provider.
                    </p>
                </div>
            )}


            {chats.map((chat) => {
                const otherUser = chat.participants.find(
                    (p) => p._id !== user._id
                );

                return (
                    <div
                        key={chat._id}
                        onClick={() =>
                            navigate(`/${user.role}/chat?conversationId=${chat._id}`)
                        }
                        className="p-4 cursor-pointer 
                         hover:bg-gray-200
                          active:bg-linear-to-r
                           active:from-sky-100
                            active:to-sky-200
                            active:opacity-90

                          dark:hover:bg-gray-700
                          dark:active:bg-linear-to-r
                          dark:active:from-sky-100
                          dark:active:to-sky-200
                          dark:active:opacity-90
                        dark:active:text-gray-900 
                          
                          border-b"
                    >
                        <div className="font-medium">
                            {otherUser?.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                            {chat.last_message || "No messages yet"}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChatList;
