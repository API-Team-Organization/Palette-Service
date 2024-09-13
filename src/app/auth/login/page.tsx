'use client';

import './login.scss'
import axios from "axios";
import TextInput from "@/app/components/TextInput";
import Image from "next/image";
import Link from "next/link";
import Cookies from 'js-cookie';
import {useState} from "react";

export default function login () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailPattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/
    const passwordPattern = /[a-zA-Z0-9!@#\$%\^\&\*,.<>~]{8,32}/

    const submitHandler = async (e: any) => {
        try {
            e.preventDefault()

            if (!emailPattern.test(email)) {
                alert('이메일 형식이 올바르지 않습니다.')
                return;
            }
            if (!passwordPattern.test(password)) {
                alert('비밀번호 형식이 올바르지 않습니다.')
                return;
            }

            if (emailPattern.test(email) && passwordPattern.test(password)) {
                try {
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        email,
                        password
                    });

                    if (res.data.code === 200) {
                        alert('로그인에 성공했습니다.')
                        Cookies.set('token', res.headers["x-auth-token"], { expires: 18000 })
                        window.location.href = '/'
                    }
                } catch (err) {
                    alert('로그인에 실패했습니다.')
                }
            }
        } catch (err) {
            throw new Error('클라이언트에서 에러가 발생했습니다.')
        }
    }

    return (
        <section className={`login-container`}>
            <div className={`logo`}>
                <Image src={'/Images/Logo.png'} alt={'Logo'} width={60} height={60} />
            </div>
            <h1>Palette에 로그인하기</h1>
            <form onSubmit={submitHandler}>
                <div className={`inputListBox`}>
                    <TextInput title={'이메일'} state={email} setState={setEmail} required={true} />
                    <TextInput title={'패스워드'} type={'password'} state={password} setState={setPassword} required={true} />
                </div>
                <button className={`loginBtn`}><h2>로그인</h2></button>
            </form>
            <p className={`signup`}>계정이 없으신가요? <span className={`link`}><Link href={'/auth/register'}>회원가입</Link></span></p>
            <p className={`term`}>이용약관 <span className={`divider`}>|</span> 개인정보 보호 정책</p>
        </section>
    )
}
