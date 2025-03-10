import { SetStateAction, useState, useEffect, useRef } from 'react';
import { IoIosSend } from "react-icons/io";
import messages from './messages.json';
import Message from "./Message";

const LiveChat = () =>{
    const [nameValue, setNameValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<JSON[]>([]);
    const sendSocketRef = useRef<WebSocket | null>(null); 
    const receiveSocketRef = useRef<WebSocket | null>(null); 
    const isClosingOrClosed = useRef(false); 

    useEffect(() => {
        // Socket to send messages
        sendSocketRef.current = new WebSocket("ws://localhost:8000/messages/send-message");
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
        
        //Socket to recieve messages
        receiveSocketRef.current = new WebSocket("ws://localhost:8000/messages/get-all-messages");
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

    return (
        <div className="border border-black h-full w-[70%] flex flex-col items-center">
            {/* game titles */}
            <h1 className="text-4xl pb-[1%] pt-[2%] font-bold"> Portland Trailblazers vs Los Angeles Lakers </h1>
            <h1 className="text-3xl pb-[3%]"> Game thread #1 </h1>

            {/* chat area -> might need to make it a seperate component*/}
            <div className="border black h-[65%] w-[90%] pt-[1%] pl-[1%] mb-[4%] overflow-y-auto max-h-[65%]">
                {messages.map((message: any) => (
                    <Message 
                        user={message.user}
                        content={message.text}
                    />
                ))}
            </div>

            {/* messaging area */}
            <div className="flex h-[10%] w-[90%] mb-[2%]">
                <div className="border w-[90%] mr-[2%]">
                <label>
                    <input 
                        className="text-1xl pl-[2%] pr-[2%] w-full h-full" 
                        placeholder='Type here...'
                        value={inputValue}
                        onChange={handleChange}
                    />
                </label>
                </div>
                <div className="w-[5%]">
                    <IoIosSend 
                        className="active:scale-120 w-full h-full"
                        onClick={sendMessage}
                    />
                </div>
            </div>
            <div className="border border-black mb-[2%]">
            <input 
                className="border-none pl-[3%] pr-[3%] w-full " 
                placeholder='Enter username here...'
                value={nameValue}
                onChange={handleNameChange}
                />
            </div>
        </div>
    )
}

export default LiveChat;