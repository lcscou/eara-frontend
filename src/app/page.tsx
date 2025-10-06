"use client";

import Header from "@/components/ui/Header/Header";
import { GetPagesWithBlockDocument } from "@/graphql/generated/graphql";
import { useQuery } from "@apollo/client/react";

export default function Home() {
  const { data, loading } = useQuery(GetPagesWithBlockDocument, {});

  return (
    <>
    <Header></Header>
      Pages:
      {loading && <p>Loading...</p>}
      {data?.pages?.nodes.map((e) => (
        <p key={e.id}>{e.title}</p>
      ))}
    </>
  );
}
