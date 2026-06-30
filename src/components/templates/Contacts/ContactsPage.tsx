'use client'

import { useQuery } from '@apollo/client/react'
import { Container, Stack, Text, Title } from '@mantine/core'
import clsx from 'clsx'
import { useMemo, useState } from 'react'

import {
  GetAllOfficesDocument,
  type GetAllOfficesQuery_RootQuery_offices_RootQueryToOfficeConnection_nodes_Office,
} from '@/graphql/generated/graphql'

type Office = GetAllOfficesQuery_RootQuery_offices_RootQueryToOfficeConnection_nodes_Office

/**
 * Componente para exibir mapa do Google Maps em iframe
 * Recebe a URL do mapa do WordPress
 */
function OfficeMapFrame({ googleMapsUrl }: { googleMapsUrl?: string | null }) {
  if (!googleMapsUrl) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50"
        style={{ height: '550px' }}
      >
        <Text c="dimmed">Maps not available</Text>
      </div>
    )
  }

  return (
    <>
      <iframe
        src={googleMapsUrl}
        width="100%"
        height="550"
        style={{ border: 0, borderRadius: '8px' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Office location map"
      />
    </>
  )
}

/**
 * Componente para exibir card de escritório
 * Mostra informações do escritório e alterna o mapa ao clicar
 */
function OfficeCard({
  office,
  isActive,
  onSelect,
}: {
  office: Office
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <div
      key={office.id}
      onClick={onSelect}
      className={clsx(
        'w-full rounded-xl p-8 text-left transition-all hover:bg-white/50',
        isActive ? 'bg-white hover:bg-white' : 'bg-transparent'
      )}
      aria-pressed={isActive}
    >
      <Title mb={15} order={5} c="primaryColor.9">
        {office.title}
      </Title>
      <Text dangerouslySetInnerHTML={{ __html: office.acfOffices?.address || '' }} />
      <Text>{office.acfOffices?.email}</Text>
      <Text>{office.acfOffices?.tel}</Text>
    </div>
  )
}

/**
 * Lista de escritórios com alternância de seleção
 */
function OfficesList({
  offices,
  currentTabId,
  onTabChange,
}: {
  offices: Office[]
  currentTabId: string | undefined
  onTabChange: (officeId: string) => void
}) {
  if (!offices || offices.length === 0) {
    return (
      <Stack gap={10}>
        <Text c="dimmed">No offices available</Text>
      </Stack>
    )
  }

  return (
    <Stack gap={10}>
      {offices.map((office) => (
        <OfficeCard
          key={office.id}
          office={office}
          isActive={currentTabId === office.id}
          onSelect={() => onTabChange(office.id)}
        />
      ))}
    </Stack>
  )
}

export default function ContactPage() {
  const { data, loading, error } = useQuery(GetAllOfficesDocument, {
    errorPolicy: 'all',
    // Avoid hard failures during SSR/prerender when backend is temporarily unavailable.
    ssr: false,
  })

  // Extrai lista de escritórios com validação
  const offices = useMemo(
    () => data?.offices?.nodes?.filter((office): office is Office => office != null) ?? [],
    [data?.offices?.nodes]
  )

  const [currentTabId, setCurrentTabId] = useState<string | undefined>(undefined)

  // Usa seleção atual quando válida, senão cai para o primeiro escritório.
  const selectedOfficeId = useMemo(() => {
    if (offices.length === 0) return undefined

    const hasValidSelection =
      currentTabId != null && offices.some((office) => office.id === currentTabId)

    if (hasValidSelection) return currentTabId

    return offices[0].id
  }, [offices, currentTabId])

  // Encontra o escritório atualmente selecionado
  const currentOffice = useMemo(
    () => offices.find((office) => office.id === selectedOfficeId),
    [offices, selectedOfficeId]
  )

  // Obtém a URL do mapa do escritório selecionado
  const currentMapUrl = useMemo(
    () => currentOffice?.acfOffices?.googleMaps ?? undefined,
    [currentOffice]
  )

  if (loading && offices.length === 0) {
    return (
      <Container size="xl" my={100}>
        <Text c="dimmed">Loading contacts...</Text>
      </Container>
    )
  }

  if (error && offices.length === 0) {
    return (
      <Container size="xl" my={100}>
        <Text c="dimmed">Unable to load contacts at this time.</Text>
      </Container>
    )
  }

  return (
    <>
      <Container size="xl" my={100}>
        <div className="grid grid-cols-1 gap-20 sm:grid-cols-2">
          {/* Google Map */}
          <div>
            <OfficeMapFrame googleMapsUrl={currentMapUrl} />
            <div className={clsx('mt-5 w-full rounded-xl bg-white p-8 text-left transition-all')}>
              <Title mb={15} order={5} c="primaryColor.9">
                For press enquiries please contact:
              </Title>
              <Title mb={15} order={6}>
                Nuno M. Gonçalves <br /> <small>EARA Deputy Director</small>
              </Title>
              <Text>Email: ngoncalves@eara.eu</Text>
              <Text>Tel: +351 934950684</Text>
              <Text>Email: info@eara.eu</Text>
              <Text>Tel: +44 (0)20 3355 7458</Text>
            </div>
          </div>

          {/* Offices List */}
          <OfficesList
            offices={offices}
            currentTabId={selectedOfficeId}
            onTabChange={setCurrentTabId}
          />
        </div>
      </Container>
    </>
  )
}
