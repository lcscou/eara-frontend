'use client'

import { Anchor, Box } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { IconArrowLeft, IconArrowRight, IconX } from '@tabler/icons-react'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'

import { TickerProps } from '@/lib/types'

import styles from './Ticker.module.css'

export default function Ticker({
  id,
  messages,
  autoPlay = true,
  autoPlayInterval = 5000,
  showNavigation = true,
  pauseOnHover = true,
  dismissible = false,
  onDismiss,
  position = 'static',
  bgColor = 'secondary',
  textColor = 'auto',
  className,
  // radius = 'xl',
  size = 'md',
}: TickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [messageOverflowStates, setMessageOverflowStates] = useState<Record<string, boolean>>({})
  const [messageScrollEndStates, setMessageScrollEndStates] = useState<Record<string, string>>({})
  const [messageAnimationDurationStates, setMessageAnimationDurationStates] = useState<
    Record<string, number>
  >({})
  const [isDismissed, setIsDismissed] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // State for screen size detection
  const [screenWidth, setScreenWidth] = useState(0)

  // Check if we should hide linkLabel on mobile
  const shouldHideLinkLabel = screenWidth <= 480
  const [scroll] = useWindowScroll()

  const getAnimationDurationFromTravelDistance = useCallback(
    (travelDistance: number) => {
      if (travelDistance <= 0) return 0

      // Base speed: 50px per second, with min/max bounds
      const baseSpeed = 50
      const calculatedDuration = (travelDistance / baseSpeed) * 1000

      let minDuration: number
      let maxDuration: number

      if (screenWidth <= 480) {
        minDuration = 3000
        maxDuration = 8000
      } else if (screenWidth <= 768) {
        minDuration = 4000
        maxDuration = 10000
      } else {
        minDuration = 5000
        maxDuration = 15000
      }

      return Math.max(minDuration, Math.min(maxDuration, calculatedDuration))
    },
    [screenWidth]
  )

  // Measure text width using temporary DOM element (reusable function)
  const measureTextWidth = useCallback((text: string, element?: HTMLElement) => {
    if (!element) return 0

    const computedStyle = window.getComputedStyle(element)

    // Create temporary element to measure text width
    const tempElement = document.createElement('span')
    tempElement.style.position = 'absolute'
    tempElement.style.visibility = 'hidden'
    tempElement.style.whiteSpace = 'nowrap'
    tempElement.style.fontSize = computedStyle.fontSize
    tempElement.style.fontFamily = computedStyle.fontFamily
    tempElement.style.fontWeight = computedStyle.fontWeight
    tempElement.style.letterSpacing = computedStyle.letterSpacing
    tempElement.textContent = text

    document.body.appendChild(tempElement)
    const textWidth = tempElement.offsetWidth
    document.body.removeChild(tempElement)

    return textWidth
  }, [])

  // Função para verificar overflow de todas as mensagens
  const checkAllMessagesOverflow = useCallback(() => {
    if (!textRef.current) return

    const element = textRef.current
    // textRef is on .messageText, we need to go up to .messageContainer
    const messageContainer = element.closest('[class*="messageContainer"]')
    if (!messageContainer) return

    const messageContainerWidth = messageContainer.clientWidth
    const newOverflowStates: Record<string, boolean> = {}
    const newScrollEndStates: Record<string, string> = {}
    const newAnimationDurationStates: Record<string, number> = {}

    // Check each message individually
    messages.forEach((message) => {
      // Measure text width using reusable function
      const textWidth = measureTextWidth(message.text, element)

      // Check if text needs animation (text wider than container)
      const travelDistance = textWidth - messageContainerWidth
      const needsAnimation = travelDistance > 0

      // Store the result
      newOverflowStates[message.id] = needsAnimation
      newScrollEndStates[message.id] = needsAnimation ? `-${travelDistance}px` : '0px'
      newAnimationDurationStates[message.id] =
        getAnimationDurationFromTravelDistance(travelDistance)
    })

    // Update all states at once
    setMessageOverflowStates(newOverflowStates)
    setMessageScrollEndStates(newScrollEndStates)
    setMessageAnimationDurationStates(newAnimationDurationStates)
  }, [messages, measureTextWidth, getAnimationDurationFromTravelDistance])

  // Effect to handle screen size detection and overflow recalculation
  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth)
      // Also recalculate overflow when screen size changes
      setTimeout(() => {
        checkAllMessagesOverflow()
      }, 50)
    }

    // Set initial width
    updateScreenWidth()

    // Add resize listener
    window.addEventListener('resize', updateScreenWidth)

    return () => {
      window.removeEventListener('resize', updateScreenWidth)
    }
  }, [checkAllMessagesOverflow])

  // Função interna para mudança de mensagem com fade
  const changeMessage = useCallback(
    (direction: 'next' | 'prev', isManual = false) => {
      if (isTransitioning || messages.length <= 1) return

      if (isManual && autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current)
        autoPlayTimeoutRef.current = null
      }

      setIsTransitioning(true)

      // Fade out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          if (direction === 'next') {
            return prevIndex === messages.length - 1 ? 0 : prevIndex + 1
          } else {
            return prevIndex === 0 ? messages.length - 1 : prevIndex - 1
          }
        })

        // Fade in
        setTimeout(() => {
          setIsTransitioning(false)
        }, 150) // Half of transition duration
      }, 150) // Half of transition duration
    },
    [messages.length, isTransitioning]
  )

  // Navegação para próxima mensagem (automática)
  const nextMessage = useCallback(() => {
    changeMessage('next', false)
  }, [changeMessage])

  // Navegação manual
  const handleNextClick = useCallback(() => {
    changeMessage('next', true)
  }, [changeMessage])

  const handlePrevClick = useCallback(() => {
    changeMessage('prev', true)
  }, [changeMessage])

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    setIsDismissed(true)
    onDismiss?.()
  }, [onDismiss])

  // Get current message overflow state
  const currentMessage = messages[currentIndex]
  const isCurrentMessageOverflowing = messageOverflowStates[currentMessage?.id] || false
  const currentScrollEnd = messageScrollEndStates[currentMessage?.id] || '0px'
  const currentAnimationDuration = messageAnimationDurationStates[currentMessage?.id] || 0

  // Auto-play functionality - usa timeout individual por mensagem
  useEffect(() => {
    if (!autoPlay || isPaused || messages.length <= 1) return

    // Clear any existing timeout
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current)
    }

    // Set timeout based on current message overflow status
    const timeoutDuration = isCurrentMessageOverflowing
      ? currentAnimationDuration
      : autoPlayInterval

    autoPlayTimeoutRef.current = setTimeout(() => {
      nextMessage()
    }, timeoutDuration)

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current)
        autoPlayTimeoutRef.current = null
      }
    }
  }, [
    autoPlay,
    isPaused,
    autoPlayInterval,
    nextMessage,
    messages.length,
    isCurrentMessageOverflowing,
    currentIndex,
    currentAnimationDuration,
  ])

  // Check text overflow for all messages when component mounts or messages change
  useEffect(() => {
    // Check overflow after a small delay to ensure DOM is updated
    const timeoutId = setTimeout(() => {
      checkAllMessagesOverflow()
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [messages, checkAllMessagesOverflow])

  useEffect(() => {
    checkAllMessagesOverflow()
  }, [currentIndex, checkAllMessagesOverflow])

  // Determine text color automatically
  const actualTextColor =
    textColor !== 'auto'
      ? textColor
      : bgColor === 'secondary' || bgColor === 'primary'
        ? 'white'
        : bgColor === 'light' || bgColor === 'white'
          ? 'dark'
          : 'white'

  // Handlers para pause on hover
  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true)
  }

  const handleMouseLeave = () => {
    if (pauseOnHover) setIsPaused(false)
  }

  // Se não há mensagens ou foi dismissed, não renderiza nada
  if (!messages?.length || isDismissed) return null

  const renderLinkSection = () => {
    if (!currentMessage.link) return null

    return (
      <Anchor
        href={currentMessage.link}
        target={currentMessage.target || '_self'}
        className={styles.linkSection}
        underline="never"
      >
        {!shouldHideLinkLabel && <span>{currentMessage.linkLabel || 'KNOW MORE'}</span>}
        <IconArrowRight className={styles.linkArrow} size={16} />
      </Anchor>
    )
  }

  return (
    <div
      className={clsx(styles.tickerWrapper, {
        [styles.fixedBottom]: position === 'fixed-bottom' && scroll.y < 5, // Show fixed bottom only after scrolling down a bit
        [styles.fixedTop]: position === 'fixed-top' || scroll.y >= 5,
      })}
    >
      {/* Mobile dismiss button - outside the main ticker container */}
      {dismissible && (
        <button
          className={clsx(styles.dismissButtonMobile, {
            [styles.bgPrimary]: bgColor === 'primary',
            [styles.bgSecondary]: bgColor === 'secondary',
            [styles.bgLight]: bgColor === 'light',
            [styles.bgDark]: bgColor === 'dark',
            [styles.bgWhite]: bgColor === 'white',
          })}
          onClick={handleDismiss}
          aria-label="Fechar ticker"
          type="button"
        >
          <IconX />
        </button>
      )}

      <Box
        id={id}
        className={clsx(
          styles.ticker,
          {
            [styles.bgPrimary]: bgColor === 'primary',
            [styles.bgSecondary]: bgColor === 'secondary',
            [styles.bgLight]: bgColor === 'light',
            [styles.bgDark]: bgColor === 'dark',
            [styles.bgWhite]: bgColor === 'white',
            [styles.textWhite]: actualTextColor === 'white',
            [styles.textDark]: actualTextColor === 'dark',
            [styles.sizeSm]: size === 'sm',
            [styles.sizeMd]: size === 'md',
            [styles.sizeLg]: size === 'lg',
          },

          className
        )}
        style={{
          borderRadius: scroll.y < 5 ? '50px' : '0  0 0.75rem 0.75rem ',
          color: actualTextColor === 'white' ? 'white' : 'var(--color-earaDark)',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Navigation arrows */}
        {showNavigation && messages.length > 1 && (
          <div className={styles.navigation}>
            <button
              className={styles.navButton}
              onClick={handlePrevClick}
              aria-label="Mensagem anterior"
              type="button"
            >
              <IconArrowLeft />
            </button>
            <button
              className={styles.navButton}
              onClick={handleNextClick}
              aria-label="Próxima mensagem"
              type="button"
            >
              <IconArrowRight />
            </button>
          </div>
        )}

        {/* Content */}
        <div
          className={clsx(styles.content, styles.messageContent, {
            [styles.transitioning]: isTransitioning,
          })}
        >
          <div className={styles.messageContainer}>
            <div className={styles.message}>
              <div
                key={`message-${currentMessage.id}-${isCurrentMessageOverflowing}`}
                ref={textRef}
                className={clsx(
                  styles.messageText,
                  isCurrentMessageOverflowing
                    ? styles.messageTextScrolling
                    : styles.messageTextStatic
                )}
                style={
                  {
                    '--animation-duration': `${currentAnimationDuration / 1000}s`,
                    '--scroll-end': currentScrollEnd,
                  } as React.CSSProperties
                }
              >
                {currentMessage.text}
              </div>
            </div>
          </div>
          {renderLinkSection()}
        </div>

        {/* Desktop dismiss button */}
        {dismissible && (
          <button
            className={styles.dismissButton}
            onClick={handleDismiss}
            aria-label="Fechar ticker"
            type="button"
          >
            <IconX />
          </button>
        )}
      </Box>
    </div>
  )
}
