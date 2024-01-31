import Link from 'next/link';
import PostHeader from '../Page/header';
import { useSpring, animated } from 'react-spring';

export default function Brief(props) {
  const { slug, brief, viewComponent = <></> } = props;

  const blockStyle = useSpring({
    delay: 1000,
    from: {
      opacity: 0,
      transform: 'translateY(-40px)'
    },
    to: {
      opacity: 1,
      transform: 'translateY(0px)'
    }
  });

  return (
    <animated.article className="post post-type-normal" style={blockStyle}>
      <div className="post-block">
        <PostHeader {...props} viewComponent={viewComponent} />
        <div className="post-body">
          {brief}
          <div className="post-button text-center">
            <Link className="btn" rel="contents" href={`/blog/${slug}`}>
              阅读全文 »
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
