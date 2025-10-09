import { PageTitleBarProps } from "@/lib/types";
import { Container, Title } from "@mantine/core";

export default function PageTitleBar({
  title,
  author,
  date,
  readingTime,
}: PageTitleBarProps) {
  return (
    <div
      className=" h-[575px] bg-cover  "
      style={{
        backgroundImage:
          "url(/bg.avif)",
      }}
    >
      <Container fluid className="h-full">
        <div className="flex justify-center items-center h-full">


        <Title c="white" size={88}>{title}</Title>
        </div>
      </Container>
    </div>
  );
}
