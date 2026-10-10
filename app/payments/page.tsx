import Link from "next/link";
import AppShell from "@/app/_components/AppShell";

export default function PaymentsPage() {
  return (
    <AppShell activeTab="payments">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">BUROIA / Paiements</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Mes paiements</h1>
          <p className="mt-2 text-sm text-slate-600">Consultez les règlements associés à vos demandes.</p>
        </header>
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mx-auto max-w-lg py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">💳</div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">Aucun paiement enregistré</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Les paiements réels ne sont pas encore activés. Vous pouvez parcourir le flux de démonstration sans être débité.
            </p>
            <Link href="/assistant" className="mt-5 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">
              Créer une demande
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
