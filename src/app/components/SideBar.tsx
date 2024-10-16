'use client';

import './scss/SideBar.scss'

import SidebarSVG from "@/app/components/svgs/SidebarSVG";
import WriteSVG from "@/app/components/svgs/WriteSVG";
import Image from "next/image";
import Logo from '../../../public/Images/Logo.png'
import HamburgerSVG from "@/app/components/svgs/HamburgerSVG";
import {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";

interface Room {
    id: number;
    title: string;
    // 필요한 다른 속성들...
}

const SideBar = () => {
    const [roomLists, setRoomLists] = useState<Room[] | null>(null);

    useEffect(() => {
        const getRoomLists = async () => {
            try {
                const res = await axios.get<{code: number, data: Room[]}>(`${process.env.NEXT_PUBLIC_API_URL}/room/list`, {
                    headers: {
                        'x-auth-token': Cookies.get('token')
                    }
                });

                if (res.data.code === 200) {
                    setRoomLists(res.data.data);
                }
            } catch (err) {
                console.error('방 목록을 가져오는 중 오류 발생:', err);
            }
        }

        setInterval(() => {
            const refreshSession = async () => {
                try {
                    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`, {
                        headers: {
                            'x-auth-token': Cookies.get('token')
                        }
                    });
                } catch (err) {
                    alert('세션이 만료되었습니다.')
                    Cookies.remove('token')
                    window.location.href = '/auth/login';
                }
            }

            refreshSession();
        }, 40000)

        getRoomLists();
    }, []);

    const submitHandler = async () => {
        let token = Cookies.get('token');

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
        <div className={`sideBarContainer`}>
            <div className={`topIconBox`}>
                <div className={`iconBox`}>
                    <SidebarSVG/>
                </div>
                <div className={`iconBox`} onClick={submitHandler}>
                    <WriteSVG />
                </div>
            </div>
            <div className={`subBox`}>
                <Link href={'/'} className={`listBox`} style={{ textDecorationLine: 'none' }}>
                    <Image src={Logo} alt={'Logo'} />
                    <h1>Palette</h1>
                </Link>
                <div className={`listBox`}>
                    <HamburgerSVG />
                    <h1>서비스 탐색</h1>
                </div>
            </div>
            <div className={`roomBox`}>
                {roomLists && roomLists.reverse().map((room) => (
                    <Link key={room.id} href={`/chat/${room.id}`} style={{ textDecorationLine: 'none' }}>
                        <div className={`room`}>
                            <h2>{room.title}</h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SideBar;
