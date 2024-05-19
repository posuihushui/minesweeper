"use client";
import { Layout, Typography, Flex } from "antd";
import { Game } from "@/components/Game";
const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

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
      <Content style={{ padding: "32px" }}>
        <Flex justify="center">
          <Game />
        </Flex>
      </Content>
      <Footer>
        <Flex justify="center">
          <Text>Game Status : </Text>
        </Flex>
      </Footer>
    </Layout>
  );
}
