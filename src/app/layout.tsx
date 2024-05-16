import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
  title: "minsweeper",
  description:
    "Discover the exhilarating Minesweeper game online and challenge your strategic thinking. Uncover hidden mines, avoid explosions, and conquer the board. Play now for free!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
