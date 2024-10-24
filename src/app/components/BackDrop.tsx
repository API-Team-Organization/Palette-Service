import './scss/BackDrop.scss'
import React, {FC} from "react";
import {useModalStore} from "@/app/store/useStore";

interface BackDropProps {
    children: React.ReactNode;
}

const BackDrop: FC<BackDropProps> = ({ children }) => {
    const { isOpen, setOpen } = useModalStore();

    return (
        <div
            className="modal-backdrop"
            onClick={() => setOpen(!isOpen)}
        >
            <div onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default BackDrop;
