import typography from '@tailwindcss/typography';
import nightwirePreset from './.nightwire/tailwind.preset.js';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [nightwirePreset],
  content: [
    './src/pages/**/*.{vue,js,ts}',
    './src/content/**/*.md',
    './src/components/**/*.{vue,js,ts}',
    './src/layouts/**/*.{vue,js,ts}',
    './src/app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sys:    ['JetBrains Mono', 'Cascadia Mono', 'ui-monospace', 'monospace'],
        mono:   ['JetBrains Mono', 'Cascadia Mono', 'ui-monospace', 'monospace'],
        title:  ['Noto Serif Display', 'Times New Roman', 'serif'],
        stamp:  ['Saira Extra Condensed', 'Impact', 'sans-serif'],
        mincho: ['Shippori Mincho B1', 'YuMincho', 'serif'],
      },
      typography: () => ({
        nightwire: {
          css: {
            '--tw-prose-body': 'var(--nw-text-dim)',
            '--tw-prose-headings': 'var(--nw-text)',
            '--tw-prose-lead': 'var(--nw-text-dim)',
            '--tw-prose-links': 'var(--nw-primary)',
            '--tw-prose-bold': 'var(--nw-text)',
            '--tw-prose-counters': 'var(--nw-text-dim)',
            '--tw-prose-bullets': 'var(--nw-primary-dim)',
            '--tw-prose-hr': 'var(--nw-text-line)',
            '--tw-prose-quotes': 'var(--nw-text)',
            '--tw-prose-quote-borders': 'var(--nw-primary-dim)',
            '--tw-prose-captions': 'var(--nw-text-dim)',
            '--tw-prose-code': 'var(--nw-cyan)',
            '--tw-prose-pre-code': 'var(--nw-text)',
            '--tw-prose-pre-bg': 'var(--void-panel)',
            '--tw-prose-th-borders': 'var(--nw-text-line)',
            '--tw-prose-td-borders': 'var(--nw-text-faint)',
            'color': 'var(--nw-text-dim)',
            'font-family': 'var(--font-sys)',
            'a': {
              color: 'var(--nw-primary)',
              'text-decoration': 'underline',
              'font-weight': '500',
            },
            'h1, h2, h3, h4, h5, h6': {
              color: 'var(--nw-text)',
              'font-family': 'var(--font-title)',
            },
            'code': {
              color: 'var(--nw-cyan)',
              'background-color': 'var(--void-panel)',
              'padding': '0.2em 0.4em',
              'border-radius': '2px',
            },
            'pre': {
              color: 'var(--nw-text)',
              'background-color': 'var(--void-panel)',
              'border': '1px solid var(--nw-text-line)',
              'border-radius': '4px',
              'padding': '1em',
            },
            'blockquote': {
              color: 'var(--nw-text-dim)',
              'border-left': '3px solid var(--nw-primary-dim)',
              'padding-left': '1em',
              'font-style': 'italic',
            },
            '.badges': {
              'display': 'flex',
              'flex-wrap': 'wrap',
              'gap': '0.4rem',
              'align-items': 'center',
              'margin': '0 0 1.5rem 0',
            },
            '.badges a': {
              'display': 'inline-flex',
              'text-decoration': 'none',
              'margin': '0',
            },
            '.badges img': {
              'display': 'inline-block',
              'margin': '0',
              'height': '20px',
              'border-radius': '3px',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
}
