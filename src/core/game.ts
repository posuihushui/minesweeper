export const siblings = [
  // [0,0],
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

export type Coords = [number, number];
export type GameStatus = "ready" | "play" | "won" | "lost";

export interface BlockState {
  x: number;
  y: number;
  revealed: boolean;
  mine?: boolean;
  flagged?: boolean;
  adjacentMines: number;
}
export const generateBlock = (row: number, col: number) =>
  Array.from({ length: row }, (_, y) =>
    Array.from({ length: col }, (_, x) => ({
      x,
      y,
      adjacentMines: 0,
      revealed: false,
      flagged: false,
      mine: false,
    }))
  );

export const randomInt = (min = 0, max = 1) =>
  Math.floor(Math.random() * (max - min)) + min;

export const getSiblings = (
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

export const setNewBlock = (
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

export const updateNewBlocks = (
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

export const expendZero = (block: BlockState, list: BlockState[][]) => {
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
        .filter(
          (siblingCell) => siblingCell.adjacentMines === 0 && !siblingCell.mine
        )
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

export const generateMines = (
  clickedBlock: BlockState,
  mines: number,
  row: number,
  col: number,
  blocks: BlockState[][]
) => {
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
  const newBlocksWithMines = blocks.map((row: BlockState[]) => {
    return row.map((cell: BlockState) => {
      if (minesList.some((mine) => mine.x === cell.x && mine.y === cell.y)) {
        return { ...cell, mine: true };
      } else {
        return { ...cell, mine: false };
      }
    });
  });

  // 计算非地雷周围的地雷总数
  const newBlocksWithSiblings = newBlocksWithMines.map((row: BlockState[]) => {
    return row.map((cell: BlockState) => {
      return getSiblings(cell, newBlocksWithMines);
    });
  });
  return newBlocksWithSiblings;
};
