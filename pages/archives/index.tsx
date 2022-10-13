import { allPosts } from 'contentlayer/generated'
import { pick } from 'contentlayer/client';
import { compareDesc } from 'date-fns';
import { Pagination, Archive } from "components";
import { pageCount } from 'utils';
import config from "config";
import type { GetStaticProps } from 'next';

const { pagination } = config;


export default function Archives({ posts, count, pagination }) {
    return (
        <>
            <Archive posts={posts} count={count} />
            <Pagination pagination={pagination} prefix='archives' />
        </>

    )
}

export const getStaticProps: GetStaticProps = async () => {
    const posts = allPosts
        .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
            .map(post => pick(post, ['title', 'date', 'slug', 'categories', 'tags']));
    const postCount = pageCount(allPosts.length, pagination.size) || 0;
    const showPosts = {};
    posts.slice(0, pagination.size).forEach(post => {
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
                page: 1,
            },
        },
    };
};