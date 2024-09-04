import './scss/SideBar.scss'

import SidebarSVG from "@/app/components/svgs/SidebarSVG";
import WriteSVG from "@/app/components/svgs/WriteSVG";
import Image from "next/image";
import Logo from '../../../public/Images/Logo.png'
import HamburgerSVG from "@/app/components/svgs/HamburgerSVG";

const SideBar = () => {
    return (
        <div className={`sideBarContainer`}>
            <div className={`topIconBox`}>
                <div className={`iconBox`}>
                    <SidebarSVG/>
                </div>
                <div className={`iconBox`}>
                    <WriteSVG />
                </div>
            </div>
            <div className={`subBox`}>
                <div className={`listBox`}>
                    <Image src={Logo} alt={'Logo'} />
                    <h1>Palette</h1>
                </div>
                <div className={`listBox`}>
                    <HamburgerSVG />
                    <h1>서비스 탐색</h1>
                </div>
            </div>
        </div>
    )
}

export default SideBar;
