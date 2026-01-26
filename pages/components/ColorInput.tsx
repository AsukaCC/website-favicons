/**
 * 颜色选择器输入组件
 *
 * 功能：
 * - 提供颜色选择器输入框
 * - 支持颜色值变更回调
 */

import styles from "@/styles/components/ColorInput.module.css";

interface ColorInputProps {
  /** 当前颜色值 */
  value: string;
  /** 颜色变更回调函数 */
  onChange: (color: string) => void;
  /** 自定义样式类名（可选） */
  className?: string;
}

/**
 * 颜色选择器输入组件
 */
export default function ColorInput({ value, onChange, className }: ColorInputProps) {
  return (
    <input
      type="color"
      defaultValue={value}
      onInput={(e) => {
        onChange(e.currentTarget.value);
      }}
      className={className || styles.colorInput}
    />
  );
}
