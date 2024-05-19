"use client";
import { BlockState, GameStatus } from "@/core/game";
import { FlagOutlined } from "@ant-design/icons";
import { Button } from "antd";

const baseSyle = {
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
};

const styleMap = {
  flagged: {
    cursor: "pointer",
    backgroundColor: "#fee2e2",
  },
  mine: {
    cursor: "default",
    backgroundColor: "#f0f0f0",
  },
  notMine: {
    cursor: "default",
    backgroundColor: "#fafaf9",
  },
  // 没有打开
  normal: {
    cursor: "pointer",
    backgroundColor: "#e5e5e5",
  },
};
const isDev = true;

export const Mine: React.FC<{
  onClick: () => void;
  block: BlockState;
  onContextMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ onClick, block, onContextMenu }) => {
  const getCurrentStyle = () => {
    if (block.flagged) {
      return styleMap.flagged;
    }
    if (block.revealed) {
      return block.mine ? styleMap.mine : styleMap.notMine;
    } else {
      return styleMap.normal;
    }
  };
  return (
    <Button
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={Object.assign(baseSyle, getCurrentStyle())}
    >
      {block.flagged ? (
        <FlagOutlined style={{ color: "#991b1b" }} />
      ) : block.revealed || isDev ? (
        block.mine ? (
          "💣"
        ) : (
          block.adjacentMines
        )
      ) : (
        ""
      )}
    </Button>
  );
};
