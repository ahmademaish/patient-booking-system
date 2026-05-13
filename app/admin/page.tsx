import { AdminTable } from "@/components/features/AdminTable";

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <section className="mb-4 rounded-2xl border border-zinc-800/50 bg-zinc-900 p-5">
        <h1 className="text-2xl font-semibold text-zinc-50">Staff Console</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Command center view for upcoming appointments. Click a row to open full appointment
          controls.
        </p>
      </section>
      <AdminTable />
    </main>
  );
}
