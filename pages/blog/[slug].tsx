import Head from 'next/head';
import { allPosts } from 'contentlayer/generated'
import { pick } from 'contentlayer/client';
import { Page } from "components";
import type { Post } from 'contentlayer/generated'
import type { GetStaticProps, GetStaticPaths } from 'next'


export default function Slug({ post }) {
    const { title } = post as Post;
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div id="posts" className="posts-expand">
                <Page {...post} shouldRegisterView />
            </div>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = allPosts.map((post) => ({ params: { slug: post.slug } }));
    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { body: { html }, ...restProps } = allPosts.find((post) => post.slug === params.slug);
    const post = {
        html,
        ...[restProps].map(post => pick(post, ['title', 'date', 'slug', 'categories', 'readingTime', 'tags']))[0]
    }
    return {
        props: {
            post
        },
    }
}