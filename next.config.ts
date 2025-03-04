import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	devIndicators: {
		appIsrStatus: false,
	},
	experimental: {
		ppr: true,
		reactCompiler: true,
		serverActions: {
			bodySizeLimit: '5mb',
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'ijlyviwppydvzsmm.public.blob.vercel-storage.com',
				port: '',
				pathname: '/**',
				search: '',
			},
		],
	},
	async redirects() {
		return [
			{
				source: '/',
				destination: '/welcome',
				permanent: true, // Set to true if this is a permanent redirect
			},
		]
	},
}

export default nextConfig
