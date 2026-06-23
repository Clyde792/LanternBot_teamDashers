/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#FDFCFA',
    backgroundElement: '#F4F1EC',
    backgroundSelected: '#EAE4D9',
    textSecondary: '#6B6357',
    tint: '#B45309',
    tintSoft: '#FCEFD7',
  },
  dark: {
    text: '#F5F3EF',
    background: '#0E0D0B',
    backgroundElement: '#1C1A16',
    backgroundSelected: '#2A271F',
    textSecondary: '#A9A293',
    tint: '#F6B445',
    tintSoft: '#2A2113',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Lantern brand palette — the warm "light in the dark" glow used by the
 * lantern mark and accent surfaces. Kept separate from the semantic
 * theme colors above so the brand stays consistent across light/dark.
 */
export const Brand = {
  glow: '#F59E0B',
  glowDeep: '#D97706',
  flame: '#FFF6E2',
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
