'use client'

import { GetCaseStudiesQuery } from '@/graphql/generated/graphql'
import { renderPageBlocks } from '@/lib/blockRenderer'
import { Button, Container } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import PageTitleBar from '../../ui/PageTitleBar/PageTitleBar'

export default function SingleCaseStudies({ data }: { data: GetCaseStudiesQuery }) {
  return (
    <>
      <PageTitleBar
        title={data.caseStudies?.title || undefined}
        featuredImage={data.caseStudies?.acfCaseStudie?.pageHeaderImage?.node?.link}
        date={data.caseStudies?.date}
        readingTime={data.caseStudies?.seo?.readingTime}
        // author={`${data.caseStudies?.author?.node.firstName} ${data.caseStudies?.author?.node.lastName}`}
        {...(data.caseStudies?.institution?.nodes && data.caseStudies?.institution?.nodes.length > 0
          ? {
              aditionalInfoTable: [
                {
                  label: 'Institution',
                  value: data.caseStudies?.institution?.nodes?.[0]?.name || '',
                },
                {
                  label: 'Website',
                  value: (
                    <Link
                      href={
                        data.caseStudies?.institution?.nodes?.[0]?.acfTaxonomyInstitution
                          ?.website || ''
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.caseStudies?.institution?.nodes?.[0]?.acfTaxonomyInstitution?.website}
                    </Link>
                  ),
                },
              ],
            }
          : {})}
      />
      <Container size="lg" className="my-20">
        <div className="mb-5 flex justify-end">
          <Link href="/case-studies">
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
              Back to case studies list
            </Button>
          </Link>
        </div>
        <div>{renderPageBlocks(data.caseStudies?.blocks)}</div>
      </Container>
    </>
  )
}
