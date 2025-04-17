import { FC } from 'react';

interface MessageContent {
    user: string;
    content: string;
}

// format of messages showing user and the message the user sent
const Message: FC<MessageContent> = (props) => {
    return (
        <div className="h-[10%] w-full">
            <p>{props.user}: {props.content}</p>
        </div>
    )
}

export default Message;