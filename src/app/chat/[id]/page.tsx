'use client'

import './Chat.scss'

import Image from "next/image";
import SearchBar from "@/app/components/SearchBar";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import { io } from 'socket.io-client'
import axios from "axios";
import Message from "@/app/components/Message";

export default function Page ({ params }: { params: { slug: string } }) {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [messageList, setMessageList] = useState<{ message: string; action: string; isAi: string }[]>([]);

    const getChatLists = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/${params?.id}?page=0&size=20`, {
                headers: {
                    'x-auth-token': Cookies.get('token')
                }
            });

            if (res.data.code === 200) {
                setChat(res.data.data.reverse())
            }
        } catch (err) {
            console.error('채팅 목록을 가져오는 중 오류 발생:', err);
        }
    }
    const connectWebSocket = async () => {
        try {
            const socket = io(`localhost:3336/conversion`, {
                transports: ['websocket'],
            })

            socket.on('connect', () => {
                console.log('Socket connected');
            });

            socket.emit('wstoio', {
                roomId: params?.id,
                token: Cookies.get('token')
            })

            socket.on('message', (message) => {
                if (message.data.action === 'END') {
                    console.log('Conversion completed');
                    socket.disconnect();
                } else {
                    setMessageList((prevState) => [...prevState, { message: message.data.message.message, action: (message.data.action === 'TEXT' || message.data.action === 'START') ? 'CHAT' : 'IMAGE', isAi: message.data.message.isAi }])
                }
            });
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
        }
    };

    useEffect(() => {
        getChatLists();
        connectWebSocket();
    }, []);

    const submitHandler = async (e: any) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat?roomId=${params?.id}`, { message }, {
                headers: {
                    'x-auth-token': Cookies.get('token')
                }
            });

            if (!(res.status === 200)) {
                throw new Error(`메시지 전송에 실패했습니다. ${res.data.message}`)
            }
        } catch (err) {
            throw new Error(`클라이언트에서 에러가 발생했습니다. ${err}`)
        }
    }

    console.log(messageList)

    return (
        <main className={`chat-container`}>
            <div className={`chatHeader`}>
                <h1>Palette.AI</h1>
                <div className={`profile`}>
                    <Image src={''} alt={''}/>
                </div>
            </div>
            <div className={`chat`}>
                {chat.map((chat: any, idx: number) => {
                    return (
                        <Message message={chat.message} action={chat.resource} isAI={chat.isAi} key={idx} />
                    )
                })}
                {messageList.map((message, idx) => {
                    return (
                        <Message message={message.message} action={message.action} isAI={message.isAi} key={idx} />
                    )
                })}
            </div>
            <form onSubmit={submitHandler} onDisab>
                <SearchBar message={message} setMessage={setMessage}/>
            </form>
        </main>
    )
}
