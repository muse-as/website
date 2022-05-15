import Container from '../components/container'
import Layout from '../components/layout'
import Head from 'next/head'
import Post from '../types/post'
import Page from '../components/page'
import { Store, open } from '../lib/logseq'

type Props = {
  post: Post
}

const Index = ({ post }: Props) => {
  return (
    <>
      <Layout>
        <Head>
          <title>muse foundation</title>
        </Head>
        <Container>
          <Page post={post} />
        </Container>
      </Layout>
    </>
  )
}

export default Index

export async function getStaticProps() {
  if (Store.size === 0) {
    const posts = await open('./logseq')
  }
  const post = Store.get('contents')
  return { props: { post } }
}
