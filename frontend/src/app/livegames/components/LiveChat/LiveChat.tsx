"use client";
import { useState, useEffect, useRef } from 'react';
import { useParams } from "next/navigation";
import { IoIosSend } from "react-icons/io";
import Message from "./Message";

// for demo
import { GAMES } from '../CurrentGames/games';

const LiveChat = () => {
    const [nameValue, setNameValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<JSON[]>([]);
    const sendSocketRef = useRef<WebSocket | null>(null);
    const receiveSocketRef = useRef<WebSocket | null>(null);
    const isClosingOrClosed = useRef(false);

    useEffect(() => {
        // Need to change logic on sending data from backend***
        sendSocketRef.current = new WebSocket("ws://localhost:8000/ws/client/link_client");
        sendSocketRef.current.onopen = () => {
            console.log("Connected to WebSocket for sending messages");
        };
        sendSocketRef.current.onerror = (error) => {
            console.error("WebSocket error for sending:", error);
        };
        sendSocketRef.current.onclose = () => {
            console.log("WebSocket for sending messages closed");
            isClosingOrClosed.current = true;
        };

        // Need to change logic on recieving data from backend***
        receiveSocketRef.current = new WebSocket("ws://localhost:8000/ws/client/link_client");
        receiveSocketRef.current.onopen = () => {
            console.log("Connected to WebSocket for receiving messages");
        };
        receiveSocketRef.current.onerror = (error) => {
            console.error("WebSocket error for receiving:", error);
        };
        receiveSocketRef.current.onclose = () => {
            console.log("WebSocket for receiving messages closed");
        };
        receiveSocketRef.current.onmessage = (event) => {
            setMessages(JSON.parse(event.data));
            console.log(messages)
        };

        return () => {
            if (sendSocketRef.current && !isClosingOrClosed.current) {
                sendSocketRef.current.close();
                console.log("WebSocket for sending messages closed");
            }
            if (receiveSocketRef.current) {
                receiveSocketRef.current.close();
                console.log("WebSocket for receiving messages closed");
            }
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameValue(e.target.value);
    };

    const sendMessage = (e: React.MouseEvent) => {
        if (sendSocketRef.current && sendSocketRef.current.readyState === WebSocket.OPEN && nameValue !== '') {
            const json = {
                user: nameValue,
                text: inputValue,
            };
            sendSocketRef.current.send(JSON.stringify(json));
            console.log("Sent message:", json);
            setInputValue("");
        } else {
            console.error("WebSocket for sending is not open or initialized");
        }
    };

    // return (
    //     <div className="border border-black h-full w-[70%] flex flex-col items-center">
    //         {/* game titles */}
    //         <h1 className="text-4xl pb-[1%] pt-[2%] font-bold"> Portland Trailblazers vs Los Angeles Lakers </h1>
    //         <h1 className="text-3xl pb-[3%]"> Game thread #1 </h1>

    //         {/* chat area -> might need to make it a seperate component*/}
    //         <div className="border black h-[65%] w-[90%] pt-[1%] pl-[1%] mb-[4%] overflow-y-auto max-h-[65%]">
    //             {messages.map((message: any) => (
    //                 <Message
    //                     user={message.user}
    //                     content={message.text}
    //                 />
    //             ))}
    //         </div>

    //         {/* messaging area */}
    //         <div className="flex h-[10%] w-[90%] mb-[2%]">
    //             <div className="border w-[90%] mr-[2%]">
    //                 <label>
    //                     <input
    //                         className="text-1xl pl-[2%] pr-[2%] w-full h-full"
    //                         placeholder='Type here...'
    //                         value={inputValue}
    //                         onChange={handleChange}
    //                     />
    //                 </label>
    //             </div>
    //             <div className="w-[5%]">
    //                 <IoIosSend
    //                     className="active:scale-120 w-full h-full"
    //                     onClick={sendMessage}
    //                 />
    //             </div>
    //             <div className="border border-black mb-[2%]">
    //                 <input
    //                     className="border-none pl-[3%] pr-[3%] w-full "
    //                     placeholder='Enter username here...'
    //                     value={nameValue}
    //                     onChange={handleNameChange}
    //                 />
    //             </div>
    //         </div>
    //     </div>
    // )
    const params = useParams();
    const gameId = Number(params.gameId); // Extract game ID from the URL

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="border border-black w-[80%] h-[90vh] flex flex-col items-center bg-white shadow-lg rounded-lg p-4">
                {/* Game Titles */}
                <h1 className="text-4xl pb-2 pt-4 font-bold text-center">
                    {FindGame(gameId).awayTeam} @ {FindGame(gameId)?.homeTeam}
                </h1>
                <h2 className="text-2xl pb-4 text-gray-700">Game Thread {gameId}</h2>

                {/* Chat Area */}
                <div className="border border-gray-300 h-[65%] w-[95%] p-3 overflow-y-auto rounded-lg bg-gray-50">
                    {messages.map((message: any, index: number) => (
                        <Message key={index} user={message.user} content={message.text} />
                    ))}
                </div>

                {/* Messaging Area */}
                <div className="flex items-center w-[95%] h-[10%] mt-3">
                    <div className="border border-gray-400 rounded-lg flex-grow p-2">
                        <input
                            className="w-full h-full outline-none bg-transparent text-lg"
                            placeholder="Type here..."
                            value={inputValue}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        className="ml-3 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
                        onClick={sendMessage}
                    >
                        <IoIosSend className="w-6 h-6" />
                    </button>
                </div>
                <div className="w-1/2 mt-3 mx-auto">
                    <input
                        className="w-full border border-gray-400 rounded-lg p-2 text-lg outline-none bg-gray-50 text-center"
                        placeholder="Enter username..."
                        value={nameValue}
                        onChange={handleNameChange}
                    />
                </div>
            </div>
        </div>

    )
}

// for sake of demo
function FindGame(gameId: number) {
    return GAMES.find(game => game.id === gameId) ?? { id: -1, homeTeam: "N/A", awayTeam: "N/A" };
}

export default LiveChat;