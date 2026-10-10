const services = [
  ["🤖", "Assistant IA", "Expliquez votre besoin et obtenez une assistance pour préparer vos documents."],
  ["📄", "Documents", "Créez, importez, organisez et retrouvez facilement vos documents."],
  ["🖨️", "Impression", "Préparez vos documents pour impression et récupérez-les facilement."],
  ["📍", "Kiosques", "Trouvez un kiosque BUROIA disponible à proximité de votre position."],
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-slate-50 px-6 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-bold uppercase tracking-widest text-blue-700">Nos services</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Tout ce qu&apos;il vous faut au même endroit</h2><p className="mt-4 text-slate-600">BUROIA rassemble plusieurs services pour vous accompagner dans vos démarches administratives.</p></div><div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{services.map(([icon, title, description]) => <div key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl transition group-hover:bg-blue-100">{icon}</div><h3 className="mt-6 text-lg font-bold text-slate-900">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p><div className="mt-5 text-sm font-semibold text-blue-700">En savoir plus →</div></div>)}</div></div></section>
  );
}
