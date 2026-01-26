import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  // 获取 basePath（从环境变量）
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <Html lang="en">
      <Head>
        {/* 注入 basePath 到 window 对象，供客户端使用 */}
        {basePath && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__NEXT_PUBLIC_BASE_PATH = ${JSON.stringify(basePath)};`,
            }}
          />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
