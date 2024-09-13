import './scss/SearchBar.scss'
import UploadSVG from "@/app/components/svgs/UploadSVG";
import {FC} from "react";

interface SearchBarProps {
    message: string;
    setMessage: (message: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ message, setMessage }) => {
    return (
        <div className={`search-container`}>
            <input type={"text"} disabled={true} placeholder={"메세지 Palette.AI"} value={message} onChange={(e) => setMessage(e.target.value)} />
            <div className={`round`}>
                <UploadSVG />
            </div>
        </div>
    )
}

export default SearchBar;
