export const GameLevels = ["beginner", "intermediate", "expert"] as const;

export type LevelNames = (typeof GameLevels)[number];
// row, col, mines
export type Settings = [number, number, number];

export const GameSettings: Record<LevelNames, Settings> = {
  beginner: [9, 9, 10],
  intermediate: [16, 16, 40],
  expert: [16, 30, 99],
};
