import { Row, Col, Layout } from "antd";
import { Board } from "@/components/Board";

export default function Home() {
  return (
    <Row gutter={24} justify="center">
      <Board />
    </Row>
  );
}
