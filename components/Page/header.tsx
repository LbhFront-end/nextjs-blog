import { useEffect } from 'react';
import useSWR from 'swr';
import fetcher from 'lib/fetcher';
import Link from 'next/link';
import Date from '../Date';

interface Views {
  count: number;
}

export default function PostHeader({
  date,
  title,
  slug,
  readingTime: { text, words },
  categories,
  shouldRegisterView = false
}) {
  const { data } = useSWR<Views>(`/api/views/${slug}`, fetcher);
  useEffect(() => {
    if (!shouldRegisterView) {
      return;
    }

    const registerView = () =>
      fetch(`/api/views/${slug}`, {
        method: 'POST'
      });

    registerView();
  }, [slug, shouldRegisterView]);

  return (
    <header className="post-header">
      <h2 className="post-title">
        <Link className="post-title-link" href={`/blog/${slug}`}>
          {title}
        </Link>
      </h2>
      <div className="post-meta">
        <span className="post-time">
          <span className="post-meta-item-icon">
            <i className="fa fa-calendar-o"></i>
          </span>
          <span className="post-meta-item-text">发表于 </span>
          <Date title="发表于" dateString={date} />
        </span>
        <span className="post-category">
          <span className="post-meta-divider">|</span>
          <span className="post-meta-item-icon">
            <i className="fa fa-folder-o"></i>
          </span>
          <span className="post-meta-item-text">分类于 </span>
          <span>
            <Link href={`/categories/${categories[0]}/`}>
              <span>{categories[0]}</span>
            </Link>
          </span>
        </span>
        <span className="leancloud_visitors" data-flag-title={title}>
          <span className="post-meta-divider">|</span>
          <span className="post-meta-item-icon">
            <i className="fa fa-eye"></i>
          </span>
          <span className="post-meta-item-text">阅读次数: </span>
          <span>{(data?.count ?? 0) > 0 ? data.count.toLocaleString() : '–'}</span>
        </span>
        <div className="post-wordcount">
          <span className="post-meta-item-icon">
            <i className="fa fa-file-word-o"></i>
          </span>
          <span className="post-meta-item-text">字数统计: </span>
          <span title="字数统计">{words}</span>
          <span className="post-meta-divider">|</span>
          <span className="post-meta-item-icon">
            <i className="fa fa-clock-o"></i>
          </span>
          <span className="post-meta-item-text">阅读时间: </span>
          <span title="阅读时间">{text.split(' read')[0]}</span>
        </div>
      </div>
    </header>
  );
}
