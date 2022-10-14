import algoliasearch from "algoliasearch"
import config from 'config'
import type { Post } from "contentlayer/generated"

const { thirdParty: { algolia } } = config;

export const generateIndex = async (posts: Post[]): Promise<void> => {
    const objects = posts.map(post => ({
        objectID: post._id,
        url: `https://laibh.com/${post.slug}`,
        title: post.title,
        tags: post.tags,
        catories: post.categories,
        brief: post.brief,
        slug: post.slug,
        totalWords: post.totalWords,
        readingTime: post.readingTime,
    }))
    const client = algoliasearch(
        algolia.APPLICATION,
        algolia.SEARCH_ONLY_API_KEY
    )
    const index = client.initIndex(algolia.ALGOLIA_INDEX);
    
    if (process.env.NODE_ENV === 'production') {
        await index.saveObjects(objects, { autoGenerateObjectIDIfNotExist: true })
    }
}