import { useInitServiceWorker } from "@/hooks/use-init-web-worker";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";

const theme: MantineThemeOverride = {
  colorScheme: "dark",
};

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  useInitServiceWorker();

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider>
          <Component {...pageProps} />
        </NotificationsProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}
