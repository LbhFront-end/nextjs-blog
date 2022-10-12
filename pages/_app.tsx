import { useState } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { allPosts } from "contentlayer/generated";
import { Layout, SidebarToggle, Sider } from "components";
import config from "config";
import "lib/font-awesome/css/font-awesome.min.css";
import "styles/global.css";

const { siteTitle } = config;

interface MyAppProps extends AppProps {
  totalWords: string;
  html?: string;
  page?: boolean;
}

export default function App({ Component, pageProps }: MyAppProps) {
  const { totalWords } = allPosts[allPosts.length-1];
  const { html, page } = pageProps as MyAppProps;
  const [toggle, setToggle] = useState<boolean>(false);
  return (
    <Layout siteTitle={siteTitle} totalWords={totalWords}>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextNProgress color="#29d" height={2} options={{ showSpinner: false }} />
      <Component {...pageProps} />
      <SidebarToggle
        toggle={toggle}
        onClick={() => {
          setToggle(!toggle);
        }}
      />
      <Sider toggle={toggle} page={page} html={html} />
    </Layout>
  );
}