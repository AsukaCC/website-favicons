/**
 * SVG 工具函数
 */

/**
 * 修改 SVG 字符串的颜色
 * 
 * @param svgText - SVG 文本内容
 * @param color - 要设置的颜色
 * @returns 修改后的 SVG 文本
 */
export function modifySvgColor(svgText: string, color: string): string {
  // SSR / 非浏览器环境下没有 DOMParser，直接降级返回原始 SVG
  if (typeof DOMParser === "undefined" || typeof XMLSerializer === "undefined") {
    return svgText;
  }

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
  const svgElement = svgDoc.documentElement;
  
  // 如果 SVG 有 fill 属性，修改为当前颜色
  if (svgElement.hasAttribute("fill")) {
    svgElement.setAttribute("fill", color);
  } else {
    // 如果没有 fill，添加一个
    svgElement.setAttribute("fill", color);
  }
  
  // 序列化修改后的 SVG
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgElement);
}

/**
 * 将 SVG 转换为 PNG Blob
 * 
 * @param svgText - SVG 文本内容
 * @param size - PNG 尺寸（默认 512）
 * @returns Promise<Blob> PNG 图片的 Blob 对象
 */
export function svgToPngBlob(svgText: string, size: number = 512): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      reject(new Error("Failed to get canvas context"));
      return;
    }
    
    const img = new Image();
    const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, size, size);
      
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(svgUrl);
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert canvas to blob"));
        }
      }, "image/png");
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      reject(new Error("Failed to load SVG image"));
    };
    
    img.src = svgUrl;
  });
}
