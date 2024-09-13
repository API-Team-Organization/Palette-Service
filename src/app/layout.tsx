import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Palette",
  description: "Made by Palette.Team",
  icons: {
    icon: '/Images/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body>
    {children}
    </body>
    </html>
  );
}
