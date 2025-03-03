import "./globals.css";
import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Providers from "./components/Providers";
import CookieConsent from "./components/CookieConsent";

export const metadata: Metadata = {
  title: "NationSounds Festival",
  description: "Le festival de musique NationSounds",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="fr">
      <body className="bg-black">
        <Providers session={session}>
          <Header />
          <main>{children}</main>
          <CookieConsent />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
