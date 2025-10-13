import { Button, createTheme, MantineColorsTuple } from '@mantine/core'
import classes from './Button.module.css'
import TitleClasses from './Title.module.css'
const primaryColor: MantineColorsTuple = [
  '#f0f0fa',
  '#dddcee',
  '#b7b6de',
  '#908dcf',
  '#6f6bc2',
  '#5a55ba',
  '#4f4ab8',
  '#413ca2',
  '#393591',
  '#312f86',
]
const secondaryColor: MantineColorsTuple = [
  '#f6fde7',
  '#ecf7d6',
  '#d9edad',
  '#c4e481',
  '#b3db5c',
  '#a7d644',
  '#a1d337',
  '#8fbf29',
  '#7ba61f',
  '#689011',
]

const textColorDark: MantineColorsTuple = [
  '#121536',
  '#121536',
  '#121536',
  '#121536',
  '#121536',
  '#121536',
  '#121536',
  '#121536',
  '#121536',
  '#121536',
]

const earaDark: MantineColorsTuple = [
  '#f5f5f5',
  '#e7e7e7',
  '#cdcdcd',
  '#b2b2b2',
  '#9a9a9a',
  '#8b8b8b',
  '#848484',
  '#717171',
  '#656565',
  '#272727',
]

export const theme = createTheme({
  primaryColor: 'primaryColor',
  primaryShade: { dark: 9, light: 9 },
  colors: { primaryColor, secondaryColor, textColorDark, earaDark },
  fontFamily: 'var(--font-inter)',
  components: {
    Button: {
      classNames: classes,
      defaultProps: {
        radius: '100px',
      },
    },
    Title: {
      classNames: TitleClasses,
      styles: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
})
