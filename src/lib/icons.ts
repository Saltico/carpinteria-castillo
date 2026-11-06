// src/lib/icons.ts
// Icon name → SVG import map for Icon.astro component.
// Add new icons here as needed.

import menu from '@/assets/icons/menu.svg?raw';
import close from '@/assets/icons/close.svg?raw';
import sun from '@/assets/icons/sun.svg?raw';
import moon from '@/assets/icons/moon.svg?raw';
import arrowRight from '@/assets/icons/arrow-right.svg?raw';
import arrowLeft from '@/assets/icons/arrow-left.svg?raw';
import cabinet from '@/assets/icons/cabinet.svg?raw';
import door from '@/assets/icons/door.svg?raw';
import restore from '@/assets/icons/restore.svg?raw';
import email from '@/assets/icons/email.svg?raw';
import phone from '@/assets/icons/phone.svg?raw';
import whatsapp from '@/assets/icons/whatsapp.svg?raw';
import check from '@/assets/icons/check.svg?raw';

export const iconMap = {
  menu,
  close,
  sun,
  moon,
  'arrow-right': arrowRight,
  'arrow-left': arrowLeft,
  cabinet,
  door,
  restore,
  email,
  phone,
  whatsapp,
  check,
} as const;

export type IconName = keyof typeof iconMap;
