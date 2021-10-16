import Head from 'next/head'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout'
import Date from '../components/date'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/airtable'

// STATIC PAGE RENDERING - Adds in data (as static props) during build
export async function getStaticProps() {
  const allPostsData = await getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p style={{textAlign:'center'}}>
            Some Google Keep entries with no context.<br />
            Connected with Airtable!
        </p>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding4vh}`}>

        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title, plainTextContent }) => (
            <Link href={`/posts/${id}`}>
              <li className={utilStyles.listItem} key={id}>
                  <a className={utilStyles.listItemTitle}>{title}</a>
                <br />
                <small className={utilStyles.lightText}>
                  <Date dateString={date} />
                </small>
                <p className={utilStyles.previewText}>
                  {plainTextContent}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      </section>

    </Layout>
  )
}





// SERVER SIDE RENDERING
// export async function getServerSideProps(context) {
//   return {
//     props: {
//       // props for your component
//     }
//   }
// }

// CLIENT SIDE RENDERING
// import useSWR from 'swr'

// function Profile() {
//   const { data, error } = useSWR('/api/user', fetch)

//   if (error) return <div>failed to load</div>
//   if (!data) return <div>loading...</div>
//   return <div>hello {data.name}!</div>
// }
