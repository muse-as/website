import { open } from '../../lib/logseq'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await open('./logseq')
  //   console.log(result)
  res.json(result)
}
