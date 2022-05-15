import Link from 'next/link'
import { parseSlug } from '../../lib/helper'

function ByType({ data, children }: any) {
  const baseColor = 'orange'
  switch (data.type) {
    case 'wikiLink':
      return (
        <Link href={data.data.hProperties.href}>
          <a
            className={`hover:bg-slate-100 text-${baseColor}-600 rounded pb-1 transition-all duration-300`}
          >
            <span className="text-slate-300">[[</span>
            {data.value}
            <span className="text-slate-300">]]</span>
          </a>
        </Link>
      )
    case 'text':
      return data.value
    case 'strong':
      return <span className="font-bold">{children}</span>
    case 'emphasis':
      return <span className="italic">{children}</span>
    case 'image':
      return <img src={data.url} />
    case 'paragraph':
      return <p>{children}</p>
    case 'blockquote':
      return (
        <blockquote
          className={`bg-${baseColor}-50 p-5 border-l-4 border-${baseColor}-100`}
        >
          {children}
        </blockquote>
      )
    case 'inlineCode':
      return (
        <code className="bg-slate-100 text-black rounded p-1">
          {data.value}
        </code>
      )
    case 'link':
      return (
        <Link href={data.url}>
          <a className={`text-${baseColor}-600 underline`}>{children}</a>
        </Link>
      )
    case 'list':
      return <ul className="">{children}</ul>
    case 'listItem':
      return <li className="ml-3 mt-2 pl-2 list-disc">{children}</li>
    case 'root':
      return <div className="root">{children}</div>
    case 'heading':
      switch (data.depth) {
        case 1:
          return (
            <h1 className="text-3xl mt-2 mb-2 border-b-4 border-slate-200">
              {children}
            </h1>
          )
        case 2:
          return (
            <h2 className="text-2xl mt-2 mb-2 border-b-2 border-slate-200">
              {children}
            </h2>
          )
        case 3:
          return <h3 className="text-xl mt-2 mb-2 font-semibold">{children}</h3>
        case 4:
          return <h4>{children}</h4>
        default:
          return <h5>{children}</h5>
      }
    default:
      if (children) {
        return (
          <div>
            *unknown:{data.type}*<div>{children}</div>
          </div>
        )
      }
      return `*unknown:${data.type}*`
  }
}

function Renderer({ data, children }: any) {
  if (data.children && data.children.length > 0) {
    return (
      <ByType data={data}>
        {data.children.map((item: any, key: any) => (
          <Renderer data={item} key={key} />
        ))}
      </ByType>
    )
  }
  if (data.type) {
    return <ByType data={data} />
  }
  return null
}
function Page({ data }: any) {
  const homeUrl =
    '/view/http/raw.githubusercontent.com/logseq/docs/master/pages/contents.md'
  return (
    <div>
      <div className="text-slate-600 max-w-2xl mx-auto leading-6">
        <Link href={homeUrl}>
          <a>
            <img src="/assets/logo.png" className="w-48 mt-10 mb-10" />
          </a>
        </Link>
        <Renderer data={data} />
      </div>
      {/* <pre>{JSON.stringify(data, null, '  ')}</pre> */}
    </div>
  )
}

Page.getInitialProps = async (ctx: any) => {
  const { req, query } = ctx
  const protocol = (req && req.headers['x-forwarded-proto']) || 'http'
  const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
  const json = parseSlug(query.slug)
  const url = `${baseUrl}/api/remote/${json.protocol}/${json.hostname}/${json.fullPath}`
  const res = await fetch(url)
  const jsonx = await res.json()
  return { data: jsonx }
}

export default Page
