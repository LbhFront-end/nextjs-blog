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
    config: { duration: 1000 },
    form: {
      opacity: 0,
      display: "none",
      transform: "translateY(-40px)",
    },
    to: {
      opacity: 1,
      display: "block",
      transform: "translateY(-0px)",
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
    <article className="post post-type-normal">
      <animated.div className="post-block" style={blockStyle}>
        <PostHeader {...props} />
        {!page ? (
          <div className="post-body">
            <div className="post-button text-center">
              <Link href={`/blog/${slug}`}>
                <a className="btn" rel="contents">
                  阅读全文 »
                </a>
              </Link>
            </div>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: formatHtml(html) }}></div>
        )}
        <footer className="post-footer">
          <div className="post-eof" />
        </footer>
      </animated.div>
    </article>
  );
}
