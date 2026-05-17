import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
  themes: ['github-dark'],
  useDarkModeMediaQuery: false,

  styleOverrides: {
    borderRadius: '8px',
    borderColor: 'var(--border)',
    codeBackground: 'var(--muted-dark)',
    codeForeground: 'var(--foreground)',
    codeFontSize: '0.85rem',
    codePaddingBlock: '1rem',
    codePaddingInline: '1.35rem',
    gutterBorderColor: 'var(--border)',
    gutterForeground: 'var(--foreground-dark)',
    uiFontSize: '0.85rem',
    scrollbarThumbColor: 'var(--scrollbar-thumb)',
    frames: {
      editorBackground: 'var(--muted-dark)',
      frameBoxShadowCssValue: 'none',
    },
  },
});
