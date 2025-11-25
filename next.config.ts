/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true, // enables Next 16 caching system
  experimental: {
    useCache: true,      // required for "use cache" directive
    serverActions: true, // server actions
  },
  images: {
    // Allow images from your Supabase public bucket
    domains: ['avbnbcnzyjbaugbbbjcc.supabase.co'],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
