"use client";
import { Layout, Typography, Flex } from "antd";
import { Game } from "@/components/Game";
const { Header, Content } = Layout;
const { Title } = Typography;

export default function Home() {
  return (
    <Layout style={{ width: "max-content", margin: "auto" }}>
      <Header>
        <Title
          level={2}
          style={{ color: "white", textAlign: "center", margin: "16px 0" }}
        >
          MINSWEEPER
        </Title>
      </Header>
      <Content style={{ padding: "32px 16px" }}>
        <Flex justify="center">
          <Game />
        </Flex>
      </Content>
    </Layout>
  );
}
