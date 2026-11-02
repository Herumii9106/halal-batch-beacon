import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HalalTrace — Halal Supply Chain Verification on Solana" },
      { name: "description", content: "Verify halal product batches and trace every supply chain stage on the Solana blockchain." },
      { property: "og:title", content: "HalalTrace — Halal Verification on Solana" },
      { property: "og:description", content: "Verify halal product batches and trace every supply chain stage on Solana." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Stage = { name: string; time: string; location: string; inspector: string; sig: string };
type Product = { id: string; name: string; manufacturer: string; cert: string; tx: string; stages: Stage[] };

const sig = () => Array.from({ length: 64 }, () => "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[Math.floor(Math.random() * 58)]).join("");

const seed: Product[] = [
  {
    id: "HT-2026-0412",
    name: "Premium Beef Rendang 500g",
    manufacturer: "Nusantara Foods Sdn Bhd",
    cert: "MUI-00120034560926",
    tx: "5KtPn1LrNqW8vZ3xYb7cHd2mF9gJ4sA6eR1uT8oP3iQ2wE5yU7aS9dF4gH6jK8lZ1xC3vB5nM7qW9eR2tY4uI",
    stages: [
      { name: "Sourcing", time: "2026-10-02 07:14", location: "Bandung, ID", inspector: "Ust. Ahmad F.", sig: "0x7a3f…c91e" },
      { name: "Processing", time: "2026-10-04 13:40", location: "Jakarta, ID", inspector: "Dr. Siti R.", sig: "0x2b8d…44af" },
      { name: "Packaging", time: "2026-10-06 09:05", location: "Jakarta, ID", inspector: "Hj. Rahman K.", sig: "0x9e10…7b2c" },
      { name: "Distribution", time: "2026-10-09 16:22", location: "Kuala Lumpur, MY", inspector: "Ust. Ismail N.", sig: "0x51cc…e08d" },
    ],
  },
];

function Index() {
  const [products, setProducts] = useState(seed);
  const [tab, setTab] = useState<"search" | "admin">("search");
  const [query, setQuery] = useState("HT-2026-0412");
  const [result, setResult] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [wallet, setWallet] = useState<string | null>(null);

  const verify = () => {
    const p = products.find((x) => x.id.toLowerCase() === query.trim().toLowerCase());
    setResult(p ?? null);
    setNotFound(!p);
    if (p) setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const go = (t: "search" | "admin", anchor?: string) => {
    setTab(t);
    setTimeout(() => document.getElementById(anchor ?? "top")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div id="top" className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary font-bold text-primary-foreground">H</div>
            <span className="text-lg font-bold">Halal<span className="text-primary">Trace</span></span>
          </div>
          <nav className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
            <button onClick={() => go("search")} className="hover:text-primary">Search</button>
            <button onClick={() => { go("search", "timeline"); if (!result) setResult(products[0] ?? null); }} className="hover:text-primary">Traceability</button>
            <button onClick={() => go("admin", "admin")} className="hover:text-primary">Admin Panel</button>
          </nav>
          <button
            onClick={() => setWallet(wallet ? null : "7xKX…gAsU")}
            className="flex items-center gap-2 rounded-full bg-slate-deep px-4 py-2 text-sm font-semibold text-slate-deep-foreground hover:opacity-90"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-web3" />
            {wallet ? wallet : <><span className="hidden sm:inline">Connect</span> Phantom<span className="hidden sm:inline"> Wallet</span></>}
            <span className="rounded-full bg-web3 px-2 py-0.5 text-[10px] uppercase tracking-wide">Solana</span>
          </button>
        </div>
      </header>

      <section className="bg-hero px-4 pb-24 pt-16 text-slate-deep-foreground">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-deep-foreground/20 px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> On-chain halal verification
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">Trust every bite, verified on Solana.</h1>
          <p className="mt-4 text-slate-deep-foreground/70">Trace halal certification from farm to shelf with immutable blockchain records.</p>
        </div>
      </section>

      <main className="mx-auto -mt-16 max-w-6xl space-y-8 px-4 pb-20">
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border bg-card p-1 shadow-card">
            {(["search", "admin"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-full px-5 py-2 text-sm font-semibold ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                {t === "search" ? "Verify Product" : "Add Record (Admin)"}
              </button>
            ))}
          </div>
        </div>

        {tab === "search" ? (
          <>
            <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
              <label className="text-sm font-semibold">Enter Product Batch Code or ID</label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && verify()}
                  placeholder="e.g. HT-2026-0412" className="flex-1 rounded-xl border bg-background px-4 py-3 font-mono outline-none focus:ring-2 focus:ring-ring" />
                <button onClick={verify} className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">Verify Product</button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Try: {products.map((p) => p.id).join(", ")}</p>
              {notFound && <p className="mt-3 text-sm text-destructive">No on-chain record found for this batch.</p>}
            </div>

            {result && <Results p={result} />}
          </>
        ) : (
          <AdminForm wallet={wallet} onAdd={(p) => { setProducts([...products, p]); setQuery(p.id); setResult(p); setTab("search"); }} />
        )}
      </main>
    </div>
  );
}

function Results({ p }: { p: Product }) {
  return (
    <div id="results" className="grid gap-6 lg:grid-cols-5">
      <div className="rounded-2xl border bg-card p-6 shadow-card lg:col-span-2">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-bold">Verification Result</h2>
          <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-accent-foreground">✓ Certified Halal</span>
        </div>
        <dl className="mt-5 space-y-4 text-sm">
          {[["Product Name", p.name], ["Batch ID", p.id], ["Manufacturer", p.manufacturer], ["Certificate Number", p.cert]].map(([k, v]) => (
            <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>
          ))}
          <div>
            <dt className="text-muted-foreground">Solana Transaction Signature</dt>
            <dd><a href={`https://explorer.solana.com/tx/${p.tx}?cluster=devnet`} target="_blank" rel="noreferrer" className="block truncate font-mono text-primary underline">{p.tx}</a></dd>
          </div>
        </dl>
      </div>
      <div id="timeline" className="rounded-2xl border bg-card p-6 shadow-card lg:col-span-3">
        <h2 className="text-lg font-bold">Supply Chain Timeline</h2>
        <ol className="mt-6 space-y-0">
          {p.stages.map((s, i) => (
            <li key={s.name} className="relative flex gap-4 pb-6 last:pb-0">
              {i < p.stages.length - 1 && <span className="absolute left-[15px] top-8 h-full w-0.5 bg-primary/30" />}
              <span className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
              <div className="flex-1 rounded-xl border bg-background p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{s.name}</h3>
                  <time className="font-mono text-xs text-muted-foreground">{s.time}</time>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{s.location}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span>Inspector: <b>{s.inspector}</b></span>
                  <span className="rounded bg-secondary px-2 py-0.5 font-mono">sig {s.sig}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function AdminForm({ wallet, onAdd }: { wallet: string | null; onAdd: (p: Product) => void }) {
  const [f, setF] = useState({ id: "", name: "", cert: "", location: "" });
  const fields: [keyof typeof f, string, string][] = [
    ["id", "Batch ID", "HT-2026-0500"], ["name", "Product Name", "Chicken Satay 1kg"],
    ["cert", "Halal Cert Number", "MUI-0012…"], ["location", "Location", "Surabaya, ID"],
  ];
  const ok = Object.values(f).every((v) => v.trim());
  const submit = () => {
    const now = new Date();
    const stages = ["Sourcing", "Processing", "Packaging", "Distribution"].map((name, i) => ({
      name, location: f.location, inspector: "Pending inspector", sig: `0x${sig().slice(0, 4)}…${sig().slice(0, 4)}`,
      time: new Date(now.getTime() + i * 864e5).toISOString().slice(0, 16).replace("T", " "),
    }));
    onAdd({ id: f.id.trim(), name: f.name, cert: f.cert, manufacturer: wallet ? `Producer ${wallet}` : "Unverified producer", tx: sig(), stages });
  };
  return (
    <div id="admin" className="mx-auto max-w-2xl rounded-2xl border bg-card p-6 shadow-card sm:p-8">
      <h2 className="text-lg font-bold">Add Batch Verification Log</h2>
      <p className="mt-1 text-sm text-muted-foreground">Records are signed with your connected wallet and written to Solana.</p>
      {!wallet && <p className="mt-4 rounded-lg bg-secondary p-3 text-sm">Connect your Phantom wallet to sign records.</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {fields.map(([k, label, ph]) => (
          <label key={k} className="text-sm font-medium">
            {label}
            <input value={f[k]} placeholder={ph} onChange={(e) => setF({ ...f, [k]: e.target.value })}
              className="mt-1.5 w-full rounded-xl border bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring" />
          </label>
        ))}
      </div>
      <button disabled={!ok || !wallet} onClick={submit} className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-40">
        Sign & Submit to Solana
      </button>
    </div>
  );
}
