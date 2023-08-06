import { NextApiRequest, NextApiResponse } from 'next';

const brands = async (req: NextApiRequest, res: NextApiResponse) => {
	let { withImage } = req.query as { withImage: string };
	console.log(`withImage param ${withImage} `);
	return res.json({ withImage });
};

export default brands;
