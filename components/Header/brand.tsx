import Link from "next/link";
import { useSpring, animated } from "react-spring";
import config from "config";
import type { SpringRef } from "react-spring";

const { site } = config;


interface BrandProps {
  springRef: SpringRef<any>;
  setToggle: any;
}
export default function Brand({springRef: ref, setToggle }: BrandProps) {
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
          <Link legacyBehavior href="/">
            <a className="brand" rel="start">
              <span className="logo-line-before">
                <animated.i className="" style={beforeLineStyle} />
              </span>
              <animated.span className="site-title" style={siteTitleStyle}>
                {site.title}
              </animated.span>
              <span className="logo-line-after">
                <animated.i className="" style={afterLineStyle} />
              </span>
            </a>
          </Link>
        </div>
        <h1 className="site-subtitle" itemProp="description"></h1>
      </div>
      <div className="site-nav-toggle" onClick={setToggle}>
        <button>
          <span className="btn-bar"></span>
          <span className="btn-bar"></span>
          <span className="btn-bar"></span>
        </button>
      </div>
    </div>
  );
}
