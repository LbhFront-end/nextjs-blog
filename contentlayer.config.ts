import readingTime from 'reading-time';
import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrism from 'rehype-prism-plus';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';

let totalWords = 0;

const handleTotalWordsCount = (count: number) => {
  let result = String(count);
  if (count > 9999) {
    result = Math.round(count / 1000) + 'k'; // > 9999 => 11k
  } else if (count > 999) {
    result = Math.round(count / 100) / 10 + 'k'; // > 999 => 1.1k
  } // < 999 => 111
  return result;
};

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.md`,
  fields: {
    title: {
      type: 'string',
      description: '标题',
      required: true
    },
    slug: {
      type: 'string'
    },
    date: {
      type: 'date',
      description: '创建日期',
      required: true
    },
    tags: {
      type: 'string',
      description: '标签',
      required: true
    },
    categories: {
      type: 'list',
      of: { type: 'string' },
      description: '标签',
      required: true
    }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: doc => doc._raw.sourceFileName.replace(/\.md/, '')
    },
    readingTime: {
      type: 'json',
      resolve: doc => readingTime(doc.body.raw)
    },
    brief: {
      type: 'string',
      resolve: doc => `${doc.body.html.replace(/<[^>]+>/g, '').substring(0, 150)}...`
    },
    totalWords: {
      type: 'string',
      resolve: doc => {
        const { words } = readingTime(doc.body.raw);
        totalWords += words;
        return handleTotalWordsCount(totalWords);
      }
    }
  }
}));

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm, remarkToc],
    rehypePlugins: [rehypeSlug, rehypeCodeTitles, rehypePrism, rehypeAutolinkHeadings, rehypeAccessibleEmojis]
  }
});
