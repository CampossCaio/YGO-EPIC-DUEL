import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ApplicationProvider } from "../contexts/ApplicationContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>

      <ApplicationProvider>
        <Component {...pageProps} />
      </ApplicationProvider>
    </>
  );
}

export default MyApp;
