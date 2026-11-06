// src/types/navigation.ts

export interface NavItem {
  label: string;
  url: string;
  children?: NavItem[];
  icon?: string;
}

export interface NavigationProps {
  items: NavItem[];
  activePath?: string;
  ariaLabel?: string;
  variant?: 'default' | 'dark';
}
