export function parseSlug(slugs: string | string[]) {
  const slug = typeof slugs === 'string' ? slugs.split('/') : slugs
  const slugPaths = [...slug]
  const protocol = slugPaths.shift()
  if (protocol && !['http', 'https'].includes(protocol)) {
    throw new Error(`unknow protocol: ${protocol}`)
  }
  const hostname = slugPaths.shift()
  const fullPath = slugPaths.join('/')
  const url = `${protocol}://${hostname}/${fullPath}`
  const basePath = slugPaths.slice(0, -1).join('/')
  return {
    hostname,
    fullPath,
    protocol,
    slug,
    slugPaths,
    url,
    basePath
  }
}
