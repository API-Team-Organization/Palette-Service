import React, {useState, useEffect, FC} from 'react';
import './scss/GridBtn.scss';
import {useGridStore} from "@/app/store/useStore";
import axios from "axios";

interface GridProps {
  status: boolean;
  fn: () => void
}

const GridBtn: FC<GridProps> = ({ status, fn }) => {
  const [clickedButtons, setClickedButtons] = useState(Array(9).fill(false));
  const setGrid = useGridStore(state => state.setGrid);

  // @ts-ignore
  const handleClick = (index) => {
    const newClickedButtons = [...clickedButtons];
    newClickedButtons[index] = !newClickedButtons[index];
    setGrid(index);
    setClickedButtons(newClickedButtons);
  };

  return (
      <div className="grid-container" style={{display: status ? "grid" : "none"}}>
        {clickedButtons.map((clicked, index) => (
            <button
                key={index}
                className={`grid-item ${clicked ? 'clicked' : ''}`}
                onClick={() => handleClick(index)}
            >
              {index + 1}
            </button>
        ))}
        <button className={`grid-item btn`} onClick={fn}>제출</button>
      </div>
  );
};

export default GridBtn;
