import { FC } from 'react';

interface MessageContent {
    user: string;
    content: string;
}

const Message: FC<MessageContent>  = (props) =>{
    return (
        <div className="h-[10%] w-full">
            <p>{props.user}: {props.content}</p>
        </div>
    )
}

export default Message;