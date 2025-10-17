import {
  Card as MantineCard,
  Image,
  Title,
  Text,
  Button,
  Anchor,
  Group,
  Stack,
  Avatar,
  Box,
} from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import clsx from 'clsx'
import styles from './Card.module.css'
import { CardProps } from '@/lib/types'

export default function Card({
  id,
  variant = 'horizontal',
  title,
  description,
  image,
  imagePosition = 'left',
  icon,
  avatar,
  avatarSize = 'large',
  date,
  textAlign = 'left',
  bgColor = 'white',
  links = [],
  button,
  className,
  withBorder = true,
  shadow = 'sm',
  radius = 'md',
}: CardProps) {
  // Blocos reutilizáveis
  const renderButton = () => {
    if (!button) return null

    // Se a variante for 'anchor-text', renderiza Anchor
    if (button.variant === 'anchor-text') {
      return (
        <Anchor href={button.href} target={button.target || '_self'} underline="not-hover">
          {button.label}
        </Anchor>
      )
    }

    // Para outras variantes ('filled', 'outline'), renderiza Button
    return (
      <Button
        variant={button.variant || 'outline'}
        size="sm"
        mt="sm"
        component={button.href ? 'a' : 'button'}
        href={button.href}
        onClick={button.onClick}
        className={styles.button}
      >
        {button.label}
      </Button>
    )
  }

  const renderAvatar = () => {
    if (!avatar) return null

    const isSmall = avatarSize === 'small'
    const containerClass = isSmall ? styles.avatarContainerSmall : styles.avatarContainer
    const avatarClass = isSmall ? styles.avatarSmall : styles.avatar
    const size = isSmall ? 60 : 120

    return (
      <Box className={containerClass}>
        <Avatar src={avatar} size={size} radius="50%" className={avatarClass} />
      </Box>
    )
  }

  const renderLinks = () => {
    if (!links || links.length === 0) return null
    return (
      <Stack gap="xs" mt="sm" w="100%">
        {/* Linha divisória no topo */}
        <Box className={styles.linksDivider} />

        {links.map((link, index) => (
          <Box key={index} className={styles.linkContainer}>
            <Anchor href={link.href} className={styles.linkFull} underline="never">
              <Group justify="space-between" align="center" className={styles.linkGroup}>
                <Text size="sm" fw={500} className={styles.linkText}>
                  {link.label}
                </Text>
                {link.variant === 'arrow' && (
                  <IconArrowRight size={16} className={styles.linkArrow} />
                )}
              </Group>
              <Box className={styles.linkUnderline} />
            </Anchor>
          </Box>
        ))}
      </Stack>
    )
  }

  const renderImage = (containerClass: string, imageClass: string) => {
    if (!image) return null
    return (
      <Box className={containerClass}>
        <Image src={image} alt={title} className={imageClass} />
      </Box>
    )
  }

  const renderContent = (
    stackProps = {},
    titleProps = {},
    descriptionProps = {},
    includeAvatar = true,
    includeIcon = true,
    includeButton = true,
    useSimpleTitle = false
  ) => {
    // Determinar alinhamento baseado na prop textAlign
    const alignmentProps = textAlign === 'center'
      ? { align: 'center' as const, style: { textAlign: 'center' as const } }
      : { align: 'flex-start' as const, style: { textAlign: 'left' as const } }

    const groupJustify = textAlign === 'center' ? 'center' : 'flex-start'

    return (
      <Stack gap="xs" p="lg" {...alignmentProps} {...stackProps}>
        {includeAvatar && renderAvatar()}

        {/* Título com ou sem ícone */}
        {useSimpleTitle ? (
          <Text size="lg" fw={600} className={styles.title} {...titleProps}>
            {title}
          </Text>
        ) : (
          <Group gap="xs" justify={groupJustify}>
            {includeIcon && icon && <Box className={styles.iconContainer}>{icon}</Box>}
            <Title order={3} fw={600} className={styles.title} {...titleProps}>
              {title}
            </Title>
          </Group>
        )}

        <Text size="sm" className={styles.description} {...descriptionProps}>
          {description}
        </Text>
        {date && (
          <Text size="sm" fw={500} className={styles.date}>
            {date}
          </Text>
        )}
        {renderLinks()}
        {includeButton && renderButton()}
      </Stack>
    )
  }

  const renderContentBox = (additionalClasses: string[] = []) => (
    <Box
      className={clsx(
        styles.verticalHalfContent,
        styles.verticalHalfContentRadius,
        {
          [styles.bgLight]: bgColor === 'light',
          [styles.bgDark]: bgColor === 'dark',
          [styles.bgWhite]: bgColor === 'white',
        },
        ...additionalClasses
      )}
    >
      {renderContent()}
    </Box>
  )

  const renderHorizontalContentBox = (additionalClasses: string[] = []) => (
    <Box
      className={clsx(
        styles.horizontalHalfContent,
        styles.horizontalHalfContentRadius,
        {
          [styles.bgLight]: bgColor === 'light',
          [styles.bgDark]: bgColor === 'dark',
          [styles.bgWhite]: bgColor === 'white',
        },
        ...additionalClasses
      )}
    >
      {renderContent()}
    </Box>
  )

  const renderCardContent = () => {
    const hasImage = !!image

    if (variant === 'vertical') {
      if (hasImage) {
        // Vertical com imagem (vertical-half)
        return (
          <>
            {renderImage(styles.verticalHalfImageContainer, styles.verticalHalfImage)}
            {renderContentBox()}
          </>
        )
      } else {
        // Vertical sem imagem (vertical-full)
        return (
          <Stack gap="md" className={styles.avatarCard}>
            {renderAvatar()}
            {renderContent(
              { align: 'center', className: styles.content },
              { ta: 'center' },
              { c: 'dimmed', ta: 'center' },
              false
            )}
          </Stack>
        )
      }
    } else {
      // variant === 'horizontal'
      if (hasImage) {
        // Horizontal com imagem (horizontal-half)
        return (
          <>
            {imagePosition === 'left' ? (
              // Imagem à esquerda
              <>
                {renderImage(styles.horizontalHalfImageContainer, styles.horizontalHalfImage)}
                {renderHorizontalContentBox()}
              </>
            ) : (
              // Imagem à direita
              <>
                {renderHorizontalContentBox()}
                {renderImage(styles.horizontalHalfImageContainer, styles.horizontalHalfImage)}
              </>
            )}
          </>
        )
      } else {
        // Horizontal sem imagem (default)
        return (
          <Stack gap="md">
            {renderContent(
              { className: styles.content },
              {},
              { c: 'dimmed' },
              true, // includeAvatar
              true, // includeIcon
              false, // includeButton
              true // useSimpleTitle
            )}
          </Stack>
        )
      }
    }
  }

  const hasImage = !!image
  const isVerticalWithImage = variant === 'vertical' && hasImage
  const isHorizontalWithImage = variant === 'horizontal' && hasImage

  return (
    <MantineCard
      id={id}
      withBorder={withBorder}
      shadow={shadow}
      radius={radius}
      padding="lg"
      className={clsx(
        styles.card,
        isVerticalWithImage && styles.verticalHalf,
        isHorizontalWithImage && styles.horizontalHalf,
        !isVerticalWithImage && !isHorizontalWithImage && {
          [styles.bgLight]: bgColor === 'light',
          [styles.bgDark]: bgColor === 'dark',
          [styles.bgWhite]: bgColor === 'white',
        },
        className
      )}
    >
      {renderCardContent()}
    </MantineCard>
  )
}
