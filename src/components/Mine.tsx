"use client";
import {
  randomInt,
  BlockState,
  GameStatus,
  generateBlock,
  siblings,
} from "@/core/game";
const styleMap = {
  unopen: {
    backgroundColor: "#167aef",
  },
  mine: {
    background: "#f0f0f0",
  },
  normal: {
    background: "transparent",
  },
};
export const Mine: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  block: BlockState;
}> = ({ children, onClick, block }) => {
  const getCurrentStyle = () => {
    if (!block.revealed) {
      return styleMap.unopen;
    } else {
      return block.mine ? styleMap.mine : styleMap.normal;
    }
  };
  return (
    <button
      onClick={onClick}
      style={{
        ...getCurrentStyle(),
        border: "1px solid red",
        width: 60,
        height: 60,
      }}
    >
      {children}
    </button>
  );
};
