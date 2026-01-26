import type { NextConfig } from "next";

// 获取 basePath，如果仓库名称不是 username.github.io，需要设置
// 例如：如果仓库名是 website-favicons，则 basePath 为 /website-favicons
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  // 静态导出配置，用于 GitHub Pages
  output: "export",
  // 如果仓库名称不是 username.github.io，取消下面的注释并设置正确的 basePath
  ...(basePath && { basePath }),
  // GitHub Pages 不支持 Next.js 图片优化，如果使用 next/image，需要取消下面的注释
  // images: {
  //   unoptimized: true,
  // },
};

export default nextConfig;
