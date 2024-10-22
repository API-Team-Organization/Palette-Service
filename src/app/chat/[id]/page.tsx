'use client'

import './Chat.scss'
import SearchBar from "@/app/components/SearchBar";
import {useCallback, useEffect, useState} from "react";
import Cookies from "js-cookie";
import {io, Socket} from 'socket.io-client'
import axios from "axios";
import Message from "@/app/components/Message";
import GridBtn from "@/app/components/GridBtn";
import {useGridStore} from "@/app/store/useStore";
import {ToastContainer, toast, Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MessageItem {
    message: string;
    resource: any;
    isAi: string;
    promptId: string;
    datetime: Date;
    type: string;
    position: number;
}

interface QnaItem {
    id: string;
    question: {
        xSize: number;
        ySize: number;
        maxCount: number;
        choices: { id: string; displayName: string }[];
    };
    answer: any;
}

interface ToastType {
    type: "QUEUE_POSITION_UPDATE"
}

const useChat = (roomId: string) => {
    const [chat, setChat] = useState([]);
    const [messageList, setMessageList] = useState<MessageItem[]>([]);
    const [qna, setQna] = useState<QnaItem[]>([]);

    const getChatLists = useCallback(async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/${roomId}?page=0&size=20`, {
                headers: { 'x-auth-token': Cookies.get('token') }
            });
            if (res.data.code === 200) {
                setChat(res.data.data.reverse());
            }
        } catch (err) {
            console.error('Error fetching chat list:', err);
        }
    }, [roomId]);

    const getQna = useCallback(async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/room/${roomId}/qna`, {
                headers: { 'x-auth-token': Cookies.get('token') }
            });
            if (res.data.code === 200) {
                setQna(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching QnA:', err);
        }
    }, [roomId]);

    const connectWebSocket = useCallback(() => {
        const socket: Socket = io(`localhost:3336/conversion`, {
            transports: ['websocket'],
        });

         socket.on('connect', () => {
            console.log('Socket connected');
            socket.emit('wstoio', {
                roomId: roomId,
                token: Cookies.get('token')
            });
        });

        socket.on('message', (message: MessageItem) => {
            setMessageList((prevState) => [...prevState, { message: message.message,
                resource: message.resource,
                isAi: message.isAi,
                promptId: message.promptId,
                datetime: message.datetime,
                type: message.type,
                position: message.position,
            }])
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        const socketCleanup = connectWebSocket();
        getChatLists();
        getQna();

        return socketCleanup;
    }, [connectWebSocket, getChatLists, getQna]);

    return { chat, messageList, qna, setMessageList };
};

export default function Page({ params }: { params: { id: string } }) {
    const [message, setMessage] = useState('');
`    // const [displayQna, setDisplayQna] = useState<string | null>(null);`
    const grid = useGridStore(state => state.grid);
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState(0);
    const [op, setOp] = useState(0);

    const { chat, messageList, qna, setMessageList } = useChat(params.id);
    const [submitted, setSubmitted] = useState(chat.length > 3);

    const status = qna.find(it => messageList[7]?.promptId == it.id) != null;
    const { xSize: x, ySize: y, maxCount: max } = qna[4]?.question || {};

    const setDisplay = useCallback(async (id: string) => {
        // setDisplayQna(id);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat?roomId=${params.id}`, {
                data: { type: "SELECTABLE", choiceId: id }
            }, {
                headers: { 'x-auth-token': Cookies.get('token') }
            });

            if (res.data.code === 200) {
                setPos(prev => prev === 1 ? prev : 1);
                setOp(prev => pos === 1 ? 1 : prev);
                setSubmitted(false);
            }
        } catch (err) {
            console.error('Error setting display:', err);
        }
    }, [params.id, pos]);

    const submitHandler = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat?roomId=${params.id}`, {
                data: { type: "USER_INPUT", input: message }
            }, {
                headers: { 'x-auth-token': Cookies.get('token') }
            });

            if (res.data.code === 200) {
                setSubmitted(false);
                setMessage('');
            }
        } catch (err) {
            alert('All questions have been answered');
        }
    }, [message, params.id]);

    const clickHandler = useCallback(async () => {
        if (grid.length > max) {
            alert('Maximum selectable count exceeded.');
            return;
        }

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat?roomId=${params.id}`, {
                data: { type: "GRID", choice: grid }
            }, {
                headers: { 'x-auth-token': Cookies.get('token') }
            });

            if (res.data.code === 200) {
                setOpen(true);
            }
        } catch (err) {
            console.error('Error in click handler:', err);
        }
    }, [grid, params.id]);

    const ImageRegen = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/room/${params.id}/regen`, {}, {
                headers: { 'x-auth-token': Cookies.get('token') }
            })
        } catch (err) {
            throw new Error(`${err}`)
        }
    }

    const filteredChat = chat.filter((item) => item.resource === 'IMAGE')
    const filteredQna = qna.filter((item) => item?.answer !== null);
    const filterQueueList = messageList.filter((item) => item.position !== undefined);

    console.log(filteredChat)

    useEffect(() => {
        if (filterQueueList.length > 0) {
            const lastItemPosition = filterQueueList[filterQueueList.length - 1]?.position;
            toast.info(`앞에 사용자: ${lastItemPosition}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
                style: {fontSize: 16}
            });

            if (lastItemPosition === 0) {
                toast.success(`생성중... 잠시만기다려주세요.`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                    delay: 1000,
                    style: {fontSize: 16}
                });
            }
        }
    }, [filterQueueList]);

    console.log(messageList)

    return (
        <main className="chat-container">
            <ToastContainer />
            <div className="chatHeader">
                <h1>Palette</h1>
                <div className="profile">
                </div>
            </div>
            <div className="chat">
                {chat.map((chat: any, idx: number) => {
                    return (
                        <Message message={chat.message} datetime={chat.datetime} action={chat.resource} isAI={chat.isAi} key={idx}/>
                    )
                })}
                {messageList
                    .filter((item) => item.type != "QUEUE_POSITION_UPDATE")
                    .map((message, idx) => (
                        <Message message={message.message} datetime={message.datetime} action={message.resource} isAI={message.isAi} key={idx}/>
                    ))}
            </div>
            <GridBtn status={!open && status} fn={clickHandler} x={x} y={y} />
            <div className="qna-display" style={{ display: filteredQna.length !== 0 || op !== 0 ? 'none' : 'flex' }}>
                {qna[pos]?.question.choices.map((qnaItem: any, idx: number) => (
                    <button className="displayBtn" onClick={() => setDisplay(qnaItem.id)} key={`qna-${idx}`}>
                        {qnaItem.displayName}
                    </button>
                ))}
            </div>
            <form onSubmit={submitHandler} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                {(filteredChat.length > 0 || messageList[messageList.length-1]?.resource === "IMAGE") ? <div onClick={ImageRegen} className={`queueBox`}>Image Regen</div> : filterQueueList.length > 0 && <div className={`queueBox`}>{filterQueueList[filterQueueList.length-1]?.position === 0 ? '그리는 중..' : `앞에 있는
                    사용자: ${filterQueueList[filterQueueList.length-1]?.position}`}</div>}
                <SearchBar message={message} setMessage={setMessage} isDisabled={submitted}/>
            </form>
        </main>
    );
}
