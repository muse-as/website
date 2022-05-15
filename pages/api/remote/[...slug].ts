import { NextApiRequest, NextApiResponse } from 'next'
import { inspect } from 'util'
import { fromMarkdown } from 'mdast-util-from-markdown'
import fs from 'fs'
import path from 'path'
import * as wikiLink from 'mdast-util-wiki-link'
import { syntax as wikiLinkSyntax } from 'micromark-extension-wiki-link'
import { gfmAutolinkLiteralFromMarkdown } from 'mdast-util-gfm-autolink-literal'
import { gfmAutolinkLiteral } from 'micromark-extension-gfm-autolink-literal'

import { visit } from 'unist-util-visit'

import { parseSlug } from '../../../lib/helper'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //   const content = fs.readFileSync('./_posts/logseq01.md', 'utf8')
  const json = parseSlug(req.query.slug)

  const result = await fetch(json.url)
  const contentType = result.headers.get('content-type')
  if (contentType && contentType.indexOf('text') === -1) {
    res.setHeader('content-type', contentType)
    const blob = await result.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    return res.send(buffer)
  }

  const content = await result.text()
  const output = fromMarkdown(content, {
    extensions: [gfmAutolinkLiteral, wikiLinkSyntax()],
    mdastExtensions: [
      gfmAutolinkLiteralFromMarkdown,
      wikiLink.fromMarkdown({
        // permalinks: ['pages'],
        pageResolver: (name: string) => [name.replace(/\?/g, '_')],
        hrefTemplate: (permalink: string) =>
          `/view/${json.protocol}/${json.hostname}/${json.basePath}/${permalink}.md`
      })
    ]
  })
  visit(output, 'image', (node) => {
    const x = path.resolve('/', json.basePath, node.url)
    node.url = `/api/remote/${json.protocol}/${json.hostname}${x}`
  })
  res.json(output)
}
