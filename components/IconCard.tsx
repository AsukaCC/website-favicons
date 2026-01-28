/**
 * 图标卡片组件
 *
 * 功能：
 * - 显示图标预览、名称和描述
 * - 支持颜色选择和修改
 * - 支持查看和下载操作
 * - 支持复制 SVG/PNG 到剪贴板
 */

import { useState } from "react";
import { useRouter } from "next/router";
import ColorInput from "@/components/ColorInput";
import type { Icon } from "@/types/icon";
import styles from "@/styles/components/IconCard.module.css";
import { getAssetPath } from "@/utils/path";
import { getContrastingTextColor } from "@/utils/color";
import { copySVGToClipboard, copyPNGToClipboard } from "@/utils/clipboard";
import { useToast } from "@/components/ToastContext";
import { useLanguage } from "@/components/LanguageContext";
import { getTranslation } from "@/locales";

/**
 * SVG 图标组件
 *
 * 功能：
 * - 使用 CSS mask 技术，将 SVG 作为蒙版
 * - 背景色即为图标颜色，实现简单高效的颜色切换
 * - 避免修改 SVG 内容，性能更好
 *
 * @param src - SVG 文件的路径
 * @param color - 图标的颜色（作为背景色显示）
 */
const IconImage = ({ src, color }: { src: string; color: string }) => {
  // 使用 CSS mask 技术：SVG 作为蒙版，背景色作为图标颜色
  return (
    <div
      className={styles.iconSvg}
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  );
};

interface IconCardProps {
  /** 图标数据 */
  icon: Icon;
  /** 当前语言 */
  language: "zh" | "en";
  /** 当前正在编辑颜色的图标 URL */
  editingColorIconUrl: string | null;
  /** 获取图标颜色的函数 */
  getIconColor: (icon: Icon) => string;
  /** 颜色变更处理函数 */
  handleColorChange: (iconUrl: string, color: string) => void;
  /** 颜色点击处理函数 */
  handleColorClick: (iconUrl: string, event: React.MouseEvent) => void;
  /** 重置颜色处理函数 */
  handleResetColor: (iconUrl: string) => void;
  /** 下载处理函数 */
  handleDownload: (icon: Icon) => void;
  /** 通用翻译文本 */
  tCommon: {
    changeColor?: string;
    resetColor?: string;
    reset?: string;
    viewDetails: string;
    edit?: string;
    download: string;
  };
}

/**
 * 图标卡片组件
 */
export default function IconCard({
  icon,
  language,
  editingColorIconUrl,
  getIconColor,
  handleColorChange,
  handleColorClick,
  handleResetColor,
  handleDownload,
  tCommon,
}: IconCardProps) {
  const iconColor = getIconColor(icon);
  const iconColorText = getContrastingTextColor(iconColor);
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const { showToast } = useToast();
  const { language: currentLanguage } = useLanguage();
  const router = useRouter();
  const tCommonLocal = getTranslation(currentLanguage).common;

  const iconUrl = icon.url.startsWith("http") ? icon.url : `https://${icon.url}`;

  // 复制 SVG 到剪贴板
  const copySVG = async () => {
    if (!icon.path || isCopying) return;
    
    setIsCopying(true);
    try {
      await copySVGToClipboard(icon.path, iconColor);
      setShowCopyMenu(false);
      showToast(tCommonLocal.svgCopied, "success");
    } catch (error) {
      console.error("Failed to copy SVG:", error);
      showToast(tCommonLocal.copyFailed, "error");
    } finally {
      setIsCopying(false);
    }
  };

  // 复制 PNG 到剪贴板
  const copyPNG = async () => {
    if (!icon.path || isCopying) return;
    
    setIsCopying(true);
    try {
      await copyPNGToClipboard(icon.path, iconColor);
      setShowCopyMenu(false);
      showToast(tCommonLocal.pngCopied, "success");
    } catch (error) {
      console.error("Failed to copy PNG:", error);
      showToast(tCommonLocal.copyFailed, "error");
    } finally {
      setIsCopying(false);
    }
  };

  // 编辑 SVG：跳转到 tools 页面
  const handleEdit = async () => {
    if (!icon.path) return;
    
    try {
      // 获取 SVG 内容
      const svgPath = getAssetPath(icon.path);
      const response = await fetch(svgPath);
      const svgText = await response.text();
      
      // 修改 SVG 颜色
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
      const svgElement = svgDoc.documentElement;
      
      // 如果 SVG 有 fill 属性，修改为当前颜色
      if (svgElement.hasAttribute("fill")) {
        svgElement.setAttribute("fill", iconColor);
      } else {
        svgElement.setAttribute("fill", iconColor);
      }
      
      // 序列化修改后的 SVG
      const serializer = new XMLSerializer();
      const modifiedSvg = serializer.serializeToString(svgElement);
      
      // 将 SVG 内容和名称编码后通过 URL 参数传递
      const encodedSvg = encodeURIComponent(modifiedSvg);
      const encodedName = encodeURIComponent(icon.name);
      
      // 使用 router 跳转到 tools 页面，通过 query 参数传递数据
      router.push({
        pathname: "/tools",
        query: {
          svg: encodedSvg,
          name: encodedName,
        },
      });
    } catch (error) {
      console.error("Failed to open editor:", error);
      showToast(tCommonLocal.editFailed || "打开编辑器失败", "error");
    }
  };

  return (
    <div className={styles.iconCard} data-icon-url={icon.url}>
      {/* 右上角链接图标 */}
      <a
        href={iconUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.externalLink}
        onClick={(e) => e.stopPropagation()}
        title={iconUrl}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </a>
      {/* 图标预览区域 */}
      <div 
        className={styles.iconPreviewContainer}
        onMouseEnter={() => setShowCopyMenu(true)}
        onMouseLeave={() => setShowCopyMenu(false)}
      >
        <div className={styles.iconPreview}>
          {/* 如果图标路径存在，渲染 IconImage 组件 */}
          {icon.path ? (
            <IconImage
              src={getAssetPath(icon.path)}
              color={iconColor}
            />
          ) : (
            /* 占位符：当图标路径不存在时显示图标名称的首字母 */
            <span className={styles.iconPlaceholder}>
              {icon.name.charAt(0)}
            </span>
          )}
        </div>
        {/* 复制菜单 */}
        {showCopyMenu && icon.path && (
          <div className={styles.copyMenu}>
            <button
              className={styles.copyButton}
              onClick={(e) => {
                e.stopPropagation();
                copySVG();
              }}
              disabled={isCopying}
              title="复制 SVG"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>SVG</span>
            </button>
            <button
              className={styles.copyButton}
              onClick={(e) => {
                e.stopPropagation();
                copyPNG();
              }}
              disabled={isCopying}
              title="复制 PNG"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>PNG</span>
            </button>
          </div>
        )}
      </div>
      {/* 图标名称 */}
      <div className={styles.iconName}>{icon.name}</div>
      {/* 图标描述（根据当前语言显示） */}
      {icon.description && (
        <div className={styles.iconDescription}>
          {icon.description[language]}
        </div>
      )}
      {/* 图标操作栏 */}
      <div className={styles.iconActions}>
        {/* 颜色显示和选择器 */}
        <div className={styles.colorPickerWrapper}>
          <div

            className={styles.iconColor}
            onClick={(e) => handleColorClick(icon.url, e)}
            title={tCommon.changeColor || "点击更改颜色"}
            style={{
              cursor: "pointer",
              backgroundColor: iconColor,
              color: iconColorText,
            }}
          >
            {iconColor}
          </div>
          {/* 颜色选择器（absolute 定位） */}
          {editingColorIconUrl === icon.url && (
            <div
              className={styles.colorPickerContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <ColorInput
                value={iconColor}
                onChange={(color) => handleColorChange(icon.url, color)}
              />
              <button
                className={styles.resetColorButton}
                onClick={() => handleResetColor(icon.url)}
                title={tCommon.resetColor || "重置为原始颜色"}
              >
                {tCommon.reset || "重置"}
              </button>
            </div>
          )}
        </div>
        {/* 编辑按钮 */}
        <button
          className={styles.iconActionButton}
          onClick={handleEdit}
          title={tCommon.edit || "编辑"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        {/* 下载按钮 */}
        <button
          className={styles.iconActionButton}
          onClick={() => handleDownload(icon)}
          title={tCommon.download}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
