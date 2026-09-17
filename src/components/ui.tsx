import { ReactNode } from "react";
import { Link } from "react-router-dom";

export function Section({
  tone = "dark", children, className = "", id,
}: { tone?: "dark" | "light" | "surface"; children: ReactNode; className?: string; id?: string }) {
  const bg =
    tone === "light" ? "bg-paper text-ink" :
    tone === "surface" ? "bg-surface text-white" : "bg-ink text-white";
  return (
    <section id={id} className={`${bg} px-5 md:px-10 py-20 md:py-32 ${className}`}>
      <div className="max-w-content mx-auto">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`m-0 text-[14px] font-medium ${light ? "text-accent-deep" : "text-accent"}`}>
      {children}
    </p>
  );
}

export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`mt-4 mb-0 font-semibold text-[clamp(28px,4vw,50px)] leading-[1.1] tracking-[-.028em] ${className}`}>
      {children}
    </h2>
  );
}

export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`mt-5 text-[16px] leading-[1.7] font-light max-w-[620px] ${className}`}>
      {children}
    </p>
  );
}

export function CTAButton({ to, children, variant = "solid" }:
  { to: string; children: ReactNode; variant?: "solid" | "ghost" }) {
  const cls = variant === "solid"
    ? "bg-gradient-to-br from-accent to-accent-deep text-white shadow-[0_10px_36px_rgba(29,78,216,.42)]"
    : "border border-white/15 text-white/85 hover:bg-white/5";
  return (
    <Link to={to} className={`inline-block px-7 py-[15px] rounded-full text-[15px] font-medium no-underline transition-all ${cls}`}>
      {children}
    </Link>
  );
}

export function PageHero({ eyebrow, titulo, texto }:
  { eyebrow: string; titulo: ReactNode; texto: string }) {
  return (
    <section className="bg-ink px-5 md:px-10 pt-36 pb-20 md:pb-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_75%_0%,rgba(29,78,216,.28),transparent_68%)]" />
      <div className="max-w-content mx-auto relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 mb-0 text-white font-semibold text-[clamp(32px,5vw,60px)] leading-[1.06] tracking-[-.028em] max-w-[760px]">
          {titulo}
        </h1>
        <Lead className="text-white/60">{texto}</Lead>
      </div>
    </section>
  );
}
