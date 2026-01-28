/**
 * 颜色工具函数
 */

/**
 * 根据背景色获取对比文本颜色（黑色或白色）
 * 
 * @param bgColor - 背景颜色（支持 #RGB、#RRGGBB、#RRGGBBAA 格式）
 * @returns 对比色（#111111 或 #ffffff），如果颜色格式无效则返回 undefined
 */
export function getContrastingTextColor(bgColor: string): string | undefined {
  const raw = bgColor.trim().replace(/^#/, "");
  const hex =
    raw.length === 3
      ? raw
        .split("")
        .map((c) => c + c)
        .join("")
      : raw.length === 6
        ? raw
        : raw.length === 8
          ? raw.slice(0, 6)
          : "";

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return undefined;

  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const rl = toLinear(r);
  const gl = toLinear(g);
  const bl = toLinear(b);
  const luminance = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;

  return luminance > 0.55 ? "#111111" : "#ffffff";
}
