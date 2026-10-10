"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("buroia@gmail.com");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Une erreur est survenue.");
        return;
      }

      setMessage("Connexion réussie !");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setMessage("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:flex">

        {/* LEFT SIDE */}
        <section className="relative hidden md:flex md:w-1/2 overflow-hidden bg-blue-700 p-10 text-white">
          
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-800" />

          <div className="relative z-10 flex flex-col justify-between w-full">
            
            <div>
              <div className="text-4xl font-extrabold tracking-tight">
                BUROIA<span className="text-blue-200">.</span>
              </div>

              <div className="mt-16">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200">
                  Bienvenue
                </p>

                <h1 className="text-4xl font-bold leading-tight">
                  Vos démarches administratives,
                  <br />
                  plus simples.
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-blue-100">
                  Préparez vos documents, organisez vos dossiers et
                  accédez facilement aux services administratifs avec
                  BUROIA.
                </p>
              </div>
            </div>

            <div className="mt-16">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  ✓
                </div>

                <div>
                  <p className="font-semibold">Simple et rapide</p>
                  <p className="text-sm text-blue-200">
                    Gagnez du temps dans vos démarches.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="w-full p-8 sm:p-10 md:w-1/2 md:p-12">

          {/* Mobile logo */}
          <div className="mb-8 text-center md:hidden">
            <div className="text-3xl font-extrabold text-blue-700">
              BUROIA<span className="text-blue-400">.</span>
            </div>
          </div>

          <div className="max-w-md mx-auto">

            <div>
              <p className="text-sm font-semibold text-blue-700">
                ESPACE UTILISATEUR
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Connectez-vous
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Accédez à votre espace BUROIA.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Adresse email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Mot de passe
                  </label>

                  <a
                    href="#"
                    className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* MESSAGE */}
              {message && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {message}
                </div>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-700 py-3.5 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 hover:shadow-blue-700/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>

            </form>

            {/* REGISTER */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Vous n&apos;avez pas encore de compte ?
              </p>

              <a
                href="/register"
                className="mt-2 inline-block text-sm font-bold text-blue-700 hover:text-blue-800 hover:underline"
              >
                Créer un compte
              </a>
            </div>

            {/* FOOTER */}
            <p className="mt-10 text-center text-xs text-slate-400">
              © 2026 BUROIA — Services administratifs numériques
            </p>

          </div>
        </section>

      </div>
    </main>
  );
}
