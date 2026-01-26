/**
 * 图标卡片组件
 *
 * 功能：
 * - 显示图标预览、名称和描述
 * - 支持颜色选择和修改
 * - 支持查看和下载操作
 */

import ColorInput from "@/components/ColorInput";
import type { Icon } from "@/types/icon";
import styles from "@/styles/components/IconCard.module.css";

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
  /** 当前正在编辑颜色的图标 ID */
  editingColorIconId: string | null;
  /** 获取图标颜色的函数 */
  getIconColor: (icon: Icon) => string;
  /** 颜色变更处理函数 */
  handleColorChange: (iconId: string, color: string) => void;
  /** 颜色点击处理函数 */
  handleColorClick: (iconId: string, event: React.MouseEvent) => void;
  /** 重置颜色处理函数 */
  handleResetColor: (iconId: string) => void;
  /** 查看处理函数 */
  handleView: (icon: Icon) => void;
  /** 下载处理函数 */
  handleDownload: (icon: Icon) => void;
  /** 通用翻译文本 */
  tCommon: {
    changeColor?: string;
    resetColor?: string;
    reset?: string;
    viewDetails: string;
    download: string;
  };
}

/**
 * 图标卡片组件
 */
export default function IconCard({
  icon,
  language,
  editingColorIconId,
  getIconColor,
  handleColorChange,
  handleColorClick,
  handleResetColor,
  handleView,
  handleDownload,
  tCommon,
}: IconCardProps) {
  return (
    <div className={styles.iconCard} data-icon-id={icon.id}>
      {/* 图标预览链接 */}
      <a
        href={icon.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.iconPreviewLink}
        onClick={(e) => {
          e.preventDefault();
          handleView(icon);
        }}
      >
        <div className={styles.iconPreview}>
          {/* 如果图标路径存在，渲染 IconImage 组件 */}
          {icon.path ? (
            <IconImage
              src={icon.path}
              color={getIconColor(icon)}
            />
          ) : (
            /* 占位符：当图标路径不存在时显示图标名称的首字母 */
            <span className={styles.iconPlaceholder}>
              {icon.name.charAt(0)}
            </span>
          )}
        </div>
      </a>
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
            onClick={(e) => handleColorClick(icon.id, e)}
            title={tCommon.changeColor || "点击更改颜色"}
            style={{ cursor: "pointer" }}
          >
            {getIconColor(icon)}
          </div>
          {/* 颜色选择器（absolute 定位） */}
          {editingColorIconId === icon.id && (
            <div
              className={styles.colorPickerContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <ColorInput
                value={getIconColor(icon)}
                onChange={(color) => handleColorChange(icon.id, color)}
              />
              <button
                className={styles.resetColorButton}
                onClick={() => handleResetColor(icon.id)}
                title={tCommon.resetColor || "重置为原始颜色"}
              >
                {tCommon.reset || "重置"}
              </button>
            </div>
          )}
        </div>
        {/* 查看详情按钮 */}
        <button
          className={styles.iconActionButton}
          onClick={() => handleView(icon)}
          title={tCommon.viewDetails}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
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
