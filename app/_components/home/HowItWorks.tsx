const steps = [
  ["01", "Expliquez", "Décrivez simplement votre besoin à BUROIA."],
  ["02", "Préparez", "BUROIA vous accompagne dans la préparation de votre document."],
  ["03", "Validez", "Ajoutez vos pièces, organisez et vérifiez votre dossier."],
  ["04", "Récupérez", "Téléchargez votre document ou récupérez-le dans un kiosque."],
];

export default function HowItWorks() {
  return (
    <section id="fonctionnement" className="bg-white px-6 py-24 lg:px-8"><div className="mx-auto max-w-6xl"><div className="text-center"><p className="text-sm font-bold uppercase tracking-widest text-blue-700">Processus</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Comment fonctionne BUROIA ?</h2><p className="mx-auto mt-4 max-w-2xl text-slate-600">Quelques étapes simples pour passer de votre besoin à un document prêt à être récupéré.</p></div><div className="mt-16 grid gap-10 md:grid-cols-4">{steps.map(([number, title, text]) => <div key={number} className="relative text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 font-bold text-white shadow-lg shadow-blue-700/20">{number}</div><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}</div></div></section>
  );
}
