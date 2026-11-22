import type { Metadata, Viewport } from "next";
import { Fredoka, Poppins } from "next/font/google";
import { AppProvider } from "@/components/AppProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Cozinha Inteligente",
  description: "Diga o que tem na geladeira e receba receitas personalizadas com inteligência artificial.",
  appleWebApp: { capable: true, title: "Cozinha", statusBarStyle: "default" },
  icons: { icon: "/icone.svg", apple: "/icone.svg" },
};

export const viewport: Viewport = {
  themeColor: "#e8862a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${fredoka.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
