import { useState } from 'react';
import Head from 'next/head';
import { allPosts } from 'contentlayer/generated'
import { Layout, Page, SidebarToggle, Sider } from "components";
import type { Post } from 'contentlayer/generated'
import type { GetStaticProps, GetStaticPaths } from 'next'


export default function Slug({ post }) {
    const [toggle, setToggle] = useState<boolean>(false);
    const { title, body: { html } } = post as Post;
    return (
        <Layout>
            <Head>
                <title>{title}</title>
            </Head>
            <div id="posts" className="posts-expand">
                <Page {...post} page />
            </div>
            <SidebarToggle toggle={toggle} onClick={() => { setToggle(!toggle) }} />
            <Sider toggle={toggle} page html={html} />
        </Layout>
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
    const post: Post = allPosts.find((post) => post.slug  === params.slug)
    return {
        props: {
            post,
        },
    }
}