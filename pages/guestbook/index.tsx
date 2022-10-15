import { NextSeo } from 'next-seo';
import { Comment } from 'components';
import config from 'config';

const { site } = config;

export default function GuestBook() {
    return (
        <>
            <NextSeo
                title='留言板,GuestBook'
                description='留言板,GuestBook'
                openGraph={{
                    title: '留言板,GuestBook',
                    description: '留言板,GuestBook',
                    url: `${site.url}/guestbook`
                }}
            />
            <div id="posts" className="posts-expand">
                <div className="post-block page" >
                    <header className="post-header" >
                        <h2 className="post-title">留言板</h2>
                    </header>
                    <div className="post-body" >
                        <p>来都来了，说点什么吧(￣▽￣)~*<br />欢迎留下链接，互加友链</p>
                    </div>
                </div>
            </div>
            <Comment />
        </>
    )
}
