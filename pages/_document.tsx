import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://fastly.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/css/all.min.css"
        />
        <script async src="https://l2dwidget.js.org/lib/L2Dwidget.min.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
