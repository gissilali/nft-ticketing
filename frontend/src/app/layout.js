import { Inter } from "next/font/google";
import "./globals.css";
import {Navbar} from "@/components/shared/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ticketing App",
  description: "nft event ticketing",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        <div className="container mx-auto">
            {children}
        </div>
      </body>
    </html>
  );
}
