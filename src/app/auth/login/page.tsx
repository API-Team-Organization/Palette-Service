'use client'

import './login.scss'

import {useState} from "react";
import axios from "axios";


export default function login () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailPattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}\$/
    const passwordPattern = /.*(?=^.{8,15}\$)(?=.*\\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*\$/

    const submitHandler = async (e: any) => {
        try {
            e.preventDefault()

            if (!emailPattern.test(email)) {
                alert('이메일 형식이 올바르지 않습니다.')
            }
            if (!passwordPattern.test(password)) {
                alert('비밀번호 형식이 올바르지 않습니다.')
            }

            if (emailPattern.test(email) && passwordPattern.test(password)) {
                const res = await axios.post(`${process.env.API_URL}/auth/login`, {
                    email,
                    password
                });
            }
        } catch (err) {
            throw new Error('로그인에 실패했습니다.')
        }
    }

    return (
        <section>
            <h1>Palette에 로그인하기.</h1>
            <form onSubmit={submitHandler}>
                <div>
                    <label>아이디</label>
                    <input type={"text"} placeholder={'이메일'} value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div>
                    <label>비밀번호</label>
                    <input type={"text"} placeholder={'이메일'} value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
            </form>
            <p>계정이 없으신가요? <span>회원 가입</span></p>
        </section>
    )
}
