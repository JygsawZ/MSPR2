"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Header: React.FC = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

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
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Administration
            </Link>
          )}
          {session ? (
            <Link
              href="/dashboard"
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
export default Header;
