import './scss/Message.scss'

import {FC} from "react";
import Image from "next/image";

interface MessageProps {
    message: string;
    action: string;
    isAI: string;
}

const Message: FC<MessageProps> = ({ message, action, isAI }) => {
    return (
        <div className={`message-container ${isAI ? 'ai' : ''}`}>
            {
                action === 'IMAGE' ? <Image src={message} alt={'ai-image'} className={`image`} width={250} height={250}
                                            unoptimized={true}/> :
                    <h1 style={{background: isAI ? 'black' : '#4762f5'}}>{message}</h1>
            }
        </div>
    )
}

export default Message
