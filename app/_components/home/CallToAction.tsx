import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="px-6 py-24 lg:px-8"><div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-blue-700 px-8 py-16 text-center text-white shadow-2xl sm:px-12"><p className="text-sm font-bold uppercase tracking-widest text-blue-200">BUROIA</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Prêt à simplifier vos démarches ?</h2><p className="mx-auto mt-4 max-w-xl leading-7 text-blue-100">Créez votre compte et commencez à utiliser les services numériques de BUROIA.</p><Link href="/register" className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-bold text-blue-700 transition hover:bg-blue-50">Créer mon compte</Link></div></section>
  );
}
