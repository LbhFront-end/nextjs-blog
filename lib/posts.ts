import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { stripHTML } from 'utils';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

const counter = content => {
  content = stripHTML(content);
  const cn = (content.match(/[\u4E00-\u9FA5]/g) || []).length;
  const en = (
    content
      .replace(/[\u4E00-\u9FA5]/g, '')
      .match(
        /[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g
      ) || []
  ).length;
  return cn + en;
};

const postsDirectory = path.join(process.cwd(), 'posts');

type Data = {
  title: string;
  date: string;
  tags?: string;
  categories?: string[];
};

interface MatterResult {
  data: Data;
  content: string;
  [key: string]: unknown;
}

export const getSortedPostsData = () => allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map(fileName => ({
    params: {
      id: fileName.replace(/\.md$/, '')
    }
  }));
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();
  const totalWords = counter(contentHtml);
  return {
    id,
    contentHtml,
    totalWords,
    ...(matterResult.data as MatterResult['data'])
  };
}
