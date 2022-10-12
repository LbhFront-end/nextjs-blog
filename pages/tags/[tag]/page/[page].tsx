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
    const tags = allPosts.map(post => post.tags);
    const paths = [];
    tags.forEach(tag => {
        const total = pageCount(allPosts.filter(post => post.tags === tag).length, pagination.size);
        Array.from(Array(total).keys()).forEach((path) => {
            paths.push({
                params: { tag, page: `${path + 1}` },
            });
        });
    })

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { tag } = params;
    const page = Number(params.page) || 1;
    const showPosts: Post[] = allPosts
        .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
        .filter(post => post.tags === tag)

    const postCount = pageCount(showPosts.length, pagination.size);

    return {
        props: {
            tag,
            posts: showPosts.slice(pagination.size * (page - 1), pagination.size * page),
            count: showPosts.length,
            pagination: {
                total: postCount,
                size: pagination.size,
                page,
            },
        },
    };
};