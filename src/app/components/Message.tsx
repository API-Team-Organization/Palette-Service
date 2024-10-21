'use client';

import './scss/Message.scss'

import {FC, useState} from "react";
import Image from "next/image";
import ImageViewer from "@/app/components/ImageViewer";

interface MessageProps {
    message: string;
    action: string;
    isAI: string;
    datetime: Date;
}

const Message: FC<MessageProps> = ({ message, action, isAI, datetime }) => {
    function formatTime(date: Date): string {
        let hours = date.getHours();
        const minutes = date.getMinutes();

        const isPM = hours >= 12;
        hours = hours % 12 || 12;  // 12시간제로 변경

        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // 분이 한자리일 경우 앞에 0 추가

        return `${isPM ? '오후' : '오전'} ${hours}:${formattedMinutes}분`;
    }
    const [isOpen, setOpen] = useState(false)

    return (
        <div className={`message-container ${isAI ? 'ai' : ''}`} style={isAI ? { maxWidth: '42rem' } : {}}>
            { isOpen && <ImageViewer url={message} /> }
            {
                action === 'IMAGE' ? <Image onClick={() => setOpen(!isOpen)} src={message} alt={'ai-image'} className={`image`} width={250} height={250}
                                            unoptimized={true}/>:
                    <div style={{ display: "flex", alignItems: 'end' }}>
                        {!isAI ? <p style={{
                            fontSize: '1.25rem',
                            whiteSpace: 'nowrap',
                            color: '#797979',
                            marginTop: '0.8rem',
                            marginRight: '0.8rem',
                            position: 'static'
                        }}>{formatTime(new Date(datetime))}</p> : null}
                        <h1 style={{background: isAI ? 'black' : '#4762f5'}}>{message}</h1>
                        {isAI ? <p style={{
                            fontSize: '1.25rem',
                            whiteSpace: 'nowrap',
                            color: '#797979',
                            marginTop: '0.8rem',
                            marginLeft: '0.8rem',
                        }}>{formatTime(new Date(datetime))}</p> : null}
                    </div>
            }
        </div>
    )
}

export default Message
