import Link from "next/link";

export default function LandingNav() {
  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-700">BUROIA<span className="text-blue-400">.</span></Link>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#services" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">Services</a>
          <a href="#fonctionnement" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">Comment ça marche</a>
          <a href="#apropos" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">À propos</a>
          <Link href="/operations" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">Démo opérations</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block">Se connecter</Link>
          <Link href="/register" className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800">Commencer</Link>
        </div>
      </div>
    </nav>
  );
}
