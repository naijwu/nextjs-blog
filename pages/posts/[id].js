import Head from 'next/head'
import Layout from '../../components/layout'
import Date from '../../components/date'
// import { getAllPostIds, getPostData } from '../../lib/posts'
import { getAllPostIds, getPostData } from '../../lib/airtable'
import utilStyles from '../../styles/utils.module.css'

export async function getStaticPaths() {
    const paths = await getAllPostIds()
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id)
    return {
        props: {
            postData
        }
    }
}

export default function Post({ params, postData }) {
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingX1}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }}></div>
            </article>
        </Layout>
    )
}
