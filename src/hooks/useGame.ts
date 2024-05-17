import { GameSettings, LevelNames } from "@/core/settings";
import {
  BlockState,
  GameStatus,
  generateBlock,
  setNewBlock,
  updateNewBlocks,
  expendZero,
  generateMines,
} from "@/core/game";
import { useLayoutEffect, useReducer } from "react";

interface GameState {
  mineGenerated: boolean;
  status: GameStatus;
  blocks: BlockState[][];
}
type ValueOfType<T, K> = K extends keyof T ? T[K] : never;

interface Action {
  type: keyof GameState;
  payload: ValueOfType<GameState, keyof GameState>;
}
interface ReturnType extends GameState {
  onClick: (coords: BlockState) => void;
  onContextMenu: (coords: BlockState) => void;
}
const reducer = (state: GameState, action: Action) => {
  return {
    ...state,
    [action.type]: action.payload,
  };
};
const getInitals = (row: number, col: number) => {
  return {
    mineGenerated: false,
    status: "ready" as GameStatus,
    blocks: generateBlock(row, col),
  };
};

export const useGame = (level = "beginner" as LevelNames): ReturnType => {
  const [row, col, mines] = GameSettings[level];
  const [state, dispatch] = useReducer(reducer, getInitals(row, col));

  const onClick = (block: BlockState) => {
    let list: BlockState[][] = state.blocks;
    if (!state.mineGenerated) {
      list = generateMines(block, mines, row, col, state.blocks);
      dispatch({ type: "mineGenerated", payload: true });
    }
    if (block.flagged) {
      return;
    }
    // open the mask
    if (!block.revealed) {
      list = setNewBlock(block, { revealed: true }, list);
    }
    // if click the mine, lost!;
    if (block.mine) {
      // game over!;
      console.log("lost!");
      // list = list.map((row: BlockState[]) =>
      //   row.map((cell) => ({ ...cell, revealed: true }))
      // );
      list = updateNewBlocks(
        list.flat().map((cell) => ({ ...cell, revealed: true })),
        list
      );
    } else {
      // expand the zeros
      list = expendZero(block, list);
    }

    dispatch({
      type: "blocks",
      payload: list,
    });
    if (state.status === "ready") {
      dispatch({ type: "status", payload: "play" });
    }
    if (state.status !== "play" || block.flagged) {
      return;
    }
  };
  const onContextMenu = (block: BlockState) => {
    if (state.status !== "play") {
      return;
    }
    if (block.revealed) {
      return;
    }
    dispatch({
      type: "blocks",
      payload: setNewBlock(block, { flagged: !block.flagged }, state.blocks),
    });
  };

  // 当级别变化时候, 重新生成地图
  useLayoutEffect(() => {
    dispatch({ type: "status", payload: "ready" });
    dispatch({ type: "mineGenerated", payload: false });
    dispatch({ type: "blocks", payload: generateBlock(row, col) });
  }, [level]);
  return {
    ...state,
    onClick,
    onContextMenu,
  };
};
