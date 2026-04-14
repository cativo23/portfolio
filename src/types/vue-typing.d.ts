declare module '@dmncodes/vue-typing';

declare module '@toast-ui/editor' {
  export class Editor {
    constructor(options: {
      el: HTMLElement
      initialValue?: string
      initialEditType?: 'wysiwyg' | 'markdown'
      height?: string
      hideModeSwitch?: boolean
      events?: Record<string, () => void>
    })
    destroy(): void
    getMarkdown(): string
    setMarkdown(content: string): void
  }
}