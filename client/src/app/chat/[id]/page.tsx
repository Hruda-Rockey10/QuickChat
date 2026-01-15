"use client";

import { useChatSocket } from "@/hooks/useChatSocket";
import { apiWrapper } from "@/lib/apiWrapper";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function ChatPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [user, setUser] = useState<{ id: number, name: string } | null>(null);
    const [group, setGroup] = useState<{ title: string, user_id: number } | null>(null);
    const [inputText, setInputText] = useState("");
    const [isLocked, setIsLocked] = useState(true);
    const [passcode, setPasscode] = useState("");
    const [joinError, setJoinError] = useState("");
    
    // Auto-scroll ref
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Load User
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
           router.push("/");
           return;
        }
        setUser(JSON.parse(storedUser));
    }, [router]);

    // 2. Load Group Details & Check Lock Status
    useEffect(() => {
        if (!id || !user) return;

        apiWrapper<{ data: { title: string, user_id: number } }>(`/api/chat-group/${id}`)
            .then((res) => {
                setGroup(res.data);
                
                // Unlock if Creator
                if (user.id === res.data.user_id) {
                    setIsLocked(false);
                    return;
                }

                // Unlock if previously joined (LocalStorage check)
                const unlocked = JSON.parse(localStorage.getItem("unlocked_groups") || "[]");
                if (unlocked.includes(id)) {
                    setIsLocked(false);
                }
            })
            .catch(() => router.push("/dashboard"));
    }, [id, user, router]);

    const { messages, isLoading, isConnected, sendMessage } = useChatSocket(isLocked ? "" : id, user?.name || "Anonymous");

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        sendMessage(inputText);
        setInputText("");
    }

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setJoinError("");
        try {
            await apiWrapper("/api/chat-group/join", {
                method: "POST",
                body: JSON.stringify({
                    group_id: id,
                    name: user?.name,
                    passcode: passcode
                })
            });
            
            // Success! Unlock and Persist
            setIsLocked(false);
            const unlocked = JSON.parse(localStorage.getItem("unlocked_groups") || "[]");
            if (!unlocked.includes(id)) {
                localStorage.setItem("unlocked_groups", JSON.stringify([...unlocked, id]));
            }
        } catch (err: any) {
            setJoinError(err.message || "Invalid Passcode");
        }
    }

    if (!user || !group) return <div className="p-10 text-center">Loading Group...</div>;

    // --- LOCKED STATE (Passcode Modal) ---
    if (isLocked) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-2">{group.title}</h1>
                    <p className="text-gray-500 mb-6">This group is protected. Please enter the passcode to join.</p>
                    
                    <form onSubmit={handleJoin} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Enter Passcode"
                            className="w-full p-3 border rounded text-lg dark:bg-gray-700 dark:border-gray-600"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                        />
                        {joinError && <p className="text-red-500 text-sm">{joinError}</p>}
                        <div className="flex gap-2">
                             <button 
                                type="button"
                                onClick={() => router.push("/dashboard")}
                                className="flex-1 py-3 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold"
                            >
                                Join Group
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // --- UNLOCKED STATE (Chat UI) ---
    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
                        &larr; Back
                    </button>
                    <div>
                        <h1 className="font-bold text-lg">{group.title}</h1>
                        <span className={`text-xs flex items-center gap-1 ${isConnected ? "text-green-500" : "text-yellow-500"}`}>
                           <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-yellow-500"}`}></span> 
                           {isConnected ? "Connected" : "Connecting..."}
                        </span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {isLoading && <p className="text-center text-gray-500">Loading messages...</p>}
                
                {messages?.map((msg, index) => {
                    const isMe = msg.name === user.name;
                    const initials = msg.name 
                        ? msg.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) 
                        : "??";

                    return (
                        <div key={index} className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                             {/* Avatar */}
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                 isMe ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                             }`}>
                                {initials}
                             </div>

                             <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[80%]`}>
                                 {/* Name Label (only for others) */}
                                 {!isMe && <span className="text-xs text-gray-500 ml-1 mb-1">{msg.name}</span>}
                                 
                                 {/* Bubble */}
                                 <div className={`px-4 py-2 shadow-sm break-words text-sm ${
                                     isMe 
                                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-none" 
                                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none"
                                 }`}>
                                    {msg.message}
                                 </div>
                                 
                                 <span className="text-[10px] text-gray-400 mt-1 mx-1">
                                    {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                 </span>
                             </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
                    <input
                        className="flex-1 border rounded-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition-transform active:scale-95"
                    >
                        ➤
                    </button>
                </form>
            </div>
        </div>
    )
}
