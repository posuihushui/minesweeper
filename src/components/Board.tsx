"use client";
import { Button, Typography, Radio, Flex, Tag } from "antd";
import { FieldTimeOutlined, BugOutlined } from "@ant-design/icons";
import { useLocalStorage } from "usehooks-ts";
import { GameLevels } from "@/core/settings";
import { Mine } from "./Mine";
import { useGame } from "@/hooks/useGame";
const { Title } = Typography;

export const Board: React.FC = () => {
  const onReset = () => {};
  const [level, setLevel] = useLocalStorage("__game_level", GameLevels[0], {
    initializeWithValue: false,
  });
  const { blocks, onClick, onContextMenu } = useGame(level);
  return (
    <Flex vertical gap={32}>
      <Flex vertical align="center" gap={16}>
        <Title>Minesweeper</Title>

        <Radio.Group
          value={level}
          onChange={(e) => {
            setLevel(e.target.value);
          }}
        >
          {GameLevels.map((l) => (
            <Radio.Button value={l} key={l}>
              {l}
            </Radio.Button>
          ))}
        </Radio.Group>
        <Flex justify="center" gap={16}>
          <FieldTimeOutlined />
          <Button onClick={onReset} type="primary">
            New Game
          </Button>
          <BugOutlined />
        </Flex>
      </Flex>

      {/* mines */}
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
