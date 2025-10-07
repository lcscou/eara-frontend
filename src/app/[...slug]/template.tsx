"use client";
import Header from "@/components/ui/Header/Header";
import PageTitleBar from "@/components/ui/PageTitleBar/page";
import { Container, Title } from "@mantine/core";
import { useParams } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const params = useParams<{ slug: string }>();
  return (
    <>
      <Header />
      <main className="">
        <PageTitleBar title={params?.slug} />

        <Container fluid>{children}</Container>
      </main>
    </>
  );
}
