import { useEffect } from "react";
import hljs from "highlight.js";
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
  } = props;

  return (
    <animated.article className="post post-type-normal" style={blockStyle}>
      <div className="post-block">
        <PostHeader {...props} />
        <div dangerouslySetInnerHTML={{ __html: formatHtml(html) }} />
        <footer className="post-footer">
          <div className="post-eof" />
        </footer>
      </div>
    </animated.article>
  );
}
