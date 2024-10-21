import React, { useState, useEffect, FC } from 'react';
import './scss/GridBtn.scss';
import { useGridStore } from "@/app/store/useStore";
import axios from "axios";
import BackDrop from "@/app/components/BackDrop";

interface GridProps {
  status: boolean;
  fn: () => void;
  x: number | undefined;
  y: number | undefined;
}

const GridBtn: FC<GridProps> = ({ status, fn, x, y }) => {
  const [clickedButtons, setClickedButtons] = useState<boolean[]>([]);
  const { grid, setGrid } = useGridStore();
  const positionList: string[] = ["상", "중", "하"];

  useEffect(() => {
    if (!x || !y) return;
    setClickedButtons(Array(x * y).fill(false));
  }, [x, y]);

  const handleClick = (index: number) => {
    const newClickedButtons = [...clickedButtons];
    if (clickedButtons[index]) {
      newClickedButtons[index] = !newClickedButtons[index];
      setClickedButtons(newClickedButtons);
      setGrid(index);
    } else if(clickedButtons.filter((item) => item).length > 0 && !clickedButtons[index]) {
      return
    } else {
      newClickedButtons[index] = !newClickedButtons[index];
      console.log(newClickedButtons)
      setClickedButtons(newClickedButtons);
      setGrid(index);
    }
  };

  return (
      <BackDrop>
        <div
            className="grid-container"
            style={{
              display: status ? "grid" : "none",
              gridTemplateColumns: `repeat(${x}, 1fr)`,
              gridTemplateRows: `repeat(${y}, 1fr)`
            }}
        >
          {clickedButtons.map((clicked, index) => (
              <button
                  key={index}
                  className={`grid-item ${clicked ? 'clicked' : ''}`}
                  onClick={() => handleClick(index)}
              >
                {positionList[index]}
              </button>
          ))}
          <button className={`grid-item btn`} onClick={fn}>제출</button>
        </div>
      </BackDrop>
  );
};

export default GridBtn;
