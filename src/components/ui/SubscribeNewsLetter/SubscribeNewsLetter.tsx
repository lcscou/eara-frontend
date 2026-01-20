'use client'
import { ModalContent } from '@/components/ui/ModalContent/ModalContent'
import { ModalTrigger } from '@/components/ui/ModalTrigger/ModalTrigger'
import { useModals } from '@/contexts/ModalsContext'
import {
  Button,
  Group,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { FormEvent, useCallback, useMemo, useState } from 'react'
import ButtonEara from '../ButtonEara/ButtonEara'
export type SubscribeNewsLetterPayload = {
  firstName: string
  lastName: string
  organization: string
  email: string
  country: string
  interests: string[]
}
export type SubscribeNewsLetterProps = {
  triggerId?: string
  title?: string
  buttonLabel?: string
  description?: string
  submitUrl?: string
  onSubmit?: (payload: SubscribeNewsLetterPayload) => Promise<void> | void
  renderMode?: 'modal' | 'inline'
}
const DEFAULT_TRIGGER_ID = 'subscribe-newsletter'
const INTEREST_OPTIONS = [
  { value: 'news-digest', label: 'News Digest' },
  { value: 'policy-briefing', label: 'Policy Briefing' },
  { value: 'training-and-events', label: 'Training and events' },
]
function SubscribeNewsLetterForm({
  triggerId,
  submitUrl,
  onSubmit,
  onSuccess,
}: {
  triggerId: string
  submitUrl?: string
  onSubmit?: (payload: SubscribeNewsLetterPayload) => Promise<void> | void
  onSuccess?: () => void
}) {
  const { closeModal } = useModals()
  const createInitialState = (): SubscribeNewsLetterPayload => ({
    firstName: '',
    lastName: '',
    organization: '',
    email: '',
    country: '',
    interests: [],
  })
  const [form, setForm] = useState<SubscribeNewsLetterPayload>(createInitialState)
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
          throw new Error('Failed to submit newsletter form')
        }
      } else {
        // Default fallback so data is not lost while integrations are set up
        console.info('SubscribeNewsLetter payload', form)
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
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <TextInput
          required
          label=""
          placeholder="Insert your name*"
          value={form.firstName}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, firstName: event.currentTarget?.value }))
          }
          radius="xl"
          size="lg"
          styles={{
            input: {
              border: '1.5px solid #312F86',
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
          placeholder="Insert your name*"
          value={form.lastName}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, lastName: event.currentTarget?.value }))
          }
          radius="xl"
          size="lg"
          styles={{
            input: {
              border: '1.5px solid #312F86',
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
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <TextInput
          label=""
          placeholder="Insert your institution*"
          value={form.organization}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, organization: event.currentTarget?.value }))
          }
          radius="xl"
          size="lg"
          styles={{
            input: {
              border: '1.5px solid #312F86',
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
              border: '1.5px solid #312F86',
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
      </SimpleGrid>
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
            border: '1.5px solid #312F86',
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
      <MultiSelect
        required
        label=""
        placeholder="I am interested in*"
        data={INTEREST_OPTIONS}
        value={form.interests}
        onChange={(value) => setForm((prev) => ({ ...prev, interests: value }))}
        radius="xl"
        size="lg"
        styles={{
          input: {
            border: '1.5px solid #312F86',
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
          option: {
            '&[dataSelected]': {
              backgroundColor: '#312F86',
              color: '#FFFFFF',
            },
          },
        }}
      />
      <Stack gap="xs">
        <Text size="sm" c="dimmed">
          By subscribing, you agree with EARA&apos;s{' '}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">
            Privacy Policy
          </a>
          .
        </Text>
        {status === 'success' && <Text c="green">Thanks for subscribing!</Text>}
        {status === 'error' && <Text c="red">Something went wrong. Please try again.</Text>}
      </Stack>
      <Group justify="flex-end" gap="md">
        <Button type="reset" variant="default" onClick={() => setForm(createInitialState())}>
          Clear
        </Button>
        <Button type="submit" loading={isSubmitting} color="primaryColor">
          Subscribe
        </Button>
      </Group>
    </form>
  )
}
export default function SubscribeNewsLetter({
  triggerId = DEFAULT_TRIGGER_ID,
  title = 'Subscribe to our newsletter',
  buttonLabel = 'Subscribe',
  description = 'Subscribe to receive the latest updates from us. ',
  submitUrl = '/api/subscribe-mailchimp',
  onSubmit,
  renderMode = 'inline',
}: SubscribeNewsLetterProps) {
  const { closeModal } = useModals()

  const handleSuccess = useCallback(() => {
    if (renderMode === 'modal') {
      closeModal(triggerId)
    }
  }, [renderMode, triggerId, closeModal])

  const form = useMemo(
    () => (
      <SubscribeNewsLetterForm
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
      <Stack gap="sm">
        <Title order={6} size={30}>
          {title}
        </Title>
        <Text size="sm" c="earaDark.5">
          {description}
        </Text>
        {form}
      </Stack>
    )
  }
  return (
    <Stack gap="sm">
      <Title order={6} size={30}>
        {title}
      </Title>
      <Text size="sm" c="earaDark.5">
        {description}
      </Text>
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
