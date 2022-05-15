import Link from 'next/link'

function ByType({ data, children }: any) {
  switch (data.type) {
    case 'wikiLink':
      return (
        <Link href={data.data.hProperties.href}>
          <a
            className={`hover:bg-slate-100 rounded pb-1 transition-all duration-300 text-orange-600`}
          >
            <span className="text-slate-300">[[</span>
            {data.value}
            <span className="text-slate-300">]]</span>
          </a>
        </Link>
      )
    case 'metadata':
      return null
      if (data.key === 'title') return null
      return (
        <>
          <span className="font-bold">{data.key}:</span> {data.value}
          <br />
        </>
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
        <blockquote className={`bg-orange-50 p-5 border-l-4 border-orange-100`}>
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
          <a className={`text-orange-600 underline`}>{children}</a>
        </Link>
      )
    case 'list':
      const className = data.depth > 0 ? 'list-disc pl-4' : ''
      return <ul className={className}>{children}</ul>
    case 'listItem':
      return (
        <li className={`my-3 pl-1 ${data.depth > 0 ? 'ml-4' : ''}`}>
          {children}
        </li>
      )
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
          return <h3 className="text-xl mt-8 mb-2 font-semibold">{children}</h3>
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

export default function Page({ post }: any) {
  return (
    <div className="text-slate-600 max-w-2xl mx-auto leading-6">
      <Link href={'/'}>
        <a>
          <img src="/assets/logo.png" className="w-48 mt-10 mb-10" />
        </a>
      </Link>
      <h1 className="text-3xl mb-5">{post.title}</h1>
      <Renderer data={post.content} />
    </div>
  )
}
