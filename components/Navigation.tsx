import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useLanguage } from "./LanguageContext";
import { getTranslation } from "@/locales";
import { getAssetPath } from "@/utils/path";
import styles from "@/styles/components/Navigation.module.css";

export default function Navigation() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const t = getTranslation(language);
  const tCommon = t.common;
  const tHome = t.home;

  const isHome = router.pathname === "/";
  const isTools = router.pathname === "/tools";

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoImageWrapper}>
            <Image
              src={getAssetPath("/logo.png")}
              alt="Logo"
              width={40}
              height={40}
              className={styles.logoImage}
            />
          </div>
          <div className={styles.logoText}>
            <h1 className={styles.logoTitle}>{tHome.title}</h1>
            <p className={styles.logoSubtitle}>
              {tHome.logoSubtitle}
            </p>
          </div>
        </Link>
        <nav className={styles.nav}>
          <div className={styles.navLinks}>
            <Link href="/" className={`${styles.navPageLink} ${isHome ? styles.active : ""}`}>
              {tCommon.home}
            </Link>
            <Link href="/tools" className={`${styles.navPageLink} ${isTools ? styles.active : ""}`}>
              {tCommon.tools}
            </Link>
            <div className={styles.navDivider}></div>
          </div>
          <div className={styles.languageDropdown}>
            <button
              className={styles.navLink}
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              onBlur={() => setTimeout(() => setShowLanguageMenu(false), 200)}
            >
              {language === "zh" ? tCommon.chinese : tCommon.english}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "4px" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {showLanguageMenu && (
              <div className={styles.languageMenu}>
                <button
                  className={`${styles.languageOption} ${language === "zh" ? styles.active : ""}`}
                  onClick={() => {
                    setLanguage("zh");
                    setShowLanguageMenu(false);
                  }}
                >
                  {tCommon.chinese}
                </button>
                <button
                  className={`${styles.languageOption} ${language === "en" ? styles.active : ""}`}
                  onClick={() => {
                    setLanguage("en");
                    setShowLanguageMenu(false);
                  }}
                >
                  {tCommon.english}
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
