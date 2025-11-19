'use client'

import { GetCaseStudiesQuery } from '@/graphql/generated/graphql'
import { Button, Container } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import PageTitleBar from '../../ui/PageTitleBar/PageTitleBar'

export default function SingleCaseStudies({ data }: { data: GetCaseStudiesQuery }) {
  return (
    <>
      <PageTitleBar
        title={data.caseStudies?.title || undefined}
        featuredImage={data.caseStudies?.featuredImage?.node.guid}
        date={data.caseStudies?.date}
        readingTime={data.caseStudies?.seo?.readingTime}
        author={`${data.caseStudies?.author?.node.firstName} ${data.caseStudies?.author?.node.lastName}`}
      />
      <Container size="lg" className="my-20">
        <div className="mb-5 flex justify-end">
          <Link href="/case-studies">
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Back to case studies list
            </Button>
          </Link>
        </div>
        <div dangerouslySetInnerHTML={{ __html: data.caseStudies?.content || '' }}></div>
      </Container>
    </>
  )
}
