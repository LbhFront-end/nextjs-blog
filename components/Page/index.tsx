import { useEffect } from "react";
import hljs from "highlight.js";
import Link from 'next/link';
import PostHeader from "./header";
import { useSpring, animated } from "react-spring";
import { formatHtml } from "utils";


export default function Page(props) {
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
    html,
    nextPost,
    previousPost,
    tags
  } = props;

  return (
    <animated.article className="post post-type-normal" style={blockStyle}>
      <div className="post-block">
        <PostHeader {...props} />
        <div dangerouslySetInnerHTML={{ __html: formatHtml(html) }} />
        <footer className="post-footer">
          <div className="post-tags">
            <Link href={`/tags/${tags}`}>
              <a >
                <i className="fa fa-tag" /> {tags}
              </a>
            </Link>

          </div>
          <div className="post-nav">
            {
              previousPost && (
                <div className="post-nav-next post-nav-item">
                  <Link href={`/blog/${previousPost.slug}`}>
                    <a rel="prev" title={previousPost.title}>
                      <i className="fa fa-chevron-left" /> {previousPost.title}
                    </a>
                  </Link>
                </div>
              )
            }

            <span className="post-nav-divider"></span>
            {
              nextPost && (
                <div className="post-nav-prev post-nav-item">
                  <Link href={`/blog/${nextPost.slug}`}>
                    <a rel="next" title={nextPost.title}>
                      {nextPost.title} <i className="fa fa-chevron-right" />
                    </a>
                  </Link>
                </div>
              )
            }
          </div>
        </footer>
      </div>
    </animated.article>
  );
}
