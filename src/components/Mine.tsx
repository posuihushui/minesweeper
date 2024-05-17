"use client";
import { BlockState } from "@/core/game";
import { FlagOutlined } from "@ant-design/icons";
import { useLayoutEffect, useState } from "react";

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
  flagged: {
    // backgroundColor: "red",
  },
};

export const Mine: React.FC<{
  onClick: () => void;
  block: BlockState;
  onContextMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ onClick, block, onContextMenu }) => {
  const [isDev, setDev] = useState(false);
  const getCurrentStyle = () => {
    if (block.flagged) {
      return styleMap.flagged;
    }
    if (!block.revealed) {
      return styleMap.unopen;
    } else {
      return block.mine ? styleMap.mine : styleMap.normal;
    }
  };
  useLayoutEffect(() => {
    const isDev = window.location.href.includes("dev=1");
    setDev(isDev);
  }, []);
  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={{
        ...getCurrentStyle(),
        border: "1px solid red",
        width: 60,
        height: 60,
        cursor: block.revealed ? "default" : "pointer",
      }}
    >
      {block.flagged ? (
        <FlagOutlined style={{ color: "red" }} />
      ) : block.revealed || isDev ? (
        block.mine ? (
          "💣"
        ) : (
          block.adjacentMines
        )
      ) : (
        ""
      )}
      {/* {block.mine ? "💣" : block.adjacentMines} */}
    </button>
  );
};
