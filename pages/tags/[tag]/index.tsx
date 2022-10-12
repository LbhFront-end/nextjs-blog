import { allPosts } from 'contentlayer/generated'
import { compareDesc } from 'date-fns';
import { Pagination, Archive } from "components";
import { pageCount } from 'utils';
import config from "config";
import type { Post } from 'contentlayer/generated';
import type { GetStaticPaths, GetStaticProps } from 'next';

const { pagination } = config;


export default function Archives({ posts, count, pagination, tag }) {
    return (
        <>
            <Archive posts={posts} count={count} tag={tag} />
            <Pagination pagination={pagination} prefix={`tags/${tag}`} />
        </>

    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const tags = [...new Set(allPosts.map(post => post.tags))]
    const paths = [];
    tags.forEach(tag => paths.push({ params: { tag } }))

    return {
        paths,
        fallback: true,
    }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { tag } = params;
    const showPosts: Post[] = allPosts
        .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
        .filter(post => post.tags === tag)

    const postCount = pageCount(showPosts.length, pagination.size) || 0;

    return {
        props: {
            tag,
            posts: showPosts.slice(0, pagination.size),
            count: showPosts.length,
            pagination: {
                total: postCount,
                size: pagination.size,
                page: 1,
            },
        },
    };
};