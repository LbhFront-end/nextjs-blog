import Head from 'next/head';
import Date from '../../components/date';
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import utilStyles from '../../styles/utils.module.css';
import type { GetStaticProps, GetStaticPaths } from 'next'

type PostData = {
    title: string;
    date: string;
    contentHtml: string;
}

interface PostProps {
    postData: PostData;
}

export default function Post({ postData }: PostProps) {
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headdingXl}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }}></div>
            </article>
        </Layout>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostIds()
    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postData = await getPostData(params.id as string)
    return {
        props: {
            postData
        }
    }
}