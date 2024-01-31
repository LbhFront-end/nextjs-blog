import Link from 'next/link';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import { NextSeo } from 'next-seo';
import { tagcloud } from 'utils';
import config from 'config';
import type { Post } from 'contentlayer/generated';
import type { GetStaticProps } from 'next';

const { site } = config;

export default function Tags({ tags = [] }) {
  return (
    <div id="posts" className="posts-expand">
      <NextSeo
        title="标签,tags"
        description="博客标签,blog-tags"
        openGraph={{
          title: `标签-${String(tags)}`,
          description: `博客标签,blog-tags-${String(tags)}`,
          url: `${site.url}/tags`
        }}
      />
      <div className="post-block page">
        <header className="post-header">
          <h2 className="post-title" style={{ textAlign: 'center' }}>
            tags
          </h2>
        </header>
        <div className="post-body">
          <div className="tag-cloud">
            <div className="tag-cloud-title">目前共计 {tags.length} 个标签</div>
            <div className="tag-cloud-tags">
              {tags.map(tag => (
                <Link
                  style={tagcloud({ min: 12, max: 30, startColor: '#ccc', endColor: '#111' })}
                  href={`/tags/${tag}`}
                  key={tag}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export const getStaticProps: GetStaticProps = async () => {
  const posts: Post[] = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
  const tags = posts.map(post => post.tags);

  return {
    props: {
      tags: [...new Set(tags)]
    }
  };
};
