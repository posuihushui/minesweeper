import { GameSettings, LevelNames } from "@/core/settings";
import {
  randomInt,
  BlockState,
  GameStatus,
  generateBlock,
  siblings,
} from "@/core/game";
import { useLayoutEffect, useState } from "react";

interface GameState {
  mineGenerated: boolean;
  status: GameStatus;
  blocks: BlockState[][];
}
interface ReturnType extends GameState {
  onClick: (coords: BlockState) => void;
  onContextMenu: (coords: BlockState) => void;
}

export const useGame = (level = "beginner" as LevelNames): ReturnType => {
  const [row, col, mines] = GameSettings[level];
  const [state, setState] = useState<GameState>({
    mineGenerated: false,
    status: "ready",
    blocks: generateBlock(row, col),
  });
  const getSiblings = (
    block: BlockState,
    newBlocksWithMines: BlockState[][]
  ): BlockState => {
    if (block.mine) {
      return block;
    } else {
      // 周围的节点计算出相邻的炸弹数
      const siblingMineSum = siblings
        .map(([sx, sy]) => {
          const [x2, y2] = [block.x + sx, block.y + sy];
          // 通过坐标来取, 直接取值，溢出会是undefined
          return newBlocksWithMines[y2]?.[x2];
        })
        .filter(Boolean)
        .filter((block) => block.mine).length;
      return {
        ...block,
        adjacentMines: siblingMineSum,
      };
    }
  };

  const expendZero = (block: BlockState) => {};
  const generateMines = (clickedBlock: BlockState) => {
    // 生成地雷
    const minesList: { x: number; y: number }[] = [];
    while (minesList.length < mines) {
      const x = randomInt(0, col - 1);
      const y = randomInt(0, row - 1);
      if (
        x !== clickedBlock.x &&
        y !== clickedBlock.y &&
        !minesList.some((mine) => mine.x === x && mine.y === y)
      ) {
        minesList.push({ x, y });
      }
    }
    //  画地雷
    const newBlocksWithMines = state.blocks.map((row: BlockState[]) => {
      return row.map((cell: BlockState) => {
        if (minesList.some((mine) => mine.x === cell.x && mine.y === cell.y)) {
          return { ...cell, mine: true };
        } else {
          return { ...cell, mine: false };
        }
      });
    });

    // 计算非地雷周围的地雷总数
    const newBlocksWithSiblings = newBlocksWithMines.map(
      (row: BlockState[]) => {
        return row.map((cell: BlockState) => {
          return getSiblings(cell, newBlocksWithMines);
        });
      }
    );

    setState({
      ...state,
      mineGenerated: true,
      blocks: newBlocksWithSiblings,
    });
  };
  const onClick = (block: BlockState) => {
    if (state.status === "ready") {
      setState({ ...state, status: "play" });
    }
    if (!state.mineGenerated) {
      generateMines(block);
    }
    if (state.status !== "play" || block.flagged) {
      return;
    }
    block.revealed = true;
  };
  const onContextMenu = (coords: BlockState) => {};

  // 当级别变化时候, 重新生成地图
  useLayoutEffect(() => {
    setState({
      status: "ready",
      mineGenerated: false,
      blocks: generateBlock(row, col),
    });
  }, [level]);
  return {
    ...state,
    onClick,
    onContextMenu,
  };
};
