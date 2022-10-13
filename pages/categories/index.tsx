import { allPosts } from 'contentlayer/generated'
import { compareDesc } from 'date-fns';
import { Category } from "components";
import type { Post } from 'contentlayer/generated';
import type { GetStaticProps } from 'next';


export default function Categories({ posts }) {
    const categories = Object.keys(posts)
    return (
        <div id="posts" className="posts-expand">
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
        compareDesc(new Date(a.date), new Date(b.date))
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