import { useState } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import NextNProgress from "nextjs-progressbar";
import { NextSeo } from "next-seo";
import { allPosts } from "contentlayer/generated";
import { Layout, SidebarToggle, Sider } from "components";
import { TreeData } from 'utils';
import config from "config";
import "lib/font-awesome/css/font-awesome.min.css";
import "styles/global.css";
import "styles/loading.css";

const { site } = config;

interface MyAppProps extends AppProps {
  totalWords: string;
  siderItems?: TreeData[];
  page?: boolean;
}

export default function App({ Component, pageProps }: MyAppProps) {
  const { totalWords } = allPosts[allPosts.length - 1];
  const { siderItems=[] } = pageProps as MyAppProps;
  const [toggle, setToggle] = useState<boolean>(false);
  return (
    <Layout totalWords={totalWords}>
      <NextSeo
        title={site.title}
        description={site.description}
        canonical={site.url}
      />
      <Head>
        <title>{site.title}</title>
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
      <Sider toggle={toggle} siderItems={siderItems} />
    </Layout>
  );
}