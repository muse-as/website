import Container from '../components/container'
import Layout from '../components/layout'
import Link from 'next/link'
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
          <div className="text-slate-600 max-w-2xl mx-auto leading-6">
            <Link href={'/'}>
              <a>
                <img src="/assets/logo.png" className="w-48 mt-10 mb-10" />
              </a>
            </Link>
            <Page post={post} />
          </div>
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
