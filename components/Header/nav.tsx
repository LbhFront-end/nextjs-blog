import Link from "next/link";
import { useSpring, animated } from "react-spring";
import type { SpringRef } from "react-spring";

type NavType = {
  key: string;
  title: string;
  icon: string;
  link?: string;
};

interface NavProps {
  items: NavType[];
  springRef: SpringRef<any>;
}
export default function Nav({ items, springRef: ref }: NavProps) {
  const menuItemStyle = useSpring({
    ref,
    from: { transform: "translateY(-55px)" },
    to: { transform: "translateY(0px)" },
  });

  return (
    <nav className="site-nav">
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
              <a onClick={() => {}} className="menu-item-search">
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
