import { withContentlayer } from 'next-contentlayer';
import NextPwa from 'next-pwa';
import NextBundleAnalyzer from '@next/bundle-analyzer';


const withBundleAnalyzer = NextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});


const withPwa = NextPwa({
    dest: 'public',
    disable: false,
    swSrc: 'service-worker.js',
});

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:true,
    swcMinify:true,
};

export default withContentlayer(withBundleAnalyzer(withPwa(nextConfig)))