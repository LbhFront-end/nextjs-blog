import { allPosts } from 'contentlayer/generated';
import { pick } from '@contentlayer/client';
import { compareDesc } from 'date-fns';
import { Brief, Pagination } from 'components';
import { pageCount } from 'utils';
import config from 'config';
import type { GetStaticProps, GetStaticPaths } from 'next';
import type { Post } from 'contentlayer/generated';
import type { PaginationProps } from 'components';

interface HomeProps {
  posts: Post[];
  pagination: PaginationProps['pagination'];
}

const { pagination } = config;

export default function Home({ posts = [], pagination }: HomeProps) {
  return (
    <>
      <section id="posts" className="posts-expand">
        {posts.map((post, idx) => (
          <Brief key={idx} {...post} />
        ))}
      </section>
      <Pagination pagination={pagination} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const total = pageCount(allPosts.length, pagination.size);
  const paths = [];
  Array.from(Array(total).keys()).forEach(path => {
    paths.push({
      params: { page: `${path + 1}` }
    });
  });
  return {
    paths,
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const posts = allPosts
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .map(post => pick(post, ['title', 'date', 'slug', 'brief', 'categories', 'readingTime']));

  const total = pageCount(allPosts.length, pagination.size);

  const page = Number(params.page) || 1;

  return {
    props: {
      posts: posts.slice(pagination.size * (page - 1), pagination.size * page),
      pagination: {
        total: total,
        size: pagination.size,
        page
      }
    }
  };
};
