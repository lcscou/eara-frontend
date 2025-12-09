'use client'

import PageTitleBar from '@/components/ui/PageTitleBar/PageTitleBar'
import {
  GetAllOfficesDocument,
  type GetAllOfficesQuery_RootQuery_offices_RootQueryToOfficeConnection_nodes_Office,
} from '@/graphql/generated/graphql'
import { useSuspenseQuery } from '@apollo/client/react'
import { Container, Stack, Text, Title } from '@mantine/core'
import clsx from 'clsx'
import { useMemo, useState } from 'react'

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
        <Text c="dimmed">Mapa não disponível</Text>
      </div>
    )
  }

  return (
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
    <button
      key={office.id}
      onClick={onSelect}
      className={clsx(
        'w-full rounded-xl p-8 text-left transition-all hover:bg-white/50',
        isActive ? 'bg-white hover:bg-white/100' : 'bg-transparent'
      )}
      aria-pressed={isActive}
    >
      <Title mb={15} order={5} c="primaryColor.9">
        {office.title}
      </Title>
      <Text dangerouslySetInnerHTML={{ __html: office.acfOffices?.address || '' }} />
    </button>
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
        <Text c="dimmed">Nenhum escritório disponível</Text>
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
  const { data } = useSuspenseQuery(GetAllOfficesDocument)

  // Extrai lista de escritórios com validação
  const offices = useMemo(
    () => data.offices?.nodes?.filter((office): office is Office => office != null) ?? [],
    [data.offices?.nodes]
  )

  // Define o primeiro escritório como padrão
  const defaultOfficeId = offices[0]?.id

  const [currentTabId, setCurrentTabId] = useState<string | undefined>(defaultOfficeId)

  // Encontra o escritório atualmente selecionado
  const currentOffice = useMemo(
    () => offices.find((office) => office.id === currentTabId),
    [offices, currentTabId]
  )

  // Obtém a URL do mapa do escritório selecionado
  const currentMapUrl = useMemo(
    () => currentOffice?.acfOffices?.googleMaps ?? undefined,
    [currentOffice]
  )

  return (
    <>
      <PageTitleBar title="Speak with us" subtitle="contacts" />
      <Container size="xl" my={100}>
        <div className="grid grid-cols-1 gap-20 sm:grid-cols-2">
          {/* Mapa do Google */}
          <div>
            <OfficeMapFrame googleMapsUrl={currentMapUrl} />
          </div>

          {/* Lista de escritórios */}
          <OfficesList
            offices={offices}
            currentTabId={currentTabId}
            onTabChange={setCurrentTabId}
          />
        </div>
      </Container>
    </>
  )
}
