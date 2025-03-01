"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";

export default function RegisterPage() {
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
    const confirmPassword = formData.get("confirmPassword") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      // Redirection vers la page de connexion
      router.push("/auth/login?registered=true");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Ou{" "}
            <Link
              href="/auth/login"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                label="Prénom"
                placeholder="John"
              />
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                label="Nom"
                placeholder="Doe"
              />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              required
              label="Adresse email"
              placeholder="email@example.com"
            />
            <Input
              id="password"
              name="password"
              type="password"
              required
              label="Mot de passe"
              placeholder="Votre mot de passe"
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              label="Confirmer le mot de passe"
              placeholder="Confirmez votre mot de passe"
            />
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
              Créer un compte
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 