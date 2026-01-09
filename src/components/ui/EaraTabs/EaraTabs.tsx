import { Box, Image, Stack, Tabs } from '@mantine/core'
import parse from 'html-react-parser'
import styles from './EaraTabs.module.css'

export type EaraTabItem = {
  id: string
  title: string
  content: string
  image?: {
    url?: string
    id?: number
    alt?: string
  }
}

export interface EaraTabsProps {
  tabs: EaraTabItem[]
  activeTab?: string
  layout?: 'vertical' | 'horizontal'
  className?: string
}

export default function EaraTabs({
  tabs,
  activeTab,
  layout = 'vertical',
  className,
}: EaraTabsProps) {
  if (!tabs || tabs.length === 0) return null

  const orientation = layout === 'vertical' ? 'vertical' : 'horizontal'
  const defaultValue = activeTab || tabs[0]?.id
  const panelSpacingStyle = {
    marginLeft: orientation === 'vertical' ? '2rem' : 0,
    marginTop: orientation === 'horizontal' ? '2rem' : 0,
  }

  return (
    <Box className={`${styles.root} ${className || ''}`.trim()}>
      <Tabs
        defaultValue={defaultValue}
        orientation={orientation}
        variant="pills"
        color="#8FBF29"
        classNames={{ tab: styles.tab, list: styles.list, panel: styles.panel }}
      >
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.id} value={tab.id}>
              {tab.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {tabs.map((tab) => (
          <Tabs.Panel key={tab.id} value={tab.id} style={panelSpacingStyle}>
            <Stack>
              {tab.image?.url && (
                <Image
                  src={tab.image.url}
                  alt={tab.image.alt || tab.title}
                  radius="md"
                  fit="cover"
                />
              )}
              {tab.content && <div>{parse(tab.content)}</div>}
            </Stack>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Box>
  )
}
