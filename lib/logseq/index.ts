import fs from 'fs'
import fg from 'fast-glob'
import { fromMarkdown } from 'mdast-util-from-markdown'
import * as wikiLink from 'mdast-util-wiki-link'
import mdastMetadata from 'mdast-add-list-metadata'
import { syntax as wikiLinkSyntax } from 'micromark-extension-wiki-link'
import { gfmAutolinkLiteralFromMarkdown } from 'mdast-util-gfm-autolink-literal'
import { gfmAutolinkLiteral } from 'micromark-extension-gfm-autolink-literal'

import { remove } from 'unist-util-remove'
import { visit } from 'unist-util-visit'

export interface Post {
  slug: string
  filename: string
  filepath: string
  title: string
  content?: any
}

export const Store: Map<string, Post> = new Map()

export async function open(path: string) {
  const _files = await fg(['**/*.md', '!**/logseq/bak'], { cwd: path })
  const files: Post[] = []
  for (const file of _files) {
    const filepath = `${path}/${file}`
    const content = await fs.promises.readFile(`${path}/${file}`, 'utf8')
    const name = file.split('/').pop()
    let title = name ? decodeURIComponent(name.replace(/\.md$/, '')) : ''
    const mdast = parseMarkdown(content)
    visit(
      mdast,
      (node: any) => node.type === 'metadata' && node.key === 'title',
      (node) => {
        title = node.value
      }
    )
    const slug = toSlug(title)
    Store.set(slug, {
      slug,
      title,
      filepath,
      filename: file,
      content: mdast
    })
  }
  return Store
}

export function toSlug(name: string) {
  return name
    .replace(/[ :-\?,]/g, '-')
    .replace(/-{1,}/g, '-')
    .replace(/\.md$/i, '')
    .toLowerCase()
}

export function slugToString(name: string) {}

export function parseMarkdown(content: string) {
  const output = fromMarkdown(content, {
    extensions: [gfmAutolinkLiteral, wikiLinkSyntax({ aliasDivider: '||' })],
    mdastExtensions: [
      gfmAutolinkLiteralFromMarkdown,
      wikiLink.fromMarkdown({
        // permalinks: ['pages'],
        pageResolver: (name: string) => [toSlug(name)],
        hrefTemplate: (permalink: string) => `/pages/${permalink}`
        //   `/view/${json.protocol}/${json.hostname}/${json.basePath}/${permalink}.md`
      })
    ]
  })
  //   visit(output, 'image', (node) => {
  //     const x = path.resolve('/', json.basePath, node.url)
  //     node.url = `/api/remote/${json.protocol}/${json.hostname}${x}`
  //   })
  visit(output, 'text', (node, index, parent: any) => {
    const reg = node.value.matchAll(/([a-z-_]*):: (.*)/gim)
    for (let _item of Array.from(reg)) {
      const item: any = _item
      node.value = node.value.replace(item[0], '')
      if (parent) {
        parent.children.unshift({
          type: 'metadata',
          key: item[1],
          value: item[2]
        })
      }
    }
  })

  // remove blank text node
  remove(output, (node: any) => {
    if (node.type === 'text' && node.value === '') return true
  })
  // console.log()
  return mdastMetadata()(output)
}
