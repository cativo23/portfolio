import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        tokyo: {
          night: {
            bg: '#1a1b26',
            dark: '#16161e',
            text: '#a9b1d6',
            highlight: '#7aa2f7',
            secondary: '#2ac3de',
            danger: '#f7768e',
            warning: '#e0af68',
            success: '#9ece6a',
            info: '#bb9af7',
            muted: '#565f89',
            purple: '#bb9af7',
            red: '#f7768e',
            yellow: '#e0af68',
            green: '#9ece6a',
            cyan: '#7dcfff',
            blue: '#7aa2f7',
            magenta: '#bb9af7',
            orange: '#ff9e64',
            gray: '#565f89',
          },
          light: {
            bg: '#f5f5f5',
            dark: '#e0e0e0',
            text: '#1f1f1f',
            highlight: '#ff8c00',
            secondary: '#00bcd4',
            danger: '#e91e63',
            warning: '#ffeb3b',
            success: '#4caf50',
            info: '#2196f3',
            muted: '#757575',
            cyan: '#7dcfff',
            purple: '#bb9af7',
          },
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  daisyui: {
    styled: true,
    themes: [
      {
        "tokyodark": {
          "primary": "#7aa2f7",
          "primary-content": "#050a15",
          "secondary": "#2ac3de",
          "secondary-content": "#010e12",
          "accent": "#f471B5",
          "accent-content": "#14040c",
          "neutral": "#a9b1d6",
          "neutral-content": "#0a0c10",
          "base-100": "#16161e",
          "base-200": "#121219",
          "base-300": "#0d0d13",
          "base-content": "#c0caf5",
          "info": "#bb9af7",
          "info-content": "#0d0915",
          "success": "#9ece6a",
          "success-content": "#090f04",
          "warning": "#e0af68",
          "warning-content": "#120b04",
          "error": "#fb7085",
          "error-content": "#150406",
        },
      },
      'night'
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
  plugins: [typography, daisyui],
}

