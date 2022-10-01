import { useState } from 'react';
import Head from 'next/head';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import { Layout, Page, SidebarToggle, Sider, Pagination } from 'components';
import { pageCount } from 'utils';
import config from 'config';
import type { GetStaticProps, GetStaticPaths } from 'next';
import type { Post } from 'contentlayer/generated'
import type { PaginationProps } from 'components';

interface HomeProps {
  posts: Post[];
  pagination: PaginationProps['pagination']
}

const { siteTitle, pagination } = config;

export default function Home({ posts, pagination }: HomeProps) {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <Layout siteTitle={siteTitle}>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section id="posts" className="posts-expand">
        {
          posts.map((post, idx) => (
            <Page key={idx} {...post} />
          ))
        }
      </section>
      <SidebarToggle toggle={toggle} onClick={() => { setToggle(!toggle) }} />
      <Sider toggle={toggle} />
      <Pagination pagination={pagination} />
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const total = pageCount(allPosts.length, pagination.size);
  const paths = [];
  Array.from(Array(total).keys()).forEach(path => {
    paths.push({
      params: { page: `${path + 1}` }
    })
  })
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const posts: Post[] = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
  const total = pageCount(allPosts.length, pagination.size);

  let showPosts = [];
  const page = Number(params.page) || 0;
  if (page == 1) {
    showPosts = posts.slice(pagination.size, pagination.size)
  }
  if (page == 2) {
    showPosts = posts.slice(pagination.size, pagination.size * page)
  }
  if (page > 2) {
    showPosts = posts.slice(pagination.size * page - pagination.size, pagination.size * page)
  }


  return {
    props: {
      posts: showPosts,
      pagination: {
        total: total,
        size: pagination.size,
        page
      }
    }
  }
}