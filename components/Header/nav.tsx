import Link from "next/link";
import { useSpring, animated } from "react-spring";
import type { SpringRef } from "react-spring";
import classNames from "classnames";

type NavType = {
  key: string;
  title: string;
  icon: string;
  link?: string;
};

interface NavProps {
  items: NavType[];
  springRef: SpringRef<any>;
  toggle: boolean;
}
export default function Nav({ items, springRef: ref, toggle }: NavProps) {
  const menuItemStyle = useSpring({
    ref,
    from: { transform: "translateY(-55px)" },
    to: { transform: "translateY(0px)" },
  });

  return (
    <nav className={classNames("site-nav", { "site-nav-on": toggle })} style={{ display: toggle ? 'block' : 'none' }}>
      <ul id="menu" className="menu">
        {items.map((nav) => (
          <animated.li
            key={nav.key}
            className="menu-item"
            style={menuItemStyle}
          >
            {nav.link ? (
              <Link href={nav.link} rel="section">
                <a>
                  <i className={`menu-item-icon fa fa-fw ${nav.icon}`}></i>{" "}
                  <br />
                  {nav.title}
                </a>
              </Link>
            ) : (
              <a onClick={() => { }} className="menu-item-search">
                <i className={`menu-item-icon fa fa-fw ${nav.icon}`}></i> <br />
                {nav.title}
              </a>
            )}
          </animated.li>
        ))}
      </ul>
    </nav>
  );
}
