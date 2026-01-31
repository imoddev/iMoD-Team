import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iMoD Team — ระบบบริหารงานภายใน",
  description: "ระบบบริหารงานภายในองค์กร Mod Media Co., Ltd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased bg-gray-950 text-white">
        {children}
      </body>
    </html>
  );
}
