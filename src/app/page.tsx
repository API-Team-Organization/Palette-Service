'use client'

import './components/scss/Chat.scss'
import Image from "next/image";
import Logo from '../../public/Images/Logo.png'
import SearchBar, {SearchType} from "@/app/components/SearchBar";
import SideBar from "@/app/components/SideBar";
import React, {useEffect} from "react";
import Cookies from "js-cookie";
import axios from "axios";

export default function Home() {
    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            window.location.href = '/auth/login';
            return;
        }
        console.log(token);
    }, []);

    const submitHandler = async (e: any) => {
        e.preventDefault();
        const token = Cookies.get('token');

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/room`, {}, {
                headers: {
                    'x-auth-token': token
                }
            }).then((res) => {
                if (res.data.code === 200) {
                    window.location.href = `/chat/${res.data.data.id}`;
                }
            })
        } catch (err) {
            console.error('채팅 목록을 가져오는 중 오류 발생:', err);
        }
    }

    return (
        <>
            <SideBar />
            <main className="chat-container">
                <div className="chatHeader">
                    <h1>Palette</h1>
                    <div className="profile">
                    </div>
                </div>
                <div className="Logo">
                    <Image src={Logo} alt="Logo" width={100} height={100} />
                </div>
                <form onSubmit={submitHandler}>
                    <SearchBar type={SearchType.BUTTON} />
                </form>
            </main>
        </>
    );
}
