import { useSpring, animated } from "react-spring";
import Link from "next/link";
import type { Post } from 'contentlayer/generated';

interface ArchiveProps {
    posts: Post[];
    count: number;
    category?: boolean;
    tag?: boolean;
}


export default function Archive({ posts, count, category,tag }: ArchiveProps) {
    const titleStyle = useSpring({
        from: { opacity: 0, transform: 'translateX(-30px)' },
        to: { opacity: 1, transform: 'translateX(0px)' },
    });
    const articleHeaderStyle = useSpring({
        from: { opacity: 0, transform: 'translateY(-30px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
    });


    const Post = ({ post }) => (
        <article className="post post-type-normal">
            <animated.header className="post-header" style={articleHeaderStyle}>
                <h3 className="post-title">
                    <Link href={`/blog/${post.slug}`}>
                        <a className="post-title-link">
                            <span>{post.title}</span>
                        </a>
                    </Link>
                </h3>
                <div className="post-meta">
                    <time className="post-time" dateTime={post.date}>
                        {post.date.split('T')[0].substring(5)}
                    </time>
                </div>
            </animated.header>
        </article>
    )

    return (
        <div className="post-block archive">
            <div id="posts" className="posts-collapse">
                {(!category && !tag) && (
                    <>
                        <span className="archive-move-on" />
                        <span className="archive-page-counter">
                            非常好! 目前共计 {count} 篇日志。 继续努力。
                        </span>
                    </>
                )}
                {
                    (!category && !tag) && Object.keys(posts).sort((a: any, b: any) => b - a).map(year => (
                        <>
                            <animated.div className="collection-title" style={titleStyle}>
                                <h2 className="archive-year" id={`archive-year-${year}`}>{year}</h2>
                            </animated.div>
                            {posts[year].map(post => (<Post post={post} key={post.title} />))}
                        </>
                    ))
                }
                {
                    category && (
                        <>
                            <animated.div className="collection-title" style={titleStyle}>
                                <h2>{category}<small>分类</small></h2>
                            </animated.div>
                            {posts.map(post => (<Post post={post} key={post.title} />))}
                        </>

                    )
                }
                {
                    tag && (
                        <>
                            <animated.div className="collection-title" style={titleStyle}>
                                <h2>{tag}<small>标签</small></h2>
                            </animated.div>
                            {posts.map(post => (<Post post={post} key={post.title} />))}
                        </>

                    )
                }
            </div>
        </div>
    )
}