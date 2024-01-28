import { useState } from "react";
import { useChain, animated, useSpringRef } from "react-spring";
import Header from "next/head";
import Link from "next/link";
import { NextSeo } from 'next-seo';
import Brand from "./brand";
import Nav from "./nav";


type Nav = {
  key: string;
  title: string;
  icon: string;
  link?: string;
  onClick?: any;
};

const CustomHeader = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const brandRef = useSpringRef();
  const navRef = useSpringRef();
  useChain([brandRef, navRef], [0, 0.5]);

  const navs: Nav[] = [
    { key: "home", title: "首页", icon: "fa-home", link: "/" },
    { key: "tags", title: "标签", icon: "fa-tags", link: "/tags" },
    { key: "category", title: "分类", icon: "fa-th", link: "/categories" },
    { key: "archive", title: "归档", icon: "fa-archive", link: "/archives" },
    {
      key: "sitemap",
      title: "站点地图",
      icon: "fa-sitemap",
      link: "/sitemap.xml",
    },
    { key: "comment", title: "留言", icon: "fa-comment", link: "/guestbook" },
    { key: "search", title: "搜索", icon: "fa-search" },
  ];

  return (
    <div>
      <NextSeo
        title="Dashboard | Coindrop"
      />
      <Header>
        <link rel="icon" href="/favicon.ico" />
      </Header>
      <animated.header id="header" className="header">
        <div className="header-inner">
          <Brand springRef={brandRef} setToggle={() => setToggle(!toggle)} />
          <Nav items={navs} springRef={navRef} toggle={toggle} />
        </div>
      </animated.header>
    </div>
  );
};

export default CustomHeader;
