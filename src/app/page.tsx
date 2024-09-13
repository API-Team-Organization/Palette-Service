'use client'

import './components/scss/Chat.scss'
import Image from "next/image";
import Logo from '../../public/Images/Logo.png'
import SearchBar from "@/app/components/SearchBar";
import SideBar from "@/app/components/SideBar";
import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export default function Home() {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            window.location.href = '/auth/login';
            return;
        }
        console.log(token);
    }, []);

    const createRoom = async (token: string) => {
        const headers = { 'x-auth-token': token };
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/room`, {}, { headers });
        if (res.data.code !== 200) throw new Error(`Room creation failed: ${res.data.message}`);
        return res.data.data.id;
    };

    const updateRoomTitle = async (token: string, roomId: string, title: string) => {
        const headers = { 'x-auth-token': token };
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/room/title`, { id: roomId, title }, { headers });
    };

    const sendChat = async (token: string, roomId: string, message: string) => {
        const headers = { 'x-auth-token': token };
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat?roomId=${roomId}`, { message }, { headers });
    };

    const submitHandler = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const token = Cookies.get('token');
        if (!token || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const roomId = await createRoom(token);
            await updateRoomTitle(token, roomId, message);
            await sendChat(token, roomId, message);
            window.location.href = `/chat/${roomId}`;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                alert(err.response?.data?.message || err.message);
            } else {
                alert('An error occurred on the client.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [message, isSubmitting]);

    return (
        <>
            <SideBar />
            <main className="chat-container">
                <div className="chatHeader">
                    <h1>Palette.AI</h1>
                    <div className="profile">
                        <Image src={''} alt={''} width={50} height={50} />
                    </div>
                </div>
                <div className="Logo">
                    <Image src={Logo} alt="Logo" width={100} height={100} />
                </div>
                <form onSubmit={submitHandler}>
                    <SearchBar message={message} setMessage={setMessage} />
                </form>
            </main>
        </>
    );
}
