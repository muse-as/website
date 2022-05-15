import { useRouter } from 'next/router'
import Link from 'next/link'
import ErrorPage from 'next/error'
import { open } from '../../lib/logseq'
import Head from 'next/head'
import PostType from '../../types/post'
import { Post, Store } from '../../lib/logseq'
import Page from '../../components/page'

import Layout from '../../components/layout'
import Container from '../../components/container'

type Props = {
  post: PostType
  morePosts: PostType[]
  preview?: boolean
}

const Post = ({ post }: { post: Post }) => {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout preview={false}>
      <Container>
        <div className="text-slate-600 max-w-2xl mx-auto leading-6">
          <Link href={'/'}>
            <a>
              <img src="/assets/logo.png" className="w-48 mt-10 mb-10" />
            </a>
          </Link>
          <Page post={post} />
        </div>
        <pre>{JSON.stringify(post.content, null, '  ')}</pre>
      </Container>
    </Layout>
  )
}

export default Post

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  if (Store.size === 0) {
    const posts = await open('./logseq')
  }
  const key = params.slug
  const item = Store.get(key)
  return {
    props: {
      post: {
        ...item
      }
    }
  }
}

export async function getStaticPaths() {
  const posts = await open('./logseq')
  const paths: any = []
  posts.forEach((post) => {
    paths.push({
      params: { slug: post.slug }
    })
  })
  return {
    paths,
    fallback: false
  }
}
