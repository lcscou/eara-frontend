'use client'
import { ModalContent } from '@/components/ui/ModalContent/ModalContent'
import { ModalTrigger } from '@/components/ui/ModalTrigger/ModalTrigger'
import { useModals } from '@/contexts/ModalsContext'
import {
  Button,
  Group,
  Input,
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
  submitUrl,
  onSubmit,
  onSuccess,
}: {
  submitUrl?: string
  onSubmit?: (payload: SubscribeNewsLetterPayload) => Promise<void> | void
  onSuccess?: () => void
}) {
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
        <Input.Wrapper label="First name" size="sm" styles={{ label: { marginBottom: '8px' } }}>
          <TextInput
            required
            placeholder="e.g.: Jane"
            value={form.firstName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, firstName: event.currentTarget?.value }))
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
        </Input.Wrapper>
        <Input.Wrapper label="Last name" size="sm" styles={{ label: { marginBottom: '8px' } }}>
          <TextInput
            required
            placeholder="e.g.: Smith"
            value={form.lastName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, lastName: event.currentTarget?.value }))
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
        </Input.Wrapper>
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <Input.Wrapper label="Organisation" size="sm" styles={{ label: { marginBottom: '8px' } }}>
          <TextInput
            placeholder="e.g.: Oxford University"
            value={form.organization}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, organization: event.currentTarget?.value }))
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
        </Input.Wrapper>
        <Input.Wrapper label="Email" size="sm" styles={{ label: { marginBottom: '8px' } }}>
          <TextInput
            required
            type="email"
            placeholder="e.g.: jane.smith@edu.eu"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.currentTarget?.value }))
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
        </Input.Wrapper>
      </SimpleGrid>
      <Input.Wrapper label="Country" size="sm" styles={{ label: { marginBottom: '8px' } }}>
        <TextInput
          required
          placeholder="e.g.: United Kingdom"
          value={form.country}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, country: event.currentTarget?.value }))
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
      </Input.Wrapper>
      <Input.Wrapper label="Interests" size="sm" styles={{ label: { marginBottom: '8px' } }}>
        <MultiSelect
          required
          placeholder="e.g.: News Digest"
          data={INTEREST_OPTIONS}
          value={form.interests}
          onChange={(value) => setForm((prev) => ({ ...prev, interests: value }))}
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
            option: {
              '&[dataSelected]': {
                backgroundColor: '#312F86',
                color: '#FFFFFF',
              },
            },
          }}
        />
      </Input.Wrapper>
      <Stack gap="xs">
        <Text size="sm" c="dimmed">
          If you are interested in EARA&apos;s Policy Briefing, please provide your institutional
          email address. .
        </Text>
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
        submitUrl={submitUrl}
        onSubmit={onSubmit}
        onSuccess={handleSuccess}
      />
    ),
    [submitUrl, onSubmit, handleSuccess]
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
