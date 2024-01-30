import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ServerChannelLoadingProvider } from "@/components/providers/server-channel-loading-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ciscord",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-zinc-100", "dark:bg-zinc-900")}>
          <ThemeProvider
            defaultTheme="dark"
            attribute="class"
            storageKey="ciscord-theme"
            enableSystem={false}
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>
                <ServerChannelLoadingProvider>
                  {children}
                </ServerChannelLoadingProvider>
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
