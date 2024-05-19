"use client";
import { Flex, Button, Popover, Radio, Space } from "antd";
import { Mine } from "./Mine";
import { useGame } from "@/hooks/useGame";
import { useState } from "react";
import { GameSettings, GameLevels } from "@/core/settings";

import {
  FieldTimeOutlined,
  BugOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export const Game: React.FC = () => {
  const [level, setLevel] = useState(GameLevels[0]);
  const [settingOpen, setOpen] = useState<boolean>(false);
  const { blocks, onClick, onContextMenu } = useGame(level);

  return (
    <Flex vertical gap={32}>
      <Flex justify="space-between">
        <Flex gap={32}>
          <Space>
            <FieldTimeOutlined />
            10s
          </Space>
          <Space>
            <BugOutlined />
            {GameSettings[level]?.[2]}
          </Space>
        </Flex>

        <Flex gap={8}>
          <Button>
            <ReloadOutlined />
          </Button>
          <Popover
            open={settingOpen}
            title="Game Level Setting"
            trigger="click"
            content={
              <div>
                <Flex vertical align="center" gap={16}>
                  <Radio.Group
                    value={level}
                    onChange={(e) => {
                      setLevel(e.target.value);
                      setOpen(false);
                    }}
                  >
                    {GameLevels.map((l) => (
                      <Radio.Button value={l} key={l}>
                        {l}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </Flex>
              </div>
            }
          >
            <Button
              onClick={() => {
                setOpen(true);
              }}
              icon={<SettingOutlined />}
            ></Button>
          </Popover>
        </Flex>
      </Flex>
      <div style={{ maxWidth: "100%", overflow: "auto" }}>
        <Flex vertical gap={4}>
          {blocks.map((row, yidx) => {
            return (
              <Flex key={yidx} gap={4}>
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
      </div>
    </Flex>
  );
};
