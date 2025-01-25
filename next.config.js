/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cdn-icons-png.flaticon.com",
      "img.lovepik.com",
      "www.ringtina.com.ar",
      "i.postimg.cc",
    ],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

module.exports = nextConfig;
