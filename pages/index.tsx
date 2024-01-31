import { allPosts } from 'contentlayer/generated';
import { pick } from 'contentlayer/client';
import { compareDesc } from 'date-fns';
import { Brief, Pagination } from 'components';
import { pageCount } from 'utils';
import config from 'config';
import { generateIndex } from 'lib';
import type { GetStaticProps } from 'next';
import type { Post } from 'contentlayer/generated';
import type { PaginationProps } from 'components';

interface HomeProps {
  posts: Post[];
  pagination: PaginationProps['pagination'];
}

const { pagination } = config;

export default function Home({ posts, pagination }: HomeProps) {
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

export const getStaticProps: GetStaticProps = async () => {
  await generateIndex(allPosts);
  const posts = allPosts
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .map(post => pick(post, ['title', 'date', 'slug', 'brief', 'categories', 'readingTime']));

  const postCount = pageCount(allPosts.length, pagination.size) || 0;
  let showPosts = [];
  showPosts = posts.slice(0, pagination.size);

  return {
    props: {
      posts: showPosts,
      pagination: {
        total: postCount,
        size: pagination.size,
        page: 1
      }
    }
  };
};
