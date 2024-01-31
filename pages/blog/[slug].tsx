import Head from 'next/head';
import { allPosts } from 'contentlayer/generated';
import { pick } from 'contentlayer/client';
import { Page, Comment } from 'components';
import { ArticleJsonLd } from 'next-seo';
import config from 'config';
import type { Post } from 'contentlayer/generated';
import type { GetStaticProps, GetStaticPaths } from 'next';
import { handleTOC2Tree } from 'utils';

const { site } = config;

export default function Slug({ post, nextPost, previousPost }) {
  const { title } = post as Post;
  return (
    <>
      <ArticleJsonLd
        url={`${site.url}/blog/${post.slug}`}
        title={post.title}
        description={post.brief}
        datePublished={post.date}
        authorName={site.authorName}
        publisherName={site.publisherName}
        images={[]}
      />
      <Head>
        <title>{title}</title>
      </Head>
      <div id="posts" className="posts-expand">
        <Page {...post} shouldRegisterView nextPost={nextPost} previousPost={previousPost} />
        <Comment />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allPosts.map(post => ({ params: { slug: post.slug } }));
  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = allPosts.find(post => post.slug === params.slug);
  const {
    body: { html },
    ...restProps
  } = post;
  const currentPost = {
    html,
    ...[restProps].map(post => pick(post, ['brief', 'title', 'date', 'slug', 'categories', 'readingTime', 'tags']))[0]
  };
  const postIndex = post ? allPosts.indexOf(post) : -1;
  const nextPost = allPosts[postIndex + 1] || null;
  const previousPost = allPosts[postIndex - 1] || null;
  return {
    props: {
      post: currentPost,
      nextPost: {
        slug: nextPost?.slug || null,
        title: nextPost?.title || null
      },
      previousPost: {
        slug: previousPost?.slug || null,
        title: previousPost?.title || null
      },
      siderItems: handleTOC2Tree(html)
    }
  };
};
