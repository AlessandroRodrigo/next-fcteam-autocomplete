import type { AppProps } from "next/app";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

const theme: MantineThemeOverride = {
  colorScheme: "dark",
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <NotificationsProvider>
        <Component {...pageProps} />
      </NotificationsProvider>
    </MantineProvider>
  );
}
