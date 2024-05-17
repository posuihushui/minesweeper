"use client";
import { Flex } from "antd";
import { Mine } from "./Mine";
import { useGame } from "@/hooks/useGame";
import { useSearchParams } from "next/navigation";
import { LevelNames } from "@/core/settings";
import { FieldTimeOutlined, BugOutlined } from "@ant-design/icons";

export const Game: React.FC = () => {
  const searchParams = useSearchParams();
  const level = (searchParams?.get("level") || "beginner") as LevelNames;
  const { blocks, onClick, onContextMenu } = useGame(level);
  return (
    <Flex vertical gap={32}>
      <Flex justify="space-between" gap={16}>
        <FieldTimeOutlined />
        <BugOutlined />
      </Flex>
      <Flex vertical>
        {blocks.map((row, yidx) => {
          return (
            <Flex key={yidx}>
              {row.map((cell, xidx) => (
                <Mine
                  key={`${yidx}_${xidx}`}
                  onClick={() => {
                    onClick(cell);
                  }}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    onContextMenu(cell);
                  }}
                  block={cell}
                />
              ))}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};
