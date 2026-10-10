"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Une erreur est survenue.");
        return;
      }

      setMessage("Compte créé avec succès !");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

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

        {/* ================= LEFT SIDE ================= */}

        <section className="relative hidden overflow-hidden bg-blue-700 p-10 text-white md:flex md:w-1/2">

          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-800" />

          <div className="relative z-10 flex w-full flex-col justify-between">

            {/* Logo */}
            <div>
              <Link
                href="/"
                className="text-4xl font-extrabold tracking-tight"
              >
                BUROIA<span className="text-blue-200">.</span>
              </Link>
            </div>

            {/* Introduction */}
            <div className="my-16">

              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200">
                Rejoignez BUROIA
              </p>

              <h1 className="text-4xl font-bold leading-tight">
                Simplifiez vos démarches administratives.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-blue-100">
                Créez votre compte BUROIA et profitez d&apos;un espace
                pour préparer, organiser et gérer vos documents.
              </p>

            </div>

            {/* Benefits */}
            <div className="space-y-5">

              <RegisterFeature
                title="Assistant administratif"
                text="Obtenez de l'aide pour vos démarches."
              />

              <RegisterFeature
                title="Vos documents au même endroit"
                text="Organisez facilement vos fichiers et dossiers."
              />

              <RegisterFeature
                title="Accès aux kiosques"
                text="Trouvez un kiosque BUROIA proche de vous."
              />

            </div>

          </div>

        </section>


        {/* ================= RIGHT SIDE ================= */}

        <section className="w-full p-8 sm:p-10 md:w-1/2 md:p-12">

          {/* Mobile logo */}
          <div className="mb-8 text-center md:hidden">

            <Link
              href="/"
              className="text-3xl font-extrabold text-blue-700"
            >
              BUROIA<span className="text-blue-400">.</span>
            </Link>

          </div>


          <div className="mx-auto max-w-md">

            {/* Heading */}
            <div>

              <p className="text-sm font-semibold text-blue-700">
                CRÉATION DE COMPTE
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Créez votre compte
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Commencez à utiliser BUROIA en quelques secondes.
              </p>

            </div>


            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* NAME */}
              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nom complet
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Votre nom complet"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>


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

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Mot de passe
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 6 caractères"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>


              {/* CONFIRM PASSWORD */}
              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirmer le mot de passe
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Répétez votre mot de passe"
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


              {/* TERMS */}
              <p className="text-xs leading-5 text-slate-500">
                En créant votre compte, vous acceptez les conditions
                d&apos;utilisation et la politique de confidentialité de BUROIA.
              </p>


              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-700 py-3.5 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 hover:shadow-blue-700/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Création du compte..." : "Créer mon compte"}
              </button>

            </form>


            {/* LOGIN */}
            <div className="mt-8 text-center">

              <p className="text-sm text-slate-500">
                Vous avez déjà un compte ?
              </p>

              <Link
                href="/login"
                className="mt-2 inline-block text-sm font-bold text-blue-700 hover:text-blue-800 hover:underline"
              >
                Se connecter
              </Link>

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


/* ================= REGISTER FEATURE ================= */

function RegisterFeature({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm">
        ✓
      </div>

      <div>

        <p className="font-semibold">
          {title}
        </p>

        <p className="mt-1 text-sm text-blue-200">
          {text}
        </p>

      </div>

    </div>
  );
}