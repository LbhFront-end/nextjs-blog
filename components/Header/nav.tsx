import Link from 'next/link';
import { useSpring, animated } from 'react-spring';
import type { SpringRef } from 'react-spring';
import classNames from 'classnames';
import Search from './Search';
import { useState } from 'react';

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
  const [visible, setVisible] = useState<boolean>(false);

  const onModalChange = () => setVisible(!visible);

  const menuItemStyle = useSpring({
    ref,
    from: { transform: 'translateY(-60px)' },
    to: { transform: 'translateY(0px)' }
  });

  return (
    <nav className={classNames('site-nav', { 'site-nav-on': toggle })} style={{ display: toggle ? 'block' : 'none' }}>
      <ul id="menu" className="menu">
        {items.map(nav => (
          <animated.li key={nav.key} className="menu-item" style={menuItemStyle}>
            {nav.link ? (
              <Link href={nav.link} rel="section">
                <i className={`menu-item-icon fa fa-fw ${nav.icon}`}></i> <br />
                {nav.title}
              </Link>
            ) : (
              <a onClick={() => setVisible(!visible)} className="menu-item-search">
                <i className={`menu-item-icon fa fa-fw ${nav.icon}`}></i> <br />
                {nav.title}
              </a>
            )}
          </animated.li>
        ))}
      </ul>
      <Search visible={visible} onCancel={onModalChange} onOk={onModalChange} />
      {visible && <div className="search-popup-overlay algolia-pop-overlay" onClick={onModalChange} />}
    </nav>
  );
}
