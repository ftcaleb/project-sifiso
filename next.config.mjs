const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export: every page is prerendered to HTML and served from Cloudflare's
  // CDN. The enquiry form is handled by a Cloudflare Pages Function in /functions.
  output: 'export',
  // Keep dev and production build output apart. `next build` writes export
  // artifacts into its dist folder; if `next dev` shared that folder it would
  // serve them and 404 on its own chunks (layout.css, main-app.js).
  distDir: isDev ? '.next-dev' : '.next',
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
