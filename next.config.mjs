const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Not a static export: /api/contact and /api/document run Nodemailer on the
  // Node runtime. Every page is still statically prerendered at build time.
  images: {
    // Unsplash URLs are already sized; skipping the optimiser avoids burning
    // image-transformation quota on a site that does not need it.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'prod.spline.design' },
    ],
  },
  // Keep dev and production build output apart, so a production build cannot
  // leave export artifacts where `next dev` expects its own chunks.
  distDir: isDev ? '.next-dev' : '.next',
  transpilePackages: ['three'],
};

export default nextConfig;
