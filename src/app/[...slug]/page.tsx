"use client";
import { use } from "react";
import { GetPostDocument } from "@/graphql/generated/graphql";
import { useQuery } from "@apollo/client/react";
import { Container } from "@mantine/core";
export default function Pages({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data } = useQuery(GetPostDocument, {
    variables: { id: `${slug}` },
  });
  return (
    <div className="py-10">
      <Container fluid>
        <p dangerouslySetInnerHTML={{ __html: data?.post?.content ?? '' }}></p>
      </Container>
    </div>
  );
}
