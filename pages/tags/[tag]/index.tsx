import { allPosts } from 'contentlayer/generated';
import { pick } from 'contentlayer/client';
import { compareDesc } from 'date-fns';
import { Pagination, Archive } from 'components';
import { pageCount } from 'utils';
import { NextSeo } from 'next-seo';
import config from 'config';
import type { GetStaticPaths, GetStaticProps } from 'next';

const { pagination, site } = config;

export default function Archives({ posts, count, pagination, tag }) {
  return (
    <>
      <NextSeo
        title="标签,tags"
        description="博客标签,blog-tags"
        openGraph={{
          title: `标签-${tag}`,
          description: `博客标签,blog-tags-${tag}`,
          url: `${site.url}/tags/${tag}`
        }}
      />
      <Archive posts={posts} count={count} tag={tag} />
      <Pagination pagination={pagination} prefix={`tags/${tag}`} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = [...new Set(allPosts.map(post => post.tags))];
  const paths = [];
  tags.forEach(tag => paths.push({ params: { tag } }));

  return {
    paths,
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { tag } = params;
  const showPosts = allPosts
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .map(post => pick(post, ['title', 'date', 'slug', 'categories', 'tags']))
    .filter(post => post.tags === tag);

  const postCount = pageCount(showPosts.length, pagination.size) || 0;

  return {
    props: {
      tag,
      posts: showPosts.slice(0, pagination.size),
      count: showPosts.length,
      pagination: {
        total: postCount,
        size: pagination.size,
        page: 1
      }
    }
  };
};
