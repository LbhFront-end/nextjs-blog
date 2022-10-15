import { allPosts } from 'contentlayer/generated'
import { pick } from 'contentlayer/client';
import { compareDesc } from 'date-fns';
import { Pagination, Archive } from "components";
import { NextSeo } from 'next-seo';
import { pageCount } from 'utils';
import config from "config";
import type { GetStaticPaths, GetStaticProps } from 'next';

const { pagination, site } = config;


export default function Archives({ posts, count, pagination, category }) {
    return (
        <>
            <NextSeo
                title={`分类-${category},${category}`}
                description={`博客分类,blog-${category}`}
                openGraph={{
                    title:`分类-${category},${category}`,
                    description:`博客分类,blog-${category}`,
                    url: `${site.url}/categories/${category}`
                }}
            />
            <Archive posts={posts} count={count} category={category} />
            <Pagination pagination={pagination} prefix={`categories/${category}`} />
        </>

    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const categories = allPosts.map(post => post.categories)
    const paths = [];
    categories.flat(2).forEach(category => paths.push({
        params: { category },
    }))
    return {
        paths,
        fallback: true,
    }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { category } = params;
    const showPosts = allPosts
        .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
        .map(post => pick(post, ['title', 'date', 'slug', 'categories', 'tags']))
        .filter(post => post.categories.includes(category as string))

    const postCount = pageCount(showPosts.length, pagination.size) || 0;

    return {
        props: {
            category,
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