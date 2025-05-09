"use client";
import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from "next/navigation";
import { IoIosSend } from "react-icons/io";
import Message from "./Message";
import BackButton from '@/app/shared/ui/BackButton';

const LiveChat = () => {
    // available servers/ws connections
    const connections = [
        "ws://localhost:8000/ws/client/link_client",
        "ws://localhost:8001/ws/client/link_client",
        "ws://localhost:8002/ws/client/link_client",
        "ws://localhost:8003/ws/client/link_client",
    ]

    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<JSON[]>([]);
    const socket = useRef<WebSocket | null>(null);
    const isClosingOrClosed = useRef(false);
    const params = useParams();
    const gameId = params.gameId?.toString();
    const [currentGame, setCurrentGame] = useState<{ id: number; homeTeam: string; awayTeam: string } | null>(null);
    const searchParams = useSearchParams();
    const query_username = searchParams.get("username")
    const [currentConnection, setCurrentConnection] = useState(0);

    // use effect to initiate connection to chatroom
    useEffect(() => {
        console.log("Trying to connect to " + connections[currentConnection])
        socket.current = new WebSocket(connections[currentConnection]);
        socket.current.onopen = () => {
            console.log("Connected to WebSocket for sending messages");
            if (socket.current && socket.current.readyState === WebSocket.OPEN) {
                const json = {
                    type: "join_chat_room",
                    chat_id: gameId,
                    username: query_username
                };
                socket.current.send(JSON.stringify(json));
                console.log("Sent message:", json);
            } else {
                console.error("WebSocket for sending is not open or initialized");
            }
        };

        // handle socket error
        socket.current.onerror = (error) => {
            setCurrentConnection((currentConnection + 1) % connections.length)
            console.error("WebSocket error for sending:", error);
        };

        // handle socket closing
        socket.current.onclose = () => {
            setCurrentConnection((currentConnection + 1) % connections.length)
            console.log("WebSocket for sending messages closed");
        };

        // handle socket message send
        socket.current.onmessage = (event) => {
            const rawData = JSON.parse(event.data)
            const data = JSON.parse(rawData)
            if (data["type"] == "update") {
                setMessages(data.messages)
            } else if (data["type"] == "leader") {
                console.log("Leader is: " + data["leader"]);
            }

        };

        return () => {
            if (socket.current && !isClosingOrClosed.current) {
                socket.current.close();
                console.log("Cleanup: WebSocket for sending messages closed");
            }
        };
    }, [currentConnection]);

    // send message fucntion
    const sendMessage = () => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            const json = {
                type: "send_message",
                chat_id: gameId,
                username: query_username,
                text: inputValue
            };
            socket.current.send(JSON.stringify(json));
            console.log("Sent message:", json);
            setInputValue("");
        } else {
            console.error("WebSocket for sending is not open or initialized");
        }
    };

    // get game for header of chatroom
    useEffect(() => {
        if (!gameId) return;
        fetch('http://127.0.0.1:8000/get/todays_games')
            .then(response => response.json())
            .then(data => {
                setCurrentGame(data.message.find(game => game.id === gameId)); // Assuming API response contains a 'message' field with the game details
            })
            .catch(error => {
                console.error("Error fetching game data:", error);
                setCurrentGame({ id: -1, homeTeam: "N/A", awayTeam: "N/A" }); // Fallback if API fails
            });
    }, [gameId]);

    return (
        <div className="relative min-h-screen bg-gradient-to-r from-blue-900 via-white to-red-600">
            {/* Back Button fixed to top-left of the screen */}
            <div className="absolute top-4 left-4 z-50">
                <BackButton />
            </div>

            {/* Centered chat container */}
            <div className="flex items-center justify-center min-h-screen">
                <div className="border-4 border-blue-500 w-[80%] h-[90vh] flex flex-col items-center bg-white shadow-xl rounded-2xl p-6">
                    <h1 className="text-4xl pb-2 pt-4 font-extrabold text-blue-900">
                        {currentGame?.awayTeam} @ {currentGame?.homeTeam}
                    </h1>
                    {/* message box with all chatroom messages */}
                    <div className="border-2 border-gray-300 h-[65%] w-[95%] p-3 overflow-y-auto rounded-lg bg-gray-50 shadow-inner">
                        {messages.map((message: any, index: number) => (
                            <Message key={index} user={message.username} content={message.text} />
                        ))}
                    </div>
                    {/* textbox for user to send message */}
                    <div className="flex items-center w-[95%] h-[10%] mt-3">
                        <div className="border-2 border-gray-400 rounded-lg flex-grow p-2 bg-white shadow-md">
                            <input
                                className="w-full h-full outline-none bg-transparent text-lg"
                                placeholder="Type here..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                        {/* send button */}
                        <button
                            className="ml-3 bg-blue-700 text-white p-3 rounded-lg hover:bg-red-600 transition shadow-lg"
                            onClick={sendMessage}
                        >
                            <IoIosSend className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LiveChat;