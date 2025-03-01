"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard"); // Redirection vers le dashboard après connexion
        router.refresh(); // Rafraîchit la session
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Ou{" "}
            <Link
              href="/auth/register"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              créez un nouveau compte
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                required
                label="Adresse email"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                label="Mot de passe"
                placeholder="Votre mot de passe"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 bg-red-900/20 text-sm text-center p-3 rounded-md border border-red-500">
              {error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              block
            >
              Se connecter
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 