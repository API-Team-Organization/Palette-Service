import SideBar from "@/app/components/SideBar";

const StorageLayout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <SideBar />
            {children}
        </>
    )
}

export default StorageLayout;
