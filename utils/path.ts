/**
 * 路径工具函数
 * 用于处理 GitHub Pages 的 basePath
 */

/**
 * 获取 basePath
 * 在客户端，从 window.__NEXT_DATA__ 或 window.location.pathname 推断
 * 在服务端/构建时，从环境变量获取
 */
function getBasePath(): string {
  if (typeof window !== 'undefined') {
    // 客户端：优先从 Next.js 的全局数据获取
    const nextData = (window as any).__NEXT_DATA__;
    if (nextData?.basePath) {
      return nextData.basePath;
    }
    
    // 如果 Next.js 数据中没有，尝试从环境变量获取（在构建时注入）
    if ((window as any).__NEXT_PUBLIC_BASE_PATH) {
      return (window as any).__NEXT_PUBLIC_BASE_PATH;
    }
  }
  
  // 服务端/构建时：从环境变量获取
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

/**
 * 获取带有 basePath 的资源路径
 * @param path - 原始路径（例如：/icons/aliyun.svg）
 * @returns 带有 basePath 的完整路径
 */
export function getAssetPath(path: string): string {
  // 如果路径已经是完整 URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const basePath = getBasePath();

  // 如果 basePath 为空，直接返回原路径
  if (!basePath) {
    return path;
  }

  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // 组合 basePath 和路径
  return `${basePath}${normalizedPath}`;
}
