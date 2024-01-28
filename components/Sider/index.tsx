import { useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import classNames from 'classnames';
import { allPosts } from 'contentlayer/generated'
import { useSpring, animated } from 'react-spring'
import { handleTOC2Tree, TreeData } from 'utils';
import TOC from './toc';
import config from 'config';


interface SiderProps {
    toggle: boolean;
    siderItems?: TreeData[]
}

const { layout, authorLinks, friendLinks } = config

const tabs = [
    { key: 'toc', title: '文章目录', },
    { key: 'overview', title: '站点概览', style: { marginLeft: 10 } },
]

export default function Sider({ toggle, siderItems = [] }: SiderProps) {
    const [tabKey, setTabKey] = useState<string>(tabs[0].key);
    const sidebarStyle = useSpring({ width: toggle ? layout.siderWidth : 0 })

    const items = [
        { key: 'posts', link: '/archives', count: allPosts.length, name: '日志' },
        { key: 'categories', link: '/categories', count: [...new Set(allPosts.map(item => item.categories).flat(2))].length, name: '分类' },
        { key: 'tags', link: '/tags', count: [...new Set(allPosts.map(post => post.tags))].length, name: '标签' },
    ]
    const OverView = () => (
        <section className="site-overview-wrap sidebar-panel sidebar-panel-active">
            <div className="site-overview">
                <div className="site-author motion-element">
                    <Image className="site-author-image" src="/images/avatar.jpg" width={104} height={104} alt="赖彬鸿" />
                    <p className="site-author-name">赖彬鸿</p>
                    <p className="site-description motion-element" />
                </div>
                <nav className="site-state motion-element">
                    {
                        items.map(item => (
                            <div className={`site-state-item site-state-${item.key}`} key={item.key}>
                                <Link legacyBehavior href={item.link}>
                                    <a>
                                        <span className="site-state-item-count">{item.count}</span>
                                        <span className="site-state-item-name">{item.name}</span>
                                    </a>
                                </Link>
                            </div>
                        ))
                    }
                </nav>
                <div className="links-of-author motion-element">
                    <span className="links-of-author-item">
                        {
                            authorLinks.map(author => (
                                <Link legacyBehavior key={author.title} href={author.link} title={author.title}>
                                    <a target="_blank" title={author.title} rel="noreferrer">
                                        <i className={`fa fa-fw ${author.icon}`}></i>{author.title}</a>
                                </Link>
                            ))
                        }
                    </span>
                </div>
                <div className="fluid-vids">
                    <iframe frameBorder="no" width="100%" height="100" src="//music.163.com/outchain/player?type=0&amp;id=2353471182&amp;auto=0&amp;height=90" />
                </div>
                <div className="links-of-blogroll motion-element links-of-blogroll-inline">
                    <div className="links-of-blogroll-title">
                        <i className="fa  fa-fw fa-link"></i>
                        友情链接
                    </div>
                    <ul className="links-of-blogroll-list">
                        {
                            friendLinks.map(friend => (
                                <li className="links-of-blogroll-item" key={friend.title}>
                                    <Link legacyBehavior href={friend.link}>
                                        <a target="_blank" title={friend.title} rel="noreferrer">{friend.title}</a>
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </section>
    )

    const panes = {
        overview: <OverView />,
        toc: (<TOC items={siderItems} />)

    }

    return (
        <animated.aside id="sidebar" className="sidebar sidebar-active" style={sidebarStyle}>
            <div className="sidebar-inner">
                {
                    siderItems.length > 0 ? (
                        <>
                            <ul className="sidebar-nav motion-element">
                                {
                                    tabs.map(tab => (
                                        <li key={tab.key}
                                            className={classNames("sidebar-nav-toc", { "sidebar-nav-active": tab.key === tabKey })}
                                            style={tab.style}
                                            onClick={() => setTabKey(tab.key)}
                                        >
                                            {tab.title}
                                        </li>
                                    ))
                                }
                            </ul>
                            {panes[tabKey]}
                        </>
                    ) : (<OverView />)
                }
            </div>
        </animated.aside>
    )
}

import { default as SidebarToggle } from './toggle';
export {
    SidebarToggle
}