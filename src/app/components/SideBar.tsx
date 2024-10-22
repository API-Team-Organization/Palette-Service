'use client';

import './scss/SideBar.scss';
import WriteSVG from "@/app/components/svgs/WriteSVG";
import Image from "next/image";
import Logo from '../../../public/Images/Logo.png';
import HamburgerSVG from "@/app/components/svgs/HamburgerSVG";
import {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import {FiMoreHorizontal} from "react-icons/fi";
import UtilBox from "@/app/components/UtilBox";

interface Room {
    id: number;
    title: string;
    // 필요한 다른 속성들...
}

const SideBar = () => {
    const [roomLists, setRoomLists] = useState<Room[] | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null); // Track which room's UtilBox is open

    useEffect(() => {
        const getRoomLists = async () => {
            try {
                await axios.get<{ code: number, data: Room[] }>(`${process.env.NEXT_PUBLIC_API_URL}/room/list`, {
                    headers: {
                        'x-auth-token': Cookies.get('token')
                    }
                }).then((res) => {
                    if (res.data.code === 401) {
                        alert('세션이 만료되었습니다.');
                        Cookies.remove('token');
                        window.location.href = '/auth/login';
                    }

                    if (res.data.code === 200) {
                        setRoomLists(res.data.data.reverse());
                    }
                })
            } catch (err) {
                console.error('방 목록을 가져오는 중 오류 발생:', err);
            }
        };

        // Session refresh logic
        const refreshSession = setInterval(async () => {
            try {
                await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`, {
                    headers: {
                        'x-auth-token': Cookies.get('token')
                    }
                });
            } catch (err) {
                alert('세션이 만료되었습니다.');
                Cookies.remove('token');
                window.location.href = '/auth/login';
            }
        }, 40000);

        getRoomLists();

        return () => clearInterval(refreshSession); // Clear interval on unmount
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
            });
        } catch (err) {
            console.error('채팅 목록을 가져오는 중 오류 발생:', err);
        }
    };

    console.log(selectedRoom)

    return (
        <div className={`sideBarContainer`}>
            <div className={`topIconBox`}>
                {/*<div className={`iconBox`}>*/}
                {/*    <SidebarSVG />*/}
                {/*</div>*/}
                <div className={`iconBox`} onClick={submitHandler}>
                    <WriteSVG />
                </div>
            </div>
            <div className={`subBox`}>
                <Link href={'/'} className={`listBox`} style={{ textDecorationLine: 'none' }}>
                    <Image src={Logo} alt={'Logo'} />
                    <h1>Palette</h1>
                </Link>
                <Link href={'/storagebox'} className={`listBox`} style={{ textDecorationLine: 'none' }}>
                    <HamburgerSVG />
                    <h1>홍보물 보관함</h1>
                </Link>
            </div>
            <div className={`roomBox`}>
                {roomLists && roomLists.map((room, idx) => (
                    <div key={idx}>
                        <div className={`room`}>
                            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                <Link href={`/chat/${room.id}`} style={{textDecorationLine: 'none'}}>
                                    <h2>{room.title}</h2>
                                </Link>
                                <div
                                    className={`utilBox`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedRoom(selectedRoom === room.id ? null : room.id);
                                    }}
                                >
                                    <FiMoreHorizontal className={`icon`} size={18}/>
                                </div>
                            </div>
                            <UtilBox
                                visible={selectedRoom === room.id}
                                setVisible={(visible) => visible ? setSelectedRoom(room.id) : setSelectedRoom(null)}
                                roomId={room.id}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SideBar;
