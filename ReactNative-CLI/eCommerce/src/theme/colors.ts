export const colors = {
  primary: '#2E8540',
  primaryDark: '#1F5C2D',
  primaryLight: '#8FD19E',
  background: '#F4F7F2',
  surface: '#FFFFFF',
  text: '#112011',
  mutedText: '#5F6B5F',
  border: '#E1E8DE',
  accent: '#FFB347',
  danger: '#E45858',
} as const;

export type ColorName = keyof typeof colors;

