import { GameSettings, LevelNames } from "@/core/settings";
import {
  randomInt,
  BlockState,
  GameStatus,
  generateBlock,
  siblings,
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
  const setNewBlock = (
    block: BlockState,
    newAttrs: Partial<BlockState>,
    blocks: BlockState[][]
  ) => {
    return blocks.map((row: BlockState[]) => {
      return row.map((cell: BlockState) => {
        if (block.x === cell.x && block.y === cell.y) {
          return { ...cell, ...newAttrs };
        } else {
          return cell;
        }
      });
    });
  };

  const updateNewBlocks = (
    newBlocks: Partial<BlockState>[],
    blocks: BlockState[][]
  ) => {
    return blocks.map((row: BlockState[]) => {
      return row.map((cell: BlockState) => {
        const newBloack = newBlocks.find(
          (block) => block.x === cell.x && block.y === cell.y
        );
        if (newBloack) {
          return { ...cell, ...newBloack };
        } else {
          return cell;
        }
      });
    });
  };

  const expendZero = (block: BlockState, list: BlockState[][]) => {
    let newList: BlockState[] = [];
    function loopSiblingZero(cell: BlockState) {
      if (cell.adjacentMines === 0) {
        // current block siblings not has a mine block
        const siblingsBlocks = siblings
          .map(([sx, sy]) => {
            const [x2, y2] = [cell.x + sx, cell.y + sy];
            return list[y2]?.[x2];
          })
          .filter(Boolean)
          .filter((siblingCell) => siblingCell.adjacentMines === 0)
          .filter(
            (c) =>
              !newList.some(
                (existCell) => existCell.x === c.x && existCell.y === c.y
              )
          )
          .map((c) => ({ ...c, revealed: true }));
        // 过滤出新增的
        newList.push(...siblingsBlocks);
        while (siblingsBlocks.length > 0) {
          const s = siblingsBlocks.pop() as BlockState;
          loopSiblingZero(s);
        }
      }
    }
    // list
    loopSiblingZero(block);
    // update
    return updateNewBlocks(newList, list);
  };

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
    return newBlocksWithSiblings;
  };
  const onClick = (block: BlockState) => {
    let list: BlockState[][] = state.blocks;
    if (!state.mineGenerated) {
      list = generateMines(block);
      dispatch({ type: "mineGenerated", payload: true });
    }
    // open the mask
    list = setNewBlock(block, { revealed: true }, list);
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
  const onContextMenu = (coords: BlockState) => {};

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
