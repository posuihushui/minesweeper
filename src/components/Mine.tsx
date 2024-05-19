"use client";
import { BlockState } from "@/core/game";
import { FlagOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useLayoutEffect, useState } from "react";

const baseSyle = {
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
};

export const Mine: React.FC<{
  onClick: () => void;
  block: BlockState;
  onContextMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ onClick, block, onContextMenu }) => {
  const [isDev, setDev] = useState(false);

  useLayoutEffect(() => {
    const isDev = window.location.href.includes("dev=1");
    setDev(isDev);
  }, []);
  return (
    <Button
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={Object.assign(
        baseSyle,
        block.revealed
          ? {
              cursor: "default",
              border: "1px solid #91d5ff",
              backgroundColor: "#e6f7ff",
            }
          : block.mine
          ? { backgroundColor: "red", cursor: "default" }
          : { cursor: "pointer" }
      )}
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
    </Button>
  );
};
