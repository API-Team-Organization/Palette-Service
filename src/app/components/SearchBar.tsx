import './scss/SearchBar.scss';
import UploadSVG from "@/app/components/svgs/UploadSVG";
import React, { FC } from 'react';

export enum SearchType {
  INPUT = "input",
  BUTTON = "button",
}

interface SearchBarProps {
  message?: string;
  setMessage?: (message: string) => void;
  isDisabled?: boolean;
  type: SearchType;
  fn?: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onSearch?: () => void;
}

const SearchBar: FC<SearchBarProps> = ({
                                         message = '',
                                         setMessage,
                                         isDisabled = false,
                                         type,
                                         onSearch,
                                         fn
                                       }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage?.(e.target.value);
  };

  const handleButtonClick = () => {
    onSearch?.();
  };

  return (
      <div className="search-container">
        <input
            className="input"
            type="text"
            disabled={isDisabled || type === SearchType.BUTTON}
            placeholder="메세지 Palette.AI"
            value={message}
            onChange={handleInputChange}
        />
        <button className="round" type={"submit"} disabled={isDisabled}>
          <UploadSVG />
        </button>
      </div>
  );
};

export default SearchBar;
