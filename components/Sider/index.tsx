import Image from 'next/image';
import { useSpring, animated } from 'react-spring'
import { handleTOC2Tree } from 'utils';
import TOC from './toc';
import config from 'config';


interface SiderProps {
    toggle: boolean;
    page?: boolean;
    html?: string;
}

const { layout, authorLinks, friendLinks } = config

const tabs = [
    { key: 'toc', title: '文章目录', },
    { key: 'overview', title: '站点概览', style: { marginLeft: 10 } },
]

export default function Sider({ toggle, page, html }: SiderProps) {
    const [tabKey, setTabKey] = useState<string>(tabs[0].key);
    const sidebarStyle = useSpring({ width: toggle ? layout.siderWidth : 0 })
    const siderItems = handleTOC2Tree(html);

    const OverView = () => (
        <section className="site-overview-wrap sidebar-panel sidebar-panel-active">
            <div className="site-overview">
                <div className="site-author motion-element">
                    <Image className="site-author-image" src="/images/avatar.jpg" width={104} height={104} alt="赖彬鸿" />
                    <p className="site-author-name">赖彬鸿</p>
                    <p className="site-description motion-element" />
                </div>
                <nav className="site-state motion-element">
                    <div className="site-state-item site-state-posts">
                        <a href="/archives/">
                            <span className="site-state-item-count">135</span>
                            <span className="site-state-item-name">日志</span>
                        </a>
                    </div>
                    <div className="site-state-item site-state-categories">
                        <a href="/categories/index.html">
                            <span className="site-state-item-count">32</span>
                            <span className="site-state-item-name">分类</span>
                        </a>
                    </div>
                    <div className="site-state-item site-state-tags">
                        <a href="/tags/index.html">
                            <span className="site-state-item-count">40</span>
                            <span className="site-state-item-name">标签</span>
                        </a>
                    </div>
                </nav>
                <div className="feed-link motion-element">
                    <a href="/atom.xml" rel="alternate">
                        <i className="fa fa-rss"></i>
                        RSS
                    </a>
                </div>
                <div className="links-of-author motion-element">
                    <span className="links-of-author-item">
                        {
                            authorLinks.map(author => (
                                <Link key={author.title} href={author.link} title={author.title}>
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
                                    <Link href={friend.link}>
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
                    page ? (
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
import Link from 'next/link';
import classNames from 'classnames';
import { useState } from 'react';
export {
    SidebarToggle
}