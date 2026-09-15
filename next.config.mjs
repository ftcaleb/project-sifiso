/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export: every page is prerendered to HTML and served from Cloudflare's
  // CDN. The enquiry form is handled by a Cloudflare Pages Function in /functions.
  output: 'export',
  images: {
    // No Next image optimiser on a static host; Unsplash URLs are already sized.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'prod.spline.design' },
    ],
  },
  transpilePackages: ['three'],
};

export default nextConfig;
