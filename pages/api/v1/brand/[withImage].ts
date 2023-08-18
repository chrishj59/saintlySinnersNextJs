import { NextApiRequest, NextApiResponse } from 'next';

const brands = async (req: NextApiRequest, res: NextApiResponse) => {
	let { withImage } = req.query as { withImage: string };
	return res.json({ withImage });
};

export default brands;
