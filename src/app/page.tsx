'use client'

import './components/scss/Chat.scss'

import Image from "next/image";
import Logo from '../../public/Images/Logo.png'
import SearchBar from "@/app/components/SearchBar";
import SideBar from "@/app/components/SideBar";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";

export default function Home() {
    useEffect(() => {
        if (!Cookies.get('token')) {
            window.location.href = '/auth/login'
        }
    }, []);

  return (
      <>
          <SideBar />
          <main className={`chat-container`}>
              <div className={`chatHeader`}>
                  <h1>Palette.AI</h1>
                  <div className={`profile`}>
                      <Image src={''} alt={''}/>
                  </div>
              </div>
              <div className={`Logo`}>
                  <Image src={Logo} alt={'logo'} width={100}/>
              </div>
              <form>
                  <SearchBar/>
              </form>
          </main>
      </>
  );
}
