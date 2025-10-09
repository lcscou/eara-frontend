import { ReactElement } from "react";

export interface PageTitleBarProps{
    title: string;
    author: string;
    date: string;
    readingTime: string;
}

export interface HeroProps{
    content: ReactElement;
    bgImageSrc?: string;

}

export interface CardProps {
  id: string
}

export interface ButtonEaraProps {
  id: string
}