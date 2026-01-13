'use client'

import { useModals } from '@/contexts/ModalsContext'
import { ReactNode, useEffect } from 'react'

interface ModalContentProps {
  triggerId: string
  title?: string
  centered?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  withCloseButton?: boolean
  fullScreen?: boolean
  lock?: object
  className?: string
  metadata?: object
  children: ReactNode
}

/**
 * Componente que registra o conteúdo de um modal
 * Este componente não renderiza nada visualmente na página,
 * apenas registra o modal no contexto
 */
export function ModalContent({
  triggerId,
  title,
  centered = false,
  size = 'md',
  withCloseButton = true,
  fullScreen = false,
  lock,
  className,
  metadata,
  children,
}: ModalContentProps) {
  const { registerModal, unregisterModal } = useModals()

  useEffect(() => {
    // Registra o modal quando o componente é montado
    registerModal({
      triggerId,
      title,
      centered,
      size,
      withCloseButton,
      fullScreen,
      lock,
      className,
      metadata,
      content: children,
    })

    // Desregistra o modal quando o componente é desmontado
    return () => {
      unregisterModal(triggerId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    triggerId,
    title,
    centered,
    size,
    withCloseButton,
    fullScreen,
    lock,
    className,
    metadata,
    children,
  ])

  // Não renderiza nada visualmente
  return null
}
