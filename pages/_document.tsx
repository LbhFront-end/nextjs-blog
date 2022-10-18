import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="baidu-site-verification" content="code-ZzPkop5YwG" />
        <link
          rel="stylesheet"
          href="https://fastly.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.6.0/build/styles/night-owl.min.css"
        />
        <Script
          strategy="beforeInteractive"
          src="https://l2dwidget.js.org/lib/L2Dwidget.min.js"
        />
        <Script
          strategy="beforeInteractive"
          src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js"
        />
        <Script
          strategy="beforeInteractive"
          src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.6.0/build/highlight.min.js"
        />
        <Script
          strategy="beforeInteractive"
          src="https://hm.baidu.com/hm.js?42b6e25f11511e5785c284cff52f342e"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
