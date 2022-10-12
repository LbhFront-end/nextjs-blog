import { allPosts } from 'contentlayer/generated'
import { compareDesc } from 'date-fns';
import { Pagination, Archive } from "components";
import { pageCount } from 'utils';
import config from "config";
import type { Post } from 'contentlayer/generated';
import type { GetStaticPaths, GetStaticProps } from 'next';

const { pagination } = config;

export default function Archives({ posts, count, pagination }) {
    return (
        <>
            <Archive posts={posts} count={count} />
            <Pagination pagination={pagination} prefix='archives' />
        </>

    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const total = pageCount(allPosts.length, pagination.size);
    const paths = [];
    Array.from(Array(total).keys()).forEach((path) => {
        paths.push({
            params: { page: `${path + 1}` },
        });
    });
    return {
        paths,
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const page = Number(params.page) || 1;
    const posts: Post[] = allPosts.sort((a, b) =>
        compareDesc(new Date(a.date), new Date(b.date))
    );
    const postCount = pageCount(allPosts.length, pagination.size)|| 0;
    const showPosts = {};
    posts.slice(pagination.size * (page - 1), pagination.size * page).forEach(post => {
        const year = post.date.split('-')[0]
        if (!showPosts[year]) showPosts[year] = [];
        showPosts[year].push(post)
    })

    return {
        props: {
            posts: showPosts,
            count: allPosts.length,
            pagination: {
                total: postCount,
                size: pagination.size,
                page
            },
        },
    };
};