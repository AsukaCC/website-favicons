import { useState, useRef } from "react";
import Head from "next/head";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { useTheme } from "@/components/ThemeContext";
import { getTranslation } from "@/locales";
import styles from "@/styles/pages/Tools.module.css";

export default function Tools() {
  const { language } = useLanguage();
  useTheme(); // 确保主题上下文被加载和应用
  const t = getTranslation(language).tools;
  const tCommon = getTranslation(language).common;
  const [svgCode, setSvgCode] = useState(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="#3b82f6" />
</svg>`);
  const [iconName, setIconName] = useState("icon");
  const [iconSize, setIconSize] = useState(64);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [previewSize, setPreviewSize] = useState(128);
  const [error, setError] = useState("");
  const svgPreviewRef = useRef<HTMLDivElement>(null);

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
      }
    } catch {
      setError(t.svgFormatError);
    }
  };

  const downloadSVG = () => {
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
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
    if (!svgPreviewRef.current) return;

    const svgElement = svgPreviewRef.current.querySelector("svg");
    if (!svgElement) return;

    const canvas = document.createElement("canvas");
    canvas.width = iconSize;
    canvas.height = iconSize;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // 设置背景色
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    const svgBlob = new Blob([svgCode], { type: "image/svg+xml" });
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
    setSvgCode(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="#3b82f6" />
</svg>`);
    setIconName("icon");
    setIconSize(64);
    setBackgroundColor("#ffffff");
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
                className={styles.codeEditor}
                value={svgCode}
                onChange={(e) => handleSvgChange(e.target.value)}
                placeholder={t.svgCodePlaceholder}
                spellCheck={false}
              />
              {error && <div className={styles.error}>{error}</div>}
            </div>

            <div className={styles.previewSection}>
              <div className={styles.sectionHeader}>
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
                  style={{ width: previewSize, height: previewSize }}
                  dangerouslySetInnerHTML={{ __html: svgCode }}
                />
              </div>
            </div>

            <div className={styles.settingsSection}>
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
                  <label>{t.backgroundColor}</label>
                  <div className={styles.colorInputWrapper}>
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className={styles.colorInput}
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className={styles.textInput}
                      placeholder="#ffffff"
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
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
