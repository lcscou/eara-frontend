'use client'
import { ModalContent } from '@/components/ui/ModalContent/ModalContent'
import { ModalTrigger } from '@/components/ui/ModalTrigger/ModalTrigger'
import { useModals } from '@/contexts/ModalsContext'
import { Box, Group, Stack, Text, TextInput, Title } from '@mantine/core'
import { FormEvent, useCallback, useMemo, useState } from 'react'
import ButtonEara from '../ButtonEara/ButtonEara'

export type JoinEaraFormPayload = {
  name: string
  email: string
  institution: string
  country: string
}

export type JoinEaraFormProps = {
  triggerId?: string
  title?: string
  buttonLabel?: string
  description?: string
  submitUrl?: string
  onSubmit?: (payload: JoinEaraFormPayload) => Promise<void> | void
  renderMode?: 'modal' | 'inline'
}

const DEFAULT_TRIGGER_ID = 'join-eara-form'

function JoinEaraFormComponent({
  triggerId,
  submitUrl,
  onSubmit,
  onSuccess,
}: {
  triggerId: string
  submitUrl?: string
  onSubmit?: (payload: JoinEaraFormPayload) => Promise<void> | void
  onSuccess?: () => void
}) {
  const { closeModal } = useModals()

  const createInitialState = (): JoinEaraFormPayload => ({
    name: '',
    email: '',
    institution: '',
    country: '',
  })

  const [form, setForm] = useState<JoinEaraFormPayload>(createInitialState)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')

    try {
      if (onSubmit) {
        await onSubmit(form)
      } else if (submitUrl) {
        const response = await fetch(submitUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!response.ok) {
          throw new Error('Failed to submit join eara form')
        }
      } else {
        // Default fallback so data is not lost while integrations are set up
        console.info('JoinEaraForm payload', form)
      }
      setStatus('success')
      setForm(createInitialState())
      onSuccess?.()
    } catch (error) {
      console.error(error)
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <TextInput
        required
        label=""
        placeholder="Insert your name*"
        value={form.name}
        onChange={(event) => setForm((prev) => ({ ...prev, name: event.currentTarget?.value }))}
        radius="xl"
        size="lg"
        styles={{
          input: {
            // border: '1.5px solid #312F86',
            backgroundColor: 'transparent',
            color: '#312F86',
            transition: 'all 0.2s ease',
            '&:focus': {
              borderColor: '#312F86',
              backgroundColor: '#FFFFFF',
            },
            '&::placeholder': {
              color: '#312F86',
            },
          },
        }}
      />

      <TextInput
        required
        type="email"
        label=""
        placeholder="you@example.com*"
        value={form.email}
        onChange={(event) => setForm((prev) => ({ ...prev, email: event.currentTarget?.value }))}
        radius="xl"
        size="lg"
        styles={{
          input: {
            // border: '1.5px solid #312F86',
            backgroundColor: 'transparent',
            color: '#312F86',
            transition: 'all 0.2s ease',
            '&:focus': {
              borderColor: '#312F86',
              backgroundColor: '#FFFFFF',
            },
            '&::placeholder': {
              color: '#312F86',
            },
          },
        }}
      />

      <TextInput
        required
        label=""
        placeholder="Insert your institution*"
        value={form.institution}
        onChange={(event) =>
          setForm((prev) => ({ ...prev, institution: event.currentTarget?.value }))
        }
        radius="xl"
        size="lg"
        styles={{
          input: {
            // border: '1.5px solid #312F86',
            backgroundColor: 'transparent',
            color: '#312F86',
            transition: 'all 0.2s ease',
            '&:focus': {
              borderColor: '#312F86',
              backgroundColor: '#FFFFFF',
            },
            '&::placeholder': {
              color: '#312F86',
            },
          },
        }}
      />

      <TextInput
        required
        label=""
        placeholder="Country where you are based*"
        value={form.country}
        onChange={(event) => setForm((prev) => ({ ...prev, country: event.currentTarget?.value }))}
        radius="xl"
        size="lg"
        styles={{
          input: {
            // border: '1.5px solid #312F86',
            backgroundColor: 'transparent',
            color: '#312F86',
            transition: 'all 0.2s ease',
            '&:focus': {
              borderColor: '#312F86',
              backgroundColor: '#FFFFFF',
            },
            '&::placeholder': {
              color: '#312F86',
            },
          },
        }}
      />

      <Stack gap="xs">
        {status === 'success' && <Text c="green">Thank you for joining EARA!</Text>}
        {status === 'error' && <Text c="red">Something went wrong. Please try again.</Text>}
      </Stack>

      <Group justify="flex-end" gap="md">
        {/* <Button type="reset" variant="default" onClick={() => setForm(createInitialState())}>
          Clear
        </Button> */}
        <ButtonEara variant="with-arrow" type="submit" loading={isSubmitting} color="primaryColor">
          Join
        </ButtonEara>
      </Group>
    </form>
  )
}

export default function JoinEaraForm({
  triggerId = DEFAULT_TRIGGER_ID,
  title = 'Join EARA',
  buttonLabel = 'Join Now',
  description = 'Join our community and stay connected with us.',
  submitUrl,
  onSubmit,
  renderMode = 'inline',
}: JoinEaraFormProps) {
  const { closeModal } = useModals()

  const handleSuccess = useCallback(() => {
    if (renderMode === 'modal') {
      closeModal(triggerId)
    }
  }, [renderMode, triggerId, closeModal])

  const form = useMemo(
    () => (
      <JoinEaraFormComponent
        triggerId={triggerId}
        submitUrl={submitUrl}
        onSubmit={onSubmit}
        onSuccess={handleSuccess}
      />
    ),
    [triggerId, submitUrl, onSubmit, handleSuccess]
  )

  if (renderMode === 'inline') {
    return (
      <Stack gap={5}>
        <Box mb={20}>
          <Title order={3} c="primaryColor">
            {title}
          </Title>
          <Text>{description}</Text>
        </Box>
        {form}
      </Stack>
    )
  }

  return (
    <Stack gap="sm">
      <ModalTrigger triggerId={triggerId}>
        <ButtonEara variant="with-arrow" size="lg">
          {buttonLabel}
        </ButtonEara>
      </ModalTrigger>
      <ModalContent triggerId={triggerId} title={title} centered size="lg">
        {form}
      </ModalContent>
    </Stack>
  )
}
