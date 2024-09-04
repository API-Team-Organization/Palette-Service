import './scss/SearchBar.scss'
import UploadSVG from "@/app/components/svgs/UploadSVG";

const SearchBar = () => {
    return (
        <div className={`search-container`}>
            <input type={"text"} placeholder={"메세지 Palette.AI"}/>
            <div className={`round`}>
                <UploadSVG />
            </div>
        </div>
    )
}

export default SearchBar;
