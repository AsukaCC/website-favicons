/**
 * 剪贴板工具函数
 */

import { modifySvgColor, svgToPngBlob } from "./svg";
import { getAssetPath } from "./path";

/**
 * 复制 SVG 到剪贴板
 * 
 * @param svgPath - SVG 文件路径（相对于 public 目录）
 * @param color - 要应用的颜色（可选）
 * @returns Promise<void>
 */
export async function copySVGToClipboard(
  svgPath: string,
  color?: string
): Promise<void> {
  const fullPath = getAssetPath(svgPath);
  const response = await fetch(fullPath);
  const svgText = await response.text();
  
  // 如果指定了颜色，修改 SVG 颜色
  const finalSvgText = color ? modifySvgColor(svgText, color) : svgText;
  
  await navigator.clipboard.writeText(finalSvgText);
}

/**
 * 复制 PNG 到剪贴板
 * 
 * @param svgPath - SVG 文件路径（相对于 public 目录）
 * @param color - 要应用的颜色（可选）
 * @param size - PNG 尺寸（默认 512）
 * @returns Promise<void>
 */
export async function copyPNGToClipboard(
  svgPath: string,
  color?: string,
  size: number = 512
): Promise<void> {
  const fullPath = getAssetPath(svgPath);
  const response = await fetch(fullPath);
  const svgText = await response.text();
  
  // 如果指定了颜色，修改 SVG 颜色
  const finalSvgText = color ? modifySvgColor(svgText, color) : svgText;
  
  // 将 SVG 转换为 PNG Blob
  const pngBlob = await svgToPngBlob(finalSvgText, size);
  
  // 复制到剪贴板
  await navigator.clipboard.write([
    new ClipboardItem({ "image/png": pngBlob })
  ]);
}
