"use client";
import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from "next/navigation";
import { IoIosSend } from "react-icons/io";
import Message from "./Message";
import { GAMES } from '../CurrentGames/games';

const LiveChat = () => {
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
    const gameId = Number(params.gameId); // Extract game ID from the URL
    const searchParams = useSearchParams();
    const query_username = searchParams.get("username")
    const [currentConnection, setCurrentConnection] = useState(0);

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

        socket.current.onerror = (error) => {
            setCurrentConnection((currentConnection + 1) % connections.length)
            console.error("WebSocket error for sending:", error);
        };

        socket.current.onclose = () => {
            setCurrentConnection((currentConnection + 1) % connections.length)
            console.log("WebSocket for sending messages closed");
        };

        socket.current.onmessage = (event) => {
            const rawData = JSON.parse(event.data)
            const data = JSON.parse(rawData)
            setMessages(data.messages)
        };

        return () => {
            if (socket.current && !isClosingOrClosed.current) {
                socket.current.close();
                console.log("Cleanup: WebSocket for sending messages closed");
            }
        };
    }, [currentConnection]);

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setInputValue(e.target.value);
    // };

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

    // for sake of demo
    function FindGame(gameId: number) {
        return GAMES.find(game => game.id === gameId) ?? { id: -1, homeTeam: "N/A", awayTeam: "N/A" };
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-white to-red-600">
            <div className="border-4 border-blue-500 w-[80%] h-[90vh] flex flex-col items-center bg-white shadow-xl rounded-2xl p-6">
                <h1 className="text-4xl pb-2 pt-4 font-extrabold text-blue-900">{FindGame(gameId).awayTeam} @ {FindGame(gameId)?.homeTeam}</h1>
                {/* <h2 className="text-2xl pb-4 text-gray-700">Game Thread {gameId}</h2> */}
                <div className="border-2 border-gray-300 h-[65%] w-[95%] p-3 overflow-y-auto rounded-lg bg-gray-50 shadow-inner">
                    {messages.map((message: any, index: number) => (
                        <Message key={index} user={message.username} content={message.text} />
                    ))}
                </div>
                <div className="flex items-center w-[95%] h-[10%] mt-3">
                    <div className="border-2 border-gray-400 rounded-lg flex-grow p-2 bg-white shadow-md">
                        <input
                            className="w-full h-full outline-none bg-transparent text-lg"
                            placeholder="Type here..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                    <button
                        className="ml-3 bg-blue-700 text-white p-3 rounded-lg hover:bg-red-600 transition shadow-lg"
                        onClick={sendMessage}
                    >
                        <IoIosSend className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    )
}
export default LiveChat;