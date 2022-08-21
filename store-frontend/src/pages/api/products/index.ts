import type { NextApiRequest, NextApiResponse } from 'next'
import { Product } from '../../../model/product'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[]>
) {
  res.status(200).json([])
}
