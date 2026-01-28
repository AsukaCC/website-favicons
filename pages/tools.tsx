import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { useTheme } from "@/components/ThemeContext";
import { getTranslation } from "@/locales";
import { modifySvgColor } from "@/utils/svg";
import ColorInput from "@/components/ColorInput";
import styles from "@/styles/pages/Tools.module.css";

export default function Tools() {
  const router = useRouter();
  const { language } = useLanguage();
  useTheme(); // 确保主题上下文被加载和应用
  const t = getTranslation(language).tools;
  const tCommon = getTranslation(language).common;

  // 避免 SSR 调用 DOMParser（例如 modifySvgColor）
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 默认 SVG 代码
  const defaultSvgCode = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="#3b82f6" />
</svg>`;
  
  // 从 URL 参数解析 SVG 代码和名称
  const parseUrlParams = () => {
    if (typeof window === "undefined" || !router.isReady) {
      return { svgCode: defaultSvgCode, iconName: "icon" };
    }
    
    const { svg, name } = router.query;
    if (svg && typeof svg === "string") {
      try {
        const decodedSvg = decodeURIComponent(svg);
        const decodedName = name && typeof name === "string" ? decodeURIComponent(name) : "icon";
        return { svgCode: decodedSvg, iconName: decodedName };
      } catch (error) {
        console.error("Failed to decode SVG from URL:", error);
      }
    }
    
    return { svgCode: defaultSvgCode, iconName: "icon" };
  };
  
  const urlData = parseUrlParams();
  const [svgCode, setSvgCode] = useState(urlData.svgCode);
  const [iconName, setIconName] = useState(urlData.iconName);
  // 保存初始传入的 SVG，用于重置
  const [initialSvgCode, setInitialSvgCode] = useState(urlData.svgCode);
  const [initialIconName, setInitialIconName] = useState(urlData.iconName);
  
  // 当路由参数变化时，更新 SVG 代码和初始值
  useEffect(() => {
    if (router.isReady) {
      const { svg, name } = router.query;
      if (svg && typeof svg === "string") {
        try {
          const decodedSvg = decodeURIComponent(svg);
          const decodedName = name && typeof name === "string" ? decodeURIComponent(name) : "icon";
          setSvgCode(decodedSvg);
          setIconName(decodedName);
          setInitialSvgCode(decodedSvg);
          setInitialIconName(decodedName);
          // 提取并设置图标颜色
          const extractedColor = extractColorFromSvg(decodedSvg);
          setIconColor(extractedColor);
        } catch (error) {
          console.error("Failed to decode SVG from URL:", error);
        }
      } else {
        // 如果没有 URL 参数，使用默认值
        setSvgCode(defaultSvgCode);
        setIconName("icon");
        setInitialSvgCode(defaultSvgCode);
        setInitialIconName("icon");
        const extractedColor = extractColorFromSvg(defaultSvgCode);
        setIconColor(extractedColor);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.svg, router.query.name]);
  const [iconSize, setIconSize] = useState(64);
  const [iconColor, setIconColor] = useState("#3b82f6");
  const [previewSize, setPreviewSize] = useState(128);
  const [error, setError] = useState("");
  const svgPreviewRef = useRef<HTMLDivElement>(null);
  
  // 从 SVG 代码中提取初始颜色
  const extractColorFromSvg = (svgText: string): string => {
    try {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
      const svgElement = svgDoc.documentElement;
      const fill = svgElement.getAttribute("fill");
      if (fill) {
        return fill;
      }
      // 检查子元素的 fill 属性
      const firstElement = svgElement.querySelector("[fill]");
      if (firstElement) {
        return firstElement.getAttribute("fill") || "#3b82f6";
      }
    } catch (error) {
      console.error("Failed to extract color from SVG:", error);
    }
    return "#3b82f6";
  };
  
  // 获取应用颜色后的 SVG
  const getColoredSvg = () => {
    return modifySvgColor(svgCode, iconColor);
  };

  const handleSvgChange = (value: string) => {
    setSvgCode(value);
    setError("");
    try {
      // 验证 SVG 代码
      const parser = new DOMParser();
      const doc = parser.parseFromString(value, "image/svg+xml");
      const parseError = doc.querySelector("parsererror");
      if (parseError) {
        setError(t.svgFormatError);
      } else {
        // 更新图标颜色为 SVG 中的颜色
        const extractedColor = extractColorFromSvg(value);
        setIconColor(extractedColor);
      }
    } catch {
      setError(t.svgFormatError);
    }
  };
  
  // 当 SVG 代码变化时，更新图标颜色
  useEffect(() => {
    const extractedColor = extractColorFromSvg(svgCode);
    setIconColor(extractedColor);
  }, [svgCode]);

  const downloadSVG = () => {
    // 下载应用颜色后的 SVG
    const coloredSvg = getColoredSvg();
    const blob = new Blob([coloredSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${iconName}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const coloredSvg = getColoredSvg();
    const canvas = document.createElement("canvas");
    canvas.width = iconSize;
    canvas.height = iconSize;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // 清空画布（透明背景）
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    const svgBlob = new Blob([coloredSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, iconSize, iconSize);
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = `${iconName}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
        }
      });
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const copySVG = () => {
    navigator.clipboard.writeText(svgCode).then(() => {
      alert(t.svgCopied);
    });
  };

  const resetSVG = () => {
    // 重置为初始传入的 SVG，如果没有传入则使用默认值
    setSvgCode(initialSvgCode);
    setIconName(initialIconName);
    setIconSize(64);
    const extractedColor = extractColorFromSvg(initialSvgCode);
    setIconColor(extractedColor);
    setError("");
  };

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.page}>
        <Navigation />

        {/* 主内容区域 */}
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.editorSection}>
              <div className={styles.sectionHeader}>
                <h2>{t.svgEditor}</h2>
                <div className={styles.actionButtons}>
                  <button className={styles.button} onClick={copySVG}>
                    {tCommon.copy}
                  </button>
                  <button className={styles.button} onClick={resetSVG}>
                    {tCommon.reset}
                  </button>
                </div>
              </div>
              <textarea
                id="svg-editor"
                className={styles.codeEditor}
                value={svgCode}
                onChange={(e) => handleSvgChange(e.target.value)}
                placeholder={t.svgCodePlaceholder}
                spellCheck={false}
              />
              {error && <div className={styles.error}>{error}</div>}
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.previewSection}>
                <div className={styles.sectionHeader}>
                  <h2>{t.exportSettings}</h2>
                </div>
                <div className={styles.settingsGrid}>
                  <div className={styles.settingItem}>
                    <label>{t.iconName}</label>
                    <input
                      type="text"
                      value={iconName}
                      onChange={(e) => setIconName(e.target.value)}
                      className={styles.textInput}
                      placeholder="icon"
                    />
                  </div>
                  <div className={styles.settingItem}>
                    <label>{t.iconSize}</label>
                    <input
                      type="number"
                      value={iconSize}
                      onChange={(e) => setIconSize(Number(e.target.value))}
                      className={styles.numberInput}
                      min="16"
                      max="512"
                    />
                    <span>{t.px}</span>
                  </div>
                  <div className={styles.settingItem}>
                    <label>{t.iconColor}</label>
                    <div className={styles.colorInputWrapper}>
                      <ColorInput
                        value={iconColor}
                        onChange={setIconColor}
                      />
                      <input
                        type="text"
                        value={iconColor}
                        onChange={(e) => setIconColor(e.target.value)}
                        className={styles.textInput}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.exportButtons}>
                  <button className={styles.primaryButton} onClick={downloadSVG}>
                    {t.downloadSVG}
                  </button>
                  <button className={styles.primaryButton} onClick={downloadPNG}>
                    {t.downloadPNG}
                  </button>
                </div>

                <div className={styles.sectionHeader} style={{ marginTop: '24px' }}>
                  <h2>{t.preview}</h2>
                  <div className={styles.previewControls}>
                    <label>
                      {t.previewSize}:
                      <input
                        type="range"
                        min="64"
                        max="256"
                        value={previewSize}
                        onChange={(e) => setPreviewSize(Number(e.target.value))}
                        className={styles.rangeInput}
                      />
                      <span>{previewSize}{t.px}</span>
                    </label>
                  </div>
                </div>
                <div className={styles.previewContainer}>
                  <div
                    ref={svgPreviewRef}
                    className={styles.preview}
                    style={{ width: `${previewSize}px`, height: `${previewSize}px` }}
                    // SSR 首屏用原始 SVG，挂载后再应用颜色，避免 DOMParser 报错/水合不一致
                    dangerouslySetInnerHTML={{ __html: mounted ? getColoredSvg() : svgCode }}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
