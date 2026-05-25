'use client'

import { Group, Input, Stack, Text, Textarea, TextInput } from '@mantine/core'
import { FormEvent, useMemo, useState } from 'react'

import ButtonEara from '@/components/ui/ButtonEara/ButtonEara'

export type EaraFormFieldBlockName =
  | 'eara/form-number'
  | 'eara/form-phone'
  | 'eara/form-long-text'
  | 'eara/form-submit'
  | 'eara/form-short-text'
  | 'eara/form-email'

export type EaraFormFieldAttributes = {
  label?: string
  description?: string
  required?: boolean | string
  placeholder?: string
  className?: string
  loadingLabel?: string
}

export type EaraFormFieldBlock = {
  name: EaraFormFieldBlockName
  attributes?: EaraFormFieldAttributes
}

export type FormContainerProps = {
  recipient?: string
  successMessage?: string
  errorMessage?: string
  className?: string
  fields?: EaraFormFieldBlock[]
  submitUrl?: string
}

const WORDPRESS_GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT
const WORDPRESS_BASE_URL = WORDPRESS_GRAPHQL_ENDPOINT?.replace(/\/graphql\/?$/, '')
const DEFAULT_SUBMIT_URL = WORDPRESS_BASE_URL
  ? `${WORDPRESS_BASE_URL}/wp-json/eara/v1/send-email`
  : undefined

const INPUT_BLOCKS: EaraFormFieldBlockName[] = [
  'eara/form-number',
  'eara/form-phone',
  'eara/form-long-text',
  'eara/form-short-text',
  'eara/form-email',
]

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true'
  }

  return false
}

function toSafeString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

type ParsedField = {
  key: string
  type: EaraFormFieldBlockName
  label: string
  description: string
  required: boolean
  placeholder: string
  className: string
  loadingLabel?: string
}

function defaultLabelForType(type: EaraFormFieldBlockName): string {
  if (type === 'eara/form-email') return 'Email'
  if (type === 'eara/form-phone') return 'Phone'
  if (type === 'eara/form-number') return 'Number'
  if (type === 'eara/form-long-text') return 'Message'
  if (type === 'eara/form-submit') return 'Submit'

  return 'Text'
}

function buildMessageHtml(fields: ParsedField[], values: Record<string, string>): string {
  const rows = fields
    .filter((field) => field.type !== 'eara/form-submit')
    .map((field) => {
      const rawValue = values[field.key] ?? ''
      const safeValue = rawValue.trim() === '' ? 'N/A' : escapeHtml(rawValue)
      const safeLabel = escapeHtml(field.label)

      return `<tr><td style="padding:6px 0;color:#555555;width:180px;">${safeLabel}</td><td style="padding:6px 0;font-weight:bold;">${safeValue}</td></tr>`
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Form Submission</title>
</head>
<body style="margin:0;padding:0;background-color:#f2f2f2;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f2f2;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:16px;padding:30px 40px;">
          <tr>
            <td style="padding-bottom:20px;">
              <img src="https://www.eara.eu/logo-eara.svg" alt="Logo" style="display:block;">
            </td>
          </tr>
          <tr>
            <td style="font-size:16px;color:#000000;padding-bottom:20px;">
              You have received a new form submission.
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;color:#000000;">
                ${rows}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export default function FormContainer({
  recipient = '',
  successMessage = 'Thank you! Your message has been sent.',
  errorMessage = 'Something went wrong. Please try again.',
  className,
  fields = [],
  submitUrl = DEFAULT_SUBMIT_URL,
}: FormContainerProps) {
  const parsedFields = useMemo<ParsedField[]>(() => {
    return fields
      .filter((field): field is EaraFormFieldBlock => field && typeof field.name === 'string')
      .map((field, index) => {
        const attrs = field.attributes ?? {}
        const label = toSafeString(attrs.label).trim() || defaultLabelForType(field.name)

        return {
          key: `field-${index}`,
          type: field.name,
          label,
          description: toSafeString(attrs.description),
          required: toBoolean(attrs.required),
          placeholder: toSafeString(attrs.placeholder),
          className: toSafeString(attrs.className),
          loadingLabel: toSafeString(attrs.loadingLabel) || undefined,
        }
      })
      .filter((field) => [...INPUT_BLOCKS, 'eara/form-submit'].includes(field.type))
  }, [fields])

  const inputFields = useMemo(
    () => parsedFields.filter((field) => INPUT_BLOCKS.includes(field.type)),
    [parsedFields]
  )

  const submitField = useMemo(
    () => parsedFields.find((field) => field.type === 'eara/form-submit'),
    [parsedFields]
  )

  const createInitialState = useMemo(() => {
    return inputFields.reduce<Record<string, string>>((acc, field) => {
      acc[field.key] = ''
      return acc
    }, {})
  }, [inputFields])

  const [values, setValues] = useState<Record<string, string>>(() => createInitialState)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitLabel = submitField?.label || 'Submit'
  const loadingLabel = submitField?.loadingLabel || 'Sending...'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')

    try {
      if (submitUrl) {
        const html = buildMessageHtml(parsedFields, values)

        const response = await fetch(submitUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient: recipient.trim() || undefined,
            subject: 'New website form submission',
            html,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to submit form')
        }
      } else {
        console.info('FormContainer payload', { recipient, values })
      }

      setStatus('success')
      setValues(createInitialState)
    } catch (error) {
      console.error(error)
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (inputFields.length === 0) {
    return null
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={className ? `flex flex-col gap-6 ${className}` : 'flex flex-col gap-6'}
    >
      {inputFields.map((field) => {
        const commonProps = {
          required: field.required,
          placeholder: field.placeholder,
          value: values[field.key] ?? '',
          onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = event.currentTarget.value
            setValues((prev) => ({ ...prev, [field.key]: value }))
          },
          radius: 'xl' as const,
          size: 'lg' as const,
          className: field.className || undefined,
          styles: {
            input: {
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
          },
        }

        return (
          <Input.Wrapper
            key={field.key}
            label={field.label}
            description={field.description || undefined}
            required={field.required}
            size="sm"
            styles={{ label: { marginBottom: '8px' } }}
            className={field.className || undefined}
          >
            {field.type === 'eara/form-long-text' ? (
              <Textarea {...commonProps} minRows={4} autosize />
            ) : (
              <TextInput
                {...commonProps}
                type={
                  field.type === 'eara/form-email'
                    ? 'email'
                    : field.type === 'eara/form-phone'
                      ? 'tel'
                      : field.type === 'eara/form-number'
                        ? 'number'
                        : 'text'
                }
              />
            )}
          </Input.Wrapper>
        )
      })}

      <Stack gap="xs">
        {status === 'success' && <Text c="green">{successMessage}</Text>}
        {status === 'error' && <Text c="red">{errorMessage}</Text>}
      </Stack>

      <Group justify="flex-end" gap="md">
        <ButtonEara variant="with-arrow" type="submit" loading={isSubmitting} color="primaryColor">
          {isSubmitting ? loadingLabel : submitLabel}
        </ButtonEara>
      </Group>
    </form>
  )
}
