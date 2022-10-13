import Link from "next/link";
import Date from "../Date";
import type { Post } from "contentlayer/generated";

export default function PostHeader({
  date,
  title,
  slug,
  readingTime: { text, words },
  categories,
}: Post) {
  return (
    <header className="post-header">
      <h2 className="post-title">
        <Link href={`/blog/${slug}`}>
          <a className="post-title-link">{title}</a>
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
              <a>
                <span>{categories[0]}</span>
              </a>
            </Link>
          </span>
        </span>
        <span className="leancloud_visitors" data-flag-title={title}>
          <span className="post-meta-divider">|</span>
          <span className="post-meta-item-icon">
            <i className="fa fa-eye"></i>
          </span>
          <span className="post-meta-item-text">阅读次数: </span>
          <span id="busuanzi_value_page_pv" />
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
          <span title="阅读时间">{text.split(" read")[0]}</span>
        </div>
      </div>
    </header>
  );
}
