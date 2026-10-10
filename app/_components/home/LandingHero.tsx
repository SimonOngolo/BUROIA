import Link from "next/link";

const shortcuts = [
  ["📄", "Documents", "Mes fichiers"],
  ["📍", "Kiosques", "Trouver un kiosque"],
  ["🖨️", "Impression", "Mes impressions"],
  ["🤖", "Assistant IA", "Demander de l'aide"],
];

export default function LandingHero() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"><span className="h-2 w-2 rounded-full bg-blue-600" />Votre assistant administratif</div>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-6xl">Vos démarches administratives,<span className="text-blue-700"> simplement.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Expliquez votre besoin. BUROIA vous accompagne dans la préparation de vos documents, l&apos;organisation de vos dossiers et la recherche d&apos;un kiosque proche de vous.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/register" className="rounded-xl bg-blue-700 px-7 py-4 text-center font-semibold text-white shadow-xl shadow-blue-700/20 transition hover:bg-blue-800">Commencer gratuitement</Link><a href="#fonctionnement" className="rounded-xl border border-slate-200 bg-white px-7 py-4 text-center font-semibold text-slate-700 transition hover:bg-slate-50">Découvrir BUROIA</a></div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">{["Simple à utiliser", "Documents organisés", "Kiosques proches"].map((item) => <div key={item} className="flex items-center gap-2"><span className="font-bold text-blue-700">✓</span>{item}</div>)}</div>
        </div>
        <div className="relative"><div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100 blur-3xl" /><div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-100 blur-3xl" /><div className="relative rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-2xl"><div className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-blue-700">BUROIA</p><h2 className="mt-1 text-xl font-bold">Bonjour 👋</h2></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">B</div></div><div className="mt-6 rounded-2xl bg-blue-700 p-5 text-white"><p className="text-sm text-blue-100">Assistant BUROIA</p><p className="mt-2 text-lg font-semibold">Que souhaitez-vous faire ?</p><div className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-blue-50">Préparer une demande administrative...</div></div><div className="mt-5 grid grid-cols-2 gap-3">{shortcuts.map(([icon, title, description]) => <div key={title} className="rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="text-xl">{icon}</div><p className="mt-2 text-sm font-bold text-slate-900">{title}</p><p className="mt-1 text-xs text-slate-500">{description}</p></div>)}</div></div></div></div>
      </div>
    </section>
  );
}
