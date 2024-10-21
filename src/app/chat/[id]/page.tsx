'use client'

import './Chat.scss'

import Image from "next/image";
import SearchBar, {SearchType} from "@/app/components/SearchBar";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {io} from 'socket.io-client'
import axios from "axios";
import Message from "@/app/components/Message";
import SelectPicker from "@/app/components/SelectPicker";
import GridBtn from "@/app/components/GridBtn";
import {useGridStore} from "@/app/store/useStore";

export default function Page ({ params }: { params: { slug: string } }) {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [submitted, setSubmitted] = useState(true);
    const [messageList, setMessageList] = useState<{ message: string; action: string; isAi: string, promptId: string, datetime: Date }[]>([]);
    const [qna, setQna] = useState([]);
    const [displayQna, setDisplayQna] = useState<string | null>(null);
    const status = qna.find(it => messageList[7]?.promptId == it.id) != null;
    const grid = useGridStore(state => state.grid);
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState(0);
    const [op, setOp] = useState(0);
    let x = qna[4]?.question.xSize;
    let y = qna[4]?.question.ySize;
    let max = qna[4]?.question.maxCount;

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
                setMessageList((prevState) => [...prevState, { message: message.message, action: message.resource, isAi: message.isAi, promptId: message.promptId, datetime: message.datetime }])
            });
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
        }
    };

    const getQna = async () => {
        try {
            await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/room/${params?.id}/qna`, {
                headers: {
                    'x-auth-token': Cookies.get('token')
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    setQna(res.data.data)
                }
            });
        } catch (err) {
            console.error('QnA를 가져오는 중 오류 발생:', err);
        }
    }

    const setDisplay = async (id: string) => {
        setDisplayQna(id)
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat?roomId=${params?.id}`, {
                data: {
                    type: "SELECTABLE",
                    "choiceId": id
                }
            }, {
                headers: {
                    'x-auth-token': Cookies.get('token')
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    console.log("asdf")
                    if (pos === 1) {
                        setOp(1)
                    } else {
                        setPos(1)
                    }
                    setSubmitted(false)
                }
            });
        } catch (err) {
            console.error('QnA를 가져오는 중 오류 발생:', err);
        }
    }

    useEffect(() => {
        connectWebSocket().catch(console.error);
        getChatLists().catch(console.error);
        getQna().catch(console.error);
    }, []);

    const submitHandler = async (e: any) => {
        e.preventDefault();
        try {
            // @ts-ignore
           await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat?roomId=${params?.id}`, {
                data: {
                    type: "USER_INPUT",
                    input: message
                }
            }, {
                headers: {
                    'x-auth-token': Cookies.get('token')
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    setSubmitted(false)
                    setMessage('')
                }
            });
        } catch (err) {
            alert('이미 모든 질문에 대해 대답하였습니다')
        }
    }

    const clickHandler = async () => {
        try {
            if (grid.length <= max) {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat?roomId=${params?.id}`, {
                    data: {
                        type: "GRID",
                        choice: grid
                    }
                }, {
                    headers: {
                        'x-auth-token': Cookies.get('token')
                    }
                }).then((res) => {
                    if (res.data.code === 200) {
                        setOpen(true)
                    }
                });
            } else {
                alert('최대 선택 가능한 개수를 초과하였습니다.')
            }

        } catch (err) {
            throw new Error(`${err}`)
        }
    }

    // console.log(qna)
    console.log(messageList)
    // console.log(open)
    // console.log(max)
    // console.log(grid)
    // console.log(x, y)
    console.log(displayQna)
    console.log(status)
    console.log(pos)
    // @ts-ignore
    const filteredQna = qna.filter((item) => item?.answer !== null);

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
                        <Message message={chat.message} datetime={chat.datetime} action={chat.resource} isAI={chat.isAi} key={idx}/>
                    )
                })}
                {messageList.map((message, idx) => {
                    return (
                        <Message message={message.message} datetime={message.datetime} action={message.action} isAI={message.isAi} key={idx}/>
                    )
                })}
            </div>
            <GridBtn status={open ? false : status} fn={clickHandler} x={x} y={y} />
            <div className={`qna-display`} style={filteredQna.length != 0 || op != 0 ? { display: 'none' }: {} }>
                {
                    qna[pos]?.question.choices.map((qna: any, idx: number) => {
                        return (
                            <button className={`displayBtn`} onClick={() => setDisplay(qna.id)} key={idx}>{qna.displayName}</button>
                        )
                    })
                }
            </div>
            <form onSubmit={submitHandler}>
                <SearchBar message={message} setMessage={setMessage} isDisabled={submitted} type={SearchType.INPUT}/>
            </form>
        </main>
    )
}
