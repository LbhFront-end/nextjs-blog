import { withContentlayer } from 'next-contentlayer';
import withPWA from 'next-pwa';
import withBundleAnalyzer from '@next/bundle-analyzer';

const contentlayerConfig = withContentlayer({})
const pwaConfig = withPWA({
    dest:'public',
    swSrc:'service-worker.js'
})
const nextConfig = {
    ...contentlayerConfig,
    ...pwaConfig,
}

export default nextConfig;
