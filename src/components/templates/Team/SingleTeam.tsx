'use client'

import { GetTeamQuery } from '@/graphql/generated/graphql'
import { Button, Container } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import PageTitleBar from '../../ui/PageTitleBar/PageTitleBar'

export default function SingleMembers({ data }: { data: GetTeamQuery }) {
  return (
    <>
      <PageTitleBar
        title={data.team?.title || undefined}
        featuredImage={data.team?.featuredImage?.node.guid}
        date={data.team?.date}
        {...(data.team?.roles?.nodes[0]?.name
          ? { aditionalInfoTable: [{ label: 'Role', value: data.team?.roles?.nodes[0].name }] }
          : {})}
      />
      <Container size="lg" className="my-20">
        <div className="mb-5 flex justify-end">
          <Link href="/team">
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Back to team list
            </Button>
          </Link>
        </div>
        <div dangerouslySetInnerHTML={{ __html: data.team?.content || '' }}></div>
      </Container>
    </>
  )
}
