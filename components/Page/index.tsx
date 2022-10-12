import { useEffect } from "react";
import hljs from "highlight.js";
import Link from "next/link";
import PostHeader from "./header";
import { useSpring, animated } from "react-spring";
import { formatHtml } from "utils";
import type { Post } from "contentlayer/generated";

interface PageProps extends Post {
  page?: boolean;
}

export default function Page(props: PageProps) {
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

  useEffect(() => {
    hljs.initHighlighting();
  }, []);

  const {
    slug,
    page,
    body: { html },
  } = props;

  return (
    <animated.article className="post post-type-normal" style={blockStyle}>
      <div className="post-block">
        <PostHeader {...props} />
        {!page ? (
          <div className="post-body">
            {html.replace(/<[^>]+>/g, "").substring(0, 150)}...
            <div className="post-button text-center">
              <Link href={`/blog/${slug}`}>
                <a className="btn" rel="contents">
                  阅读全文 »
                </a>
              </Link>
            </div>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: formatHtml(html) }} />
        )}
        <footer className="post-footer">
          <div className="post-eof" />
        </footer>
      </div>
    </animated.article>
  );
}
