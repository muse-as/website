function ByType({ data, children }) {
  switch (data.type) {
    case 'wikiLink':
      return (
        <a
          className="hover:bg-slate-100 text-black rounded pb-1 transition-all duration-300"
          href={data.data.hProperties.href}
        >
          <span className="text-slate-300">[[</span>
          {data.value}
          <span className="text-slate-300">]]</span>
        </a>
      )
    case 'text':
      return data.value
    case 'paragraph':
      return <p>{children}</p>
    case 'inlineCode':
      return (
        <code className="bg-slate-100 text-black rounded p-1">
          {data.value}
        </code>
      )
    case 'list':
      return <ul className="list-disc">{children}</ul>
    case 'listItem':
      return <li className="ml-7 pl-1">{children}</li>
    case 'root':
      return <div className="root">{children}</div>
    case 'heading':
      switch (data.depth) {
        case 1:
          return (
            <h1 className="text-3xl bt-2 mb-2 border-b-4 border-slate-200">
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
          return <h3 className="text-xl">{children}</h3>
        case 4:
          return <h4 className="text-log">{children}</h4>
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

function Renderer({ data, children }) {
  if (data.children && data.children.length > 0) {
    return (
      <ByType data={data}>
        {data.children.map((item) => (
          <Renderer data={item} />
        ))}
      </ByType>
    )
  }
  if (data.type) {
    return <ByType data={data} />
  }
  return null
}
function Page({ data }) {
  return (
    <div>
      <div className="text-slate-600 max-w-2xl mx-auto leading-6">
        <img src="/assets/logo.png" className="w-48 mt-10 mb-10" />
        <Renderer data={data} />
      </div>
      <pre>{JSON.stringify(data, null, '  ')}</pre>
    </div>
  )
}

Page.getInitialProps = async ({ req }) => {
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
  const res = await fetch(`${baseUrl}/api/remark`)
  const json = await res.json()
  return { data: json }
}

export default Page
