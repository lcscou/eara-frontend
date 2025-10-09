"use client";
import Header from "@/components/ui/Header/Header";
import PageTitleBar from "@/components/ui/PageTitleBar/page";
import { GetPostDocument } from "@/graphql/generated/graphql";
import { useSuspenseQuery } from "@apollo/client/react";
import { Container, Title } from "@mantine/core";
import { useParams } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const params = useParams<{ slug: string }>();

  const { data } = useSuspenseQuery(GetPostDocument, {
    variables: { id: `${params.slug}` },
  });

  console.log(data)

  return (
    <>
      <Header />
      <main className="">
        <PageTitleBar title={data?.post?.title} />

        <Container fluid>{children}</Container>
      </main>
    </>
  );
}
