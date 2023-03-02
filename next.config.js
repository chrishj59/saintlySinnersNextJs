/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	basePath: process.env.NODE_ENV === 'production' ? '' : '',
	publicRuntimeConfig: {
		contextPath: process.env.NODE_ENV === 'production' ? '' : '',
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 's.gravatar.com',
				port: '',
				pathname: '/avatar/**',
			},
		],
	},
};

module.exports = nextConfig;
