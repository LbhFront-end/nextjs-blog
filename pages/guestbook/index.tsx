import { Comment } from 'components';

export default function GuestBook() {
    return (
        <>
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
