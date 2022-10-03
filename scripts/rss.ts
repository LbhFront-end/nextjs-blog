import { writeFileSync } from 'fs';
import RSS from 'rss';
import { allPosts } from 'contentlayer/generated';

const Url = 'localhost:3000'

const feed = new RSS({
    title: "My Posts",
    feed_url: `${Url}/rss.xml`,
    site_url: Url,
})

allPosts.map(({ title, tags, slug, date }) => ({
    title,
    tags,
    url: `${Url}/blog/${slug}`,
    date,
})).forEach((item) => {
    feed.item(item)
})

writeFileSync('./public/rss.xml', feed.xml({ indent: true }))