import SideBar from "@/app/components/SideBar";

const ChatLayout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <SideBar />
            {children}
        </>
    )
}

export default ChatLayout;
