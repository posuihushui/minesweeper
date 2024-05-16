export const GameLevels = ["beginner", "intermediate", "expert"] as const;

export type LevelNames = (typeof GameLevels)[number];
// row, col, mines
export type Settings = [number, number, number];

export const GameSettings: Record<LevelNames, Settings> = {
  beginner: [9, 10, 10],
  intermediate: [16, 44, 20],
  expert: [22, 99, 30],
};
