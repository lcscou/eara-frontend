'use client'

import { Modal, useModalsStack } from '@mantine/core'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

// Interface para definir um modal
export interface ModalDefinition {
  triggerId: string
  title?: string
  centered?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  withCloseButton?: boolean
  fullScreen?: boolean
  lock?: object
  className?: string
  metadata?: object
  content: ReactNode
}

// Interface do contexto
interface ModalsContextType {
  registerModal: (modal: ModalDefinition) => void
  unregisterModal: (triggerId: string) => void
  openModal: (triggerId: string) => void
  closeModal: (triggerId: string) => void
  closeAll: () => void
  modals: Map<string, ModalDefinition>
}

// Criação do contexto
const ModalsContext = createContext<ModalsContextType | undefined>(undefined)

// Provider do contexto
export function ModalsProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<Map<string, ModalDefinition>>(new Map())
  const [triggerIds, setTriggerIds] = useState<string[]>([])

  // Usa useModalsStack com os triggerIds atuais
  const stack = useModalsStack(triggerIds)

  // Registrar um modal
  const registerModal = useCallback((modal: ModalDefinition) => {
    setModals((prev) => {
      const newMap = new Map(prev)
      newMap.set(modal.triggerId, modal)
      return newMap
    })

    setTriggerIds((prev) => {
      if (!prev.includes(modal.triggerId)) {
        return [...prev, modal.triggerId]
      }
      return prev
    })
  }, [])

  // Desregistrar um modal
  const unregisterModal = useCallback((triggerId: string) => {
    setModals((prev) => {
      const newMap = new Map(prev)
      newMap.delete(triggerId)
      return newMap
    })

    setTriggerIds((prev) => prev.filter((id) => id !== triggerId))
  }, [])

  // Abrir um modal
  const openModal = useCallback(
    (triggerId: string) => {
      setModals((prev) => {
        if (prev.has(triggerId)) {
          stack.open(triggerId)
        }
        return prev
      })
    },
    [stack]
  )

  // Fechar um modal
  const closeModal = useCallback(
    (triggerId: string) => {
      stack.close(triggerId)
    },
    [stack]
  )

  // Fechar todos os modais
  const closeAll = useCallback(() => {
    stack.closeAll()
  }, [stack])

  return (
    <ModalsContext.Provider
      value={{
        registerModal,
        unregisterModal,
        openModal,
        closeModal,
        closeAll,
        modals,
      }}
    >
      {children}

      {/* Renderiza todos os modais registrados */}
      <Modal.Stack>
        {Array.from(modals.values()).map((modal) => (
          <Modal
            key={modal.triggerId}
            {...stack.register(modal.triggerId)}
            title={modal.title}
            centered={modal.centered}
            size={modal.size || 'md'}
            withCloseButton={modal.withCloseButton !== false}
            fullScreen={modal.fullScreen}
            className={modal.className}
          >
            {modal.content}
          </Modal>
        ))}
      </Modal.Stack>
    </ModalsContext.Provider>
  )
}

// Hook para usar o contexto
export function useModals() {
  const context = useContext(ModalsContext)
  if (context === undefined) {
    throw new Error('useModals must be used within a ModalsProvider')
  }
  return context
}
