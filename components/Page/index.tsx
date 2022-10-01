import { useEffect } from "react";
import Prism from "prismjs"
import Link from 'next/link'
import PostHeader from './header';
import { formatHtml } from "utils";
import type { Post } from 'contentlayer/generated'

interface PageProps extends Post {
    page?: boolean;
}


export default function Page(props: PageProps) {
    useEffect(() => {
        Prism.highlightAll()
    }, [])

    const { slug, page, body: { html } } = props;

    return (
        <article className="post post-type-normal">
            <div className="post-block">
                <PostHeader {...props} />
                {
                    !page ? (<div className="post-body">
                        <div className="post-button text-center">
                            <Link href={`/blog/${slug}`}>
                                <a className="btn" rel="contents">
                                    阅读全文 »
                                </a>
                            </Link>
                        </div>
                    </div>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: formatHtml(html) }}></div>
                    )
                }
                <footer className="post-footer">
                    <div className="post-eof" />
                </footer>
            </div>
        </article>
    )
}