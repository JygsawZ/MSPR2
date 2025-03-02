"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import dynamic from "next/dynamic";

const Header: React.FC = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const handleAuthClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (session) {
      await signOut({ redirect: true, callbackUrl: "/" });
    } else {
      window.location.href = "/auth/login";
    }
  };

  return (
    <React.Fragment>
      <div className="navbar bg-base-100 fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              title="button"
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-xl z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <Link href="/pages/accueil">Accueil</Link>
              </li>
              <li>
                <Link href="/pages/programmation">Programmation</Link>
              </li>
              <li>
                <Link href="/pages/plan-du-festival">Plan du festival</Link>
              </li>
              <li>
                <Link href="/pages/faq">FAQ</Link>
              </li>
              {isAdmin && (
                <li className="lg:hidden">
                  <Link
                    href="/admin"
                    className="bg-black text-white hover:bg-gray-900"
                  >
                    Administration
                  </Link>
                </li>
              )}
              <li className="lg:hidden">
                <button
                  onClick={handleAuthClick}
                  className="hover:text-gray-700 flex items-center justify-center w-full"
                  title={session ? "Déconnexion" : "Connexion"}
                >
                  {session ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  )}
                </button>
              </li>
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost text-xl">
            Nation Sound
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/pages/accueil">Accueil</Link>
            </li>
            <li>
              <Link href="/pages/programmation">Programmation</Link>
            </li>
            <li>
              <Link href="/pages/plan-du-festival">Plan du festival</Link>
            </li>
            <li>
              <Link href="/pages/faq">FAQ</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <button className="btn btn-outline">
            <Link href="/pages/billetterie">Billetterie</Link>
          </button>
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden lg:inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-900 ml-2"
            >
              Administration
            </Link>
          )}
          <button
            onClick={handleAuthClick}
            className="hidden lg:inline-block bg-white text-black p-2 rounded hover:bg-gray-200 ml-2"
            title={session ? "Déconnexion" : "Connexion"}
          >
            {session ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default dynamic(() => Promise.resolve(Header), {
  ssr: false
});
