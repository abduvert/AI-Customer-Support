import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UniBuddy",
  description: "Any questions about university, courses, transfers, or drop-outs? Our smart UniBuddy AI bot has the answers to everything!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
