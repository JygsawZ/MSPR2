"use client";

import Link from "next/link";
import Accueil from "./pages/accueil/page";

export default function Home() {
  return (
    <div>
      <main>
        <Link href="/accuei" passHref legacyBehavior>
          <Accueil />
        </Link>
      </main>
    </div>
  );
}
