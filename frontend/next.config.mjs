/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Explicitly expose the environment variable
      }, 
};

export default nextConfig;
