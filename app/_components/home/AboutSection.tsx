const features = [
  ["Gain de temps", "Préparez vos démarches avant de vous déplacer."],
  ["Organisation", "Gardez vos documents et dossiers mieux organisés."],
  ["Accessibilité", "Accédez aux services depuis votre téléphone ou ordinateur."],
  ["Kiosques", "Récupérez facilement vos documents lorsque nécessaire."],
];

export default function AboutSection() {
  return (
    <section id="apropos" className="bg-slate-50 px-6 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center"><div><p className="text-sm font-bold uppercase tracking-widest text-blue-700">Pourquoi BUROIA ?</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Une nouvelle façon de gérer vos démarches.</h2><p className="mt-5 leading-7 text-slate-600">Les démarches administratives peuvent nécessiter plusieurs documents, impressions, scans et déplacements. BUROIA rassemble ces différentes étapes dans une expérience numérique plus simple.</p></div><div className="grid gap-4 sm:grid-cols-2">{features.map(([title, text]) => <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">✓</div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}</div></div></section>
  );
}
