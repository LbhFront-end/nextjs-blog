import Link from "next/link";
import { useSpring, animated } from "react-spring";
import type { SpringRef } from "react-spring";

interface BrandProps {
  siteTitle: string;
  springRef: SpringRef<any>;
}
export default function Brand({ siteTitle, springRef: ref }: BrandProps) {
  const beforeLineStyle = useSpring({
    ref,
    from: { left: "-100%" },
    to: { left: "0%" },
  });
  const afterLineStyle = useSpring({
    ref,
    from: { right: "-100%" },
    to: { right: "0" },
  });
  const siteTitleStyle = useSpring({
    ref,
    from: { top: "-30px" },
    to: { top: "0" },
  });
  return (
    <div className="site-brand-wrapper">
      <div className="site-meta">
        <div className="custom-logo-site-title">
          <Link href="/">
            <a className="brand" rel="start">
              <span className="logo-line-before">
                <animated.i className="" style={beforeLineStyle} />
              </span>
              <animated.span className="site-title" style={siteTitleStyle}>
                {siteTitle}
              </animated.span>
              <span className="logo-line-after">
                <animated.i className="" style={afterLineStyle} />
              </span>
            </a>
          </Link>
        </div>
        <h1 className="site-subtitle" itemProp="description"></h1>
      </div>
      <div className="site-nav-toggle">
        <button>
          <span className="btn-bar"></span>
          <span className="btn-bar"></span>
          <span className="btn-bar"></span>
        </button>
      </div>
    </div>
  );
}
