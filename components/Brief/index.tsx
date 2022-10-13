import Link from "next/link";
import PostHeader from "../Page/header";
import { useSpring, animated } from "react-spring";
import type { Post } from "contentlayer/generated";

export default function Brief(props: Post) {
    const blockStyle = useSpring({
        form: {
            opacity: 0,
            transform: "translateY(-40px)",
        },
        to: {
            opacity: 1,
            transform: "translateY(0px)",
        },
    });

    const {
        slug,
        brief,
    } = props;

    return (
        <animated.article className="post post-type-normal" style={blockStyle}>
            <div className="post-block">
                <PostHeader {...props} />
                <div className="post-body">
                    {brief}
                    <div className="post-button text-center">
                        <Link href={`/blog/${slug}`}>
                            <a className="btn" rel="contents">
                                阅读全文 »
                            </a>
                        </Link>
                    </div>
                </div>
                <footer className="post-footer">
                    <div className="post-eof" />
                </footer>
            </div>
        </animated.article>
    );
}
