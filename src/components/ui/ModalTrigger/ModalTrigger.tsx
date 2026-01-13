'use client'

import { useModals } from '@/contexts/ModalsContext'
import React, { ReactNode } from 'react'

interface ModalTriggerProps {
  triggerId: string
  children: ReactNode
}

/**
 * Componente que torna seus filhos clicáveis para abrir um modal
 * Não adiciona estilos extras, apenas adiciona o onClick
 */
export function ModalTrigger({ triggerId, children }: ModalTriggerProps) {
  const { openModal } = useModals()

  // Clona o elemento filho e adiciona o onClick
  // Se houver múltiplos filhos, envolve em um div
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    openModal(triggerId)
  }

  // Se for um único elemento React, clona e adiciona onClick
  if (React.isValidElement(children)) {
    const childProps = children.props as {
      style?: React.CSSProperties
      onClick?: (e: React.MouseEvent) => void
    }
    return React.cloneElement(
      children as React.ReactElement<{
        onClick?: (e: React.MouseEvent) => void
        style?: React.CSSProperties
      }>,
      {
        onClick: handleClick,
        style: { ...(childProps.style || {}), cursor: 'pointer' },
      }
    )
  }

  // Se houver múltiplos filhos, envolve em um div invisível
  return (
    <div
      onClick={handleClick}
      style={{ width: 'fit-content', cursor: 'pointer', display: 'contents' }}
    >
      {children}
    </div>
  )
}
