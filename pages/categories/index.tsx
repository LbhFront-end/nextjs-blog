import { allPosts } from 'contentlayer/generated'
import { compareDesc } from 'date-fns';
import { Category } from "components";
import { NextSeo } from 'next-seo';
import config from 'config';
import type { Post } from 'contentlayer/generated';
import type { GetStaticProps } from 'next';

const { site } = config;

export default function Categories({ posts }) {
    const categories = Object.keys(posts)
    return (
        <div id="posts" className="posts-expand">
            <NextSeo
                title='分类,category'
                description='博客分类,blog-category'
                openGraph={{
                    title: `分类-${String(categories)}`,
                    description: `博客分类,blog-categories-${String(categories)}`,
                    url: `${site.url}/categories`
                }}
            />
            <div className="post-block page" >
                <header className="post-header" >
                    <h2 className="post-title">categories</h2>
                </header>
                <div className="post-body" >
                    <div className="category-all-page">
                        <div className="category-all-title">
                            目前共计 {categories.length} 个分类
                        </div>
                        <Category posts={posts} />
                    </div>
                </div>
            </div>
        </div>
    )
}


export const getStaticProps: GetStaticProps = async () => {
    const posts: Post[] = allPosts.sort((a, b) =>
        compareDesc(new Date(a.date)
            , new Date(b.date))
    );
    const showPosts = {};
    posts.forEach(post => {
        post.categories.forEach(category => {
            if (!showPosts[category]) showPosts[category] = 0;
            showPosts[category] += 1
        })
    })

    return {
        props: {
            posts: showPosts,
        },
    };
};