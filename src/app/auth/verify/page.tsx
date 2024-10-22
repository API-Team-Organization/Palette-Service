'use client'

import './verify.scss'
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";

export default function Page() {
  const [inputValues, setInputValues] = useState(['', '', '', '', '', '']);

  // Handle input change and move focus to the next input field
  // @ts-ignore
  const handleInputChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 1) return; // prevent more than one digit in input

    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);

    // Move focus to the next input if there's a value
    if (value && index < 5) {
      // @ts-ignore
      document.getElementById(`num-${index + 2}`).focus();
    }
  };

  const codeRegen = async (e: any) => {
    e.preventDefault()
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend`, {
        headers: { 'x-auth-token': Cookies.get('token') }
      })
          .then((res) => {
            console.log(res.data)
          })
    } catch (err) {
      throw new Error(`${err}`)
    }
  }

  const verify = async (e: any) => {
    e.preventDefault()
    try {
      if (inputValues.length < 5) return;
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
        code: `${inputValues[0]}${inputValues[1]}${inputValues[2]}${inputValues[3]}${inputValues[4]}${inputValues[5]}`
      }, {
        headers: { 'x-auth-token': Cookies.get('token') }
      })
          .then((res) => {
            if (res.data.code === 200) {
              window.location.href = '/'
            }
          })
    } catch (err) {
      throw new Error(`${err}`)
    }
  }

  return (
      <section className={`login-container`}>
        <div className={`logo`}>
          <Image src={'/Images/Logo.png'} alt={'Logo'} width={60} height={60}/>
        </div>
        <h1>Palette에 인증하기</h1>
        <form onSubmit={() => {}} className={`formBox`}>
          <div className={`verifyBox`}>
            {inputValues.map((value, index) => (
                <input
                    key={index}
                    type="text"
                    id={`num-${index + 1}`}
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleInputChange(e, index)}
                />
            ))}
          </div>
          <div className={`btnBox`}>
            <button onClick={(e) => codeRegen(e)}>코드 다시생성</button>
            <button onClick={(e) => verify(e)}>인증하기</button>
          </div>
        </form>
      </section>
  );
};
