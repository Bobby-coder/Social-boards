/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
          "social-boards-uploads.s3.amazonaws.com",
          "lh3.googleusercontent.com",
        ],
      },
}

module.exports = nextConfig
