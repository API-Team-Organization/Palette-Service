/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages:['@trpc/server', '@trpc/next', "ws", "@trpc/react-query"]
    },
    reactStrictMode: false,
    images: {
        domains: ['localhost', 'dalleproduse.blob.core.windows.net', 'paletteblob.blob.core.windows.net']
    }
};

export default nextConfig;
