export const siblings = [
  // [0,0],
  [0, 1], // 右边
  [0, -1], // 左边
  [1, 0], // 上
  [-1, 0], // 下
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

export type Coords = [number, number];
export type GameStatus = "ready" | "play" | "won" | "lost";

export interface GameState {
  board: BlockState[][];
  mineGenerated: boolean;
  status: GameStatus;
  startMS?: number;
  endMS?: number;
}

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
    }))
  );

export const randomInt = (min = 0, max = 1) =>
  Math.floor(Math.random() * (max - min)) + min;
