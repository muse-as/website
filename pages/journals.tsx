import Container from '../components/container'
import Layout from '../components/layout'
import Header from '../components/header'
import Head from 'next/head'
import Page from '../components/page'
import { Store, Journals, Post, open } from '../lib/logseq'

type Props = {
  posts: Post[]
}

const Index = ({ posts }: Props) => {
  return (
    <>
      <Layout>
        <Head>
          <title>muse foundation</title>
        </Head>
        <Container>
          <Header></Header>
          <div className="text-slate-600 max-w-2xl mx-auto leading-6">
            {posts.map((post) => (
              <Page post={post} />
            ))}
          </div>
        </Container>
      </Layout>
    </>
  )
}

export default Index

export async function getStaticProps() {
  const posts: Post[] = []
  if (Store.size === 0) {
    await open('./logseq')
  }
  for (const date of Journals) {
    const post = Store.get(date)
    if (post) {
      posts.push(post)
    }
    posts.sort().reverse()
  }
  return { props: { posts } }
}
