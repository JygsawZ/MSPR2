"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons";
import {
  FaUsers,
  FaGuitar,
  FaStopwatch,
  FaStore,
  FaTags,
  FaTheaterMasks,
  FaSignOutAlt,
} from "react-icons/fa";
import { signOut } from "next-auth/react";

interface MenuItem {
  name: string;
  href: string;
  icon: IconType;
}

const menuItems: MenuItem[] = [
  { name: "Gestion des scènes", href: "/admin/scenes", icon: FaTheaterMasks },
  { name: "Gestion des artistes", href: "/admin/artists", icon: FaGuitar },
  { name: "Running Order", href: "/admin/running-order", icon: FaStopwatch },
  { name: "Gestion des produits", href: "/admin/products", icon: FaStore },
  { name: "Gestion des tags", href: "/admin/tags", icon: FaTags },
  { name: "Gestion des utilisateurs", href: "/admin/users", icon: FaUsers },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Administration NationSounds</h1>
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-300 hover:text-white"
        >
          <FaSignOutAlt className="mr-2" />
          Déconnexion
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 min-h-[calc(100vh-4rem)]">
          <nav className="mt-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors",
                  pathname === item.href && "bg-gray-800 text-white border-l-4 border-blue-500"
                )}
              >
                <item.icon className="mr-3" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-black text-white">
          {children}
        </main>
      </div>
    </div>
  );
} 