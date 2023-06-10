import { Html, Head, Main, NextScript } from "next/document";

const APP_NAME = "YU-GI-OH EPIC DUEL";
const APP_DESCRIPTION = "A SIMPLE ONLINE DIGITAL CARD GAME";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="application-name" content={APP_NAME} />
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="theme-color" content="#000000" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
