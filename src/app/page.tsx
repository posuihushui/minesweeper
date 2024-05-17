"use client";
import { Button, Typography, Radio, Flex } from "antd";
import { GameLevels } from "@/core/settings";
import { useState } from "react";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function Home() {
  const [level, setLevel] = useState(GameLevels[0]);
  const router = useRouter();

  return (
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
        <Button
          onClick={() => {
            router.push(`/play?level=${level}`);
          }}
          type="primary"
        >
          Start Game
        </Button>
      </Flex>
    </Flex>
  );
}
