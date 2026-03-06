import "./globals.css";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import LayoutProvider from "@/provider/LayoutProvider";
import UserProvider from "@/context/UserContext";
import { ChatProvider } from "@/context/ChatContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = { title: "Aviatefinder - Traveller" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body>
        <LayoutProvider>
          <UserProvider>
            <ChatProvider> {children}</ChatProvider>
          </UserProvider>
        </LayoutProvider>
      </body>
    </html>
  );
}
