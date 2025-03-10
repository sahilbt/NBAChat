import { SetStateAction, useState } from 'react';
import { IoIosSend } from "react-icons/io";
import messages from './messages.json';
import Message from "./Message";

const LiveChat = () =>{
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        console.log(inputValue)
    }

    const sendMessage = (e: React.MouseEvent) => {
        console.log("Send Message")
    }

    return (
        <div className="border border-black h-full w-[70%] flex flex-col items-center">
            {/* game titles */}
            <h1 className="text-4xl pb-[1%] pt-[2%] font-bold"> Portland Trailblazers vs Los Angeles Lakers </h1>
            <h1 className="text-3xl pb-[3%]"> Game thread #1 </h1>

            {/* chat area -> might need to make it a seperate component*/}
            <div className="border black h-[65%] w-[90%] pt-[1%] pl-[1%] mb-[4%] overflow-y-auto max-h-[65%]">
                {messages.map((message) => (
                    <Message 
                        user={message.name}
                        content={message.content}
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


        </div>
    )
}

export default LiveChat;