import { allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import { Page, Pagination } from "components";
import { pageCount } from "utils";
import config from "config";
import type { GetStaticProps } from "next";
import type { Post } from "contentlayer/generated";
import type { PaginationProps } from "components";

interface HomeProps {
  posts: Post[];
  pagination: PaginationProps["pagination"];
}

const { pagination } = config;

export default function Home({ posts, pagination }: HomeProps) {
  return (
    <>
      <section id="posts" className="posts-expand">
        {posts.map((post, idx) => (
          <Page key={idx} {...post} />
        ))}
      </section>
      <Pagination pagination={pagination} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts: Post[] = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );
  const postCount = pageCount(allPosts.length, pagination.size);
  let showPosts = [];
  showPosts = posts.slice(0, pagination.size);

  return {
    props: {
      posts: showPosts,
      pagination: {
        total: postCount,
        size: pagination.size,
        page: 1,
      },
    },
  };
};
