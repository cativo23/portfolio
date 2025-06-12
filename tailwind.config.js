import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{vue,js,ts}',
    './content/**/*.md',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        tokyo: {
          css: {
            '--tw-prose-body': theme('colors.tokyo.night.text'),
            '--tw-prose-headings': theme('colors.tokyo.night.highlight'),
            '--tw-prose-lead': theme('colors.tokyo.night.muted'),
            '--tw-prose-links': theme('colors.tokyo.night.cyan'),
            '--tw-prose-bold': theme('colors.tokyo.night.text'),
            '--tw-prose-counters': theme('colors.tokyo.night.gray'),
            '--tw-prose-bullets': theme('colors.tokyo.night.cyan'),
            '--tw-prose-hr': theme('colors.tokyo.night.dark'),
            '--tw-prose-quotes': theme('colors.tokyo.night.text'),
            '--tw-prose-quote-borders': theme('colors.tokyo.night.red'),
            '--tw-prose-captions': theme('colors.tokyo.night.muted'),
            '--tw-prose-code': theme('colors.tokyo.night.green'),
            '--tw-prose-pre-code': theme('colors.tokyo.night.text'),
            '--tw-prose-pre-bg': theme('colors.tokyo.night.dark'),
            '--tw-prose-th-borders': theme('colors.tokyo.night.gray'),
            '--tw-prose-td-borders': theme('colors.tokyo.night.muted'),
            '--tw-prose-invert-body': theme('colors.tokyo.light.text'),
            '--tw-prose-invert-headings': theme('colors.tokyo.light.text'),
            '--tw-prose-invert-lead': theme('colors.tokyo.light.gray'),
            '--tw-prose-invert-links': theme('colors.tokyo.light.cyan'),
            '--tw-prose-invert-bold': theme('colors.tokyo.light.text'),
            '--tw-prose-invert-counters': theme('colors.tokyo.light.gray'),
            '--tw-prose-invert-bullets': theme('colors.tokyo.light.cyan'),
            '--tw-prose-invert-hr': theme('colors.tokyo.light.dark'),
            '--tw-prose-invert-quotes': theme('colors.tokyo.light.text'),
            '--tw-prose-invert-quote-borders': theme('colors.tokyo.light.cyan'),
            '--tw-prose-invert-captions': theme('colors.tokyo.light.gray'),
            '--tw-prose-invert-code': theme('colors.tokyo.light.green'),
            '--tw-prose-invert-pre-code': theme('colors.tokyo.light.text'),
            '--tw-prose-invert-pre-bg': theme('colors.tokyo.light.bg'),
            '--tw-prose-invert-th-borders': theme('colors.tokyo.light.gray'),
            '--tw-prose-invert-td-borders': theme('colors.tokyo.light.muted'),

            // Custom improvements for better Tokyo Night look
            'color': theme('colors.tokyo.night.text'),
            'background-color': theme('colors.tokyo.night.bg'),
            'font-family': theme('fontFamily.mono').join(', '),
            'a': {
              color: theme('colors.tokyo.night.cyan'),
              'text-decoration': 'underline',
              'font-weight': 'bold',
            },
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.tokyo.night.highlight'),
              'font-family': theme('fontFamily.mono').join(', '),
            },
            'code': {
              color: theme('colors.tokyo.night.green'),
              'background-color': theme('colors.tokyo.night.dark'),
              'font-family': theme('fontFamily.mono').join(', '),
              'padding': '0.2em 0.4em',
              'border-radius': '4px',
            },
            'pre': {
              color: theme('colors.tokyo.night.text'),
              'background-color': theme('colors.tokyo.night.dark'),
              'font-family': theme('fontFamily.mono').join(', '),
              'border-radius': '8px',
              'padding': '1em',
            },
            'blockquote': {
              color: theme('colors.tokyo.night.text'),
              'border-left': `4px solid ${theme('colors.tokyo.night.red')}`,
              'padding-left': '1em',
              'font-style': 'italic',
            },
            'table': {
              color: theme('colors.tokyo.night.text'),
              'background-color': theme('colors.tokyo.night.bg'),
            },
            'th': {
              color: theme('colors.tokyo.night.highlight'),
              'font-weight': 'bold',
            },
            'tr': {
              'border-bottom': `1px solid ${theme('colors.tokyo.night.gray')}`,
            },
            'ul, ol': {
              color: theme('colors.tokyo.night.text'),
            },
            'hr': {
              borderColor: theme('colors.tokyo.night.dark'),
            },
          },
        },
      }),
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
        mono: ['Source Code Pro', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [typography],
}

