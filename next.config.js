/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'www.xtrader.co.uk',
				port: '',
				pathname: '/catalog/**',
			},
		],
	},
};

module.exports = nextConfig;
