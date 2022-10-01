import Header from 'next/head';
import Brand from './brand';
import Nav from './nav';

interface HeaderProps {
    siteTitle: string;
}

type Nav = {
    key: string;
    title: string;
    icon: string;
    link?: string;
}
const navs: Nav[] = [
    { key: 'home', title: '首页', icon: 'fa-home', link: '/' },
    { key: 'tags', title: '标签', icon: 'fa-tags', link: '/tags' },
    { key: 'category', title: '分类', icon: 'fa-th', link: '/categories' },
    { key: 'archive', title: '归档', icon: 'fa-archive', link: '/archives' },
    { key: 'sitemap', title: '站点地图', icon: 'fa-sitemap', link: '/sitemap.xml' },
    { key: 'comment', title: '留言', icon: 'fa-comment', link: '/guestbook' },
    { key: 'search', title: '搜索', icon: 'fa-search ' },
]
const CustomHeader = ({ siteTitle }: HeaderProps) => {
    return (
        <div>
            <Header>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content='Learn how to build a personal website using Next.js' />
                <meta property='og:image' content={`https://og-image.vercel.app/${encodeURI(
                    siteTitle,
                )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`} />
                <meta name='og:title' content={siteTitle} />
                <meta name="twitter:card" content='summary_large_image' />
            </Header>
            <header id="header" className="header">
                <div className="header-inner">
                    <Brand siteTitle={siteTitle} />
                    <Nav items={navs} />
                </div>
            </header>
        </div>

    )
}

export default CustomHeader;