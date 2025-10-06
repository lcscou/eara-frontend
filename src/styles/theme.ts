import { Button, createTheme, MantineColorsTuple } from "@mantine/core";
import classes from "./Button.module.css";
const primaryColor: MantineColorsTuple = [
  "#f0f0fa",
  "#dddcee",
  "#b7b6de",
  "#908dcf",
  "#6f6bc2",
  "#5a55ba",
  "#4f4ab8",
  "#413ca2",
  "#393591",
  "#312f86",
];
const secondaryColor: MantineColorsTuple = [
  "#f6fde7",
  "#ecf7d6",
  "#d9edad",
  "#c4e481",
  "#b3db5c",
  "#a7d644",
  "#a1d337",
  "#8fbf29",
  "#7ba61f",
  "#689011",
];

const textColorDark: MantineColorsTuple = Array.from(
  { length: 10 },
  () => "#121536"
);

export const theme = createTheme({
  primaryColor: "primaryColor",
  primaryShade: { dark: 9, light: 9 },
  colors: { primaryColor, secondaryColor, textColorDark },
  fontFamily: "var(--font-inter)",
  components: {
    Button: {
      classNames: classes,
    },
    Title: {
      styles: {
        root: {
          fontWeight: 700,
        },
      },
    },
  },
});
