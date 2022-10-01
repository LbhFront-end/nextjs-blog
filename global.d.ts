declare module 'remark-html' {
  const html: any
  export default html
}

declare global {
  const L2Dwidget: {
    init:Function;
  };
}

declare module 'remark-gfm';
declare module 'rehype-slug';
declare module 'rehype-autolink-headings';
declare module 'rehype-code-titles';
declare module 'rehype-prism-plus';
declare module 'rehype-accessible-emojis';