/**
 * 首页组件 - 网站图标展示页面
 *
 * 主要功能：
 * - 展示网站图标库，支持搜索和筛选
 * - 支持主题切换（亮色/暗色/自动）
 * - 支持下载格式选择（SVG/PNG）
 * - 支持布局切换（网格/紧凑）
 * - 支持多语言（中文/英文）
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import Head from "next/head";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import IconCard from "@/components/IconCard";
import { useLanguage } from "@/components/LanguageContext";
import { useTheme } from "@/components/ThemeContext";
import { getTranslation } from "@/locales";
import iconsData from "@/data/icons.json";
import type { Icon } from "@/types/icon";
import { getAssetPath } from "@/utils/path";
import styles from "@/styles/pages/Home.module.css";
import iconCardStyles from "@/styles/components/IconCard.module.css";


// 下载格式类型
type DownloadFormat = "SVG" | "PNG";
// 布局类型
type Layout = "grid" | "compact";

// 原始图标数据（用于重置）
const originalIcons: Icon[] = iconsData as Icon[];

/**
 * 首页主组件
 *
 * 主要状态：
 * - searchQuery: 搜索关键词
 * - downloadFormat: 下载格式（SVG/PNG）
 * - layout: 布局模式（网格/紧凑）
 */
export default function Home() {
  // 获取当前语言设置
  const { language } = useLanguage();
  // 获取主题设置和切换函数
  const { theme, setTheme } = useTheme();
  // 搜索关键词状态
  const [searchQuery, setSearchQuery] = useState("");
  // 下载格式状态
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>("SVG");
  // 布局模式状态
  const [layout, setLayout] = useState<Layout>("grid");
  // 图标数据状态（可修改）
  const [icons, setIcons] = useState<Icon[]>(() => {
    // 深拷贝原始数据，避免直接修改原始数据
    return JSON.parse(JSON.stringify(originalIcons));
  });
  // 当前正在编辑颜色的图标 URL
  const [editingColorIconUrl, setEditingColorIconUrl] = useState<string | null>(null);

  // 获取翻译文本
  const t = getTranslation(language).home;
  const tCommon = getTranslation(language).common;

  // 点击外部关闭颜色选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingColorIconUrl) {
        const target = event.target as HTMLElement;
        // 如果点击的不是颜色选择器相关的元素，则关闭
        const pickerContainer = document.querySelector(`.${iconCardStyles.colorPickerContainer}`);
        if (!pickerContainer || !pickerContainer.contains(target)) {
          setEditingColorIconUrl(null);
        }
      }
    };

    if (editingColorIconUrl) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [editingColorIconUrl]);

  /**
   * 根据搜索关键词过滤图标
   * 使用 useMemo 优化性能，只在 searchQuery 或 icons 改变时重新计算
   */
  const filteredIcons = useMemo(() => {
    return icons.filter((icon) =>
      icon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, icons]);

  /**
   * 从 URL 生成文件名
   * @param url - 图标 URL（例如：baidu.com 或 https://baidu.com）
   * @returns 文件名（例如：baidu.com）
   */
  const getFileNameFromUrl = (url: string): string => {
    // 移除协议前缀（http:// 或 https://）
    let cleanUrl = url.replace(/^https?:\/\//, "");
    // 移除末尾的斜杠
    cleanUrl = cleanUrl.replace(/\/$/, "");
    // 替换特殊字符为下划线（用于文件名）
    cleanUrl = cleanUrl.replace(/[<>:"/\\|?*]/g, "_");
    return cleanUrl;
  };

  /**
   * 处理图标下载
   * @param icon - 要下载的图标对象
   */
  const handleDownload = async (icon: Icon) => {
    if (!icon.path) {
      console.error("Icon path is missing");
      return;
    }

    const iconColor = getIconColor(icon);
    const svgPath = getAssetPath(icon.path);
    const fileName = getFileNameFromUrl(icon.url);

    try {
      // 获取 SVG 文件内容
      const response = await fetch(svgPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG: ${response.statusText}`);
      }
      let svgContent = await response.text();

      // 修改 SVG 中的颜色
      // 使用 DOM 解析器来修改 SVG
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
      const svgElement = svgDoc.documentElement;

      // 检查是否有解析错误
      const parserError = svgDoc.querySelector("parsererror");
      if (parserError) {
        throw new Error("Invalid SVG format");
      }

      // 递归设置所有元素的 fill 和 stroke 属性
      const setColorRecursive = (element: Element) => {
        // 跳过 defs、style、script 等特殊元素
        const tagName = element.tagName.toLowerCase();
        if (tagName === "defs" || tagName === "style" || tagName === "script") {
          return;
        }

        // 设置 fill 属性（跳过明确设置为 "none" 的元素）
        const currentFill = element.getAttribute("fill");
        if (currentFill !== "none") {
          element.setAttribute("fill", iconColor);
        }

        // 设置 stroke 属性（如果元素有 stroke 且不是 "none"）
        const currentStroke = element.getAttribute("stroke");
        if (currentStroke && currentStroke !== "none") {
          element.setAttribute("stroke", iconColor);
        }

        // 递归处理子元素
        Array.from(element.children).forEach(setColorRecursive);
      };

      setColorRecursive(svgElement);

      // 将修改后的 SVG 转换回字符串
      svgContent = new XMLSerializer().serializeToString(svgElement);

      if (downloadFormat === "SVG") {
        // 下载 SVG
        const blob = new Blob([svgContent], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (downloadFormat === "PNG") {
        // 下载 PNG：将 SVG 转换为 Canvas，然后导出为 PNG
        const canvas = document.createElement("canvas");
        const size = 512; // PNG 导出尺寸
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Failed to get canvas context");
        }

        // 创建图片对象
        const img = new Image();
        const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
        const svgUrl = URL.createObjectURL(svgBlob);

        img.onload = () => {
          // 清空画布（透明背景）
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // 绘制 SVG 图片
          ctx.drawImage(img, 0, 0, size, size);
          
          // 转换为 PNG Blob 并下载
          canvas.toBlob((blob) => {
            if (blob) {
              const downloadUrl = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = downloadUrl;
              a.download = `${fileName}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(downloadUrl);
            }
            URL.revokeObjectURL(svgUrl);
          }, "image/png");
        };

        img.onerror = () => {
          URL.revokeObjectURL(svgUrl);
          throw new Error("Failed to load SVG image");
        };

        img.src = svgUrl;
      }
    } catch (error) {
      console.error("Download error:", error);
      alert(`下载失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  };

  /**
   * 处理图标查看
   * 在新标签页中打开图标的官方网站
   * @param icon - 要查看的图标对象
   */
  const handleView = (icon: Icon) => {
    if (icon.url) {
      const fullUrl = icon.url.startsWith("http") ? icon.url : `https://${icon.url}`;
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    }
  };

  /**
   * 获取图标的当前颜色
   * @param icon - 图标对象
   * @returns 颜色值
   */
  const getIconColor = (icon: Icon): string => {
    return icon.color;
  };

  /**
   * 处理颜色变更
   * @param iconUrl - 图标 URL
   * @param newColor - 新颜色值
   */
  const handleColorChange = useCallback((iconUrl: string, newColor: string) => {
    setIcons((prevIcons) => {
      return prevIcons.map((icon) => {
        if (icon.url === iconUrl) {
          // 如果颜色没有改变，不更新
          if (icon.color === newColor) {
            return icon;
          }
          return { ...icon, color: newColor };
        }
        return icon;
      });
    });
  }, []);

  /**
   * 处理颜色点击，显示/隐藏颜色选择器
   * @param iconUrl - 图标 URL
   * @param event - 点击事件
   */
  const handleColorClick = (iconUrl: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // 切换颜色选择器的显示状态
    setEditingColorIconUrl(editingColorIconUrl === iconUrl ? null : iconUrl);
  };

  /**
   * 重置图标颜色为原始颜色
   * @param iconUrl - 图标 URL
   */
  const handleResetColor = (iconUrl: string) => {
    const originalIcon = originalIcons.find((icon) => icon.url === iconUrl);
    if (originalIcon) {
      setIcons((prevIcons) => {
        return prevIcons.map((icon) => {
          if (icon.url === iconUrl) {
            return { ...icon, color: originalIcon.color };
          }
          return icon;
        });
      });
    }
    setEditingColorIconUrl(null);
  };

  return (
    <>
      {/* 页面头部元数据 */}
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.subtitle.replace("{count}", icons.length.toString())} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.page}>
        {/* 导航栏 */}
        <Navigation />

        {/* 搜索和控制栏 */}
        {/* 包含搜索框、主题切换、下载格式选择、布局切换等控制项 */}
        <div className={styles.controls}>
          {/* 左侧控制区：搜索框和快捷操作 */}
          <div className={styles.controlsLeft}>
            {/* 搜索输入框 */}
            <div className={styles.searchWrapper}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* 快捷操作按钮组 */}
            <div className={styles.commandGroup}>
              {/* 排序按钮（暂未实现功能） */}
              <button className={styles.iconButton} title={t.sort}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M7 12h10M11 18h2" />
                </svg>
              </button>
              {/* 清空搜索按钮 */}
              <button className={styles.iconButton} title={tCommon.clear} onClick={() => setSearchQuery("")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          {/* 右侧控制区：主题、下载格式、布局切换 */}
          <div className={styles.controlsRight}>
            {/* 主题切换控制组 */}
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>{t.theme}</span>
              <div className={styles.buttonGroup}>
                {/* 亮色主题按钮 */}
                <button
                  className={`${styles.iconButton} ${theme === "light" ? styles.active : ""}`}
                  onClick={() => setTheme("light")}
                  title={t.lightMode}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                </button>
                {/* 暗色主题按钮 */}
                <button
                  className={`${styles.iconButton} ${theme === "dark" ? styles.active : ""}`}
                  onClick={() => setTheme("dark")}
                  title={t.darkMode}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </button>
                {/* 自动主题按钮（跟随系统设置） */}
                <button
                  className={`${styles.iconButton} ${theme === "auto" ? styles.active : ""}`}
                  onClick={() => setTheme("auto")}
                  title={t.autoMode}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </button>
              </div>
            </div>
            {/* 下载格式选择控制组 */}
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>{t.downloadFormat}</span>
              <div className={styles.buttonGroup}>
                {/* SVG 格式按钮 */}
                <button
                  className={`${styles.textButton} ${downloadFormat === "SVG" ? styles.active : ""}`}
                  onClick={() => setDownloadFormat("SVG")}
                >
                  SVG
                </button>
                {/* PNG 格式按钮 */}
                <button
                  className={`${styles.textButton} ${downloadFormat === "PNG" ? styles.active : ""}`}
                  onClick={() => setDownloadFormat("PNG")}
                >
                  PNG
                </button>
              </div>
            </div>
            {/* 布局模式切换控制组 */}
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>{t.layout}</span>
              <div className={styles.buttonGroup}>
                {/* 网格布局按钮 */}
                <button
                  className={`${styles.iconButton} ${layout === "grid" ? styles.active : ""}`}
                  onClick={() => setLayout("grid")}
                  title={t.gridLayout}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
                {/* 紧凑布局按钮 */}
                <button
                  className={`${styles.iconButton} ${layout === "compact" ? styles.active : ""}`}
                  onClick={() => setLayout("compact")}
                  title={t.compactLayout}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 图标展示区域 */}
        <main className={styles.main}>
          {/* 根据布局模式选择不同的 CSS 类 */}
          <div
            className={layout === "grid" ? styles.iconGrid : styles.iconGridCompact}
            data-layout={layout}
          >
            {/* 遍历过滤后的图标列表 */}
            {filteredIcons.map((icon) => (
              <IconCard
                key={icon.url}
                icon={icon}
                language={language}
                editingColorIconUrl={editingColorIconUrl}
                getIconColor={getIconColor}
                handleColorChange={handleColorChange}
                handleColorClick={handleColorClick}
                handleResetColor={handleResetColor}
                handleDownload={handleDownload}
                tCommon={tCommon}
              />
            ))}
          </div>
        </main>
        {/* 页脚 */}
        <Footer />
      </div>
    </>
  );
}
