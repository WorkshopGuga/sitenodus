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
    <p
      className={`m-0 flex items-center gap-3 text-[10px] md:text-[11px] font-bold uppercase tracking-[.2em] leading-[1.6] ${
        light ? "text-ink" : "text-white"
      }`}
    >
      <span
        aria-hidden
        className={`shrink-0 w-[7px] h-[7px] rounded-full ${
          light ? "bg-accent-deep shadow-[0_0_14px_rgba(58,95,214,.55)]" : "bg-accent shadow-[0_0_16px_#5a83ff]"
        }`}
      />
      <span>{children}</span>
    </p>
  );
}

export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`mt-5 mb-0 font-bold text-[clamp(31px,4.8vw,60px)] leading-[1.08] tracking-[-.05em] ${className}`}>
      {children}
    </h2>
  );
}

export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`mt-6 text-[15px] md:text-[16px] leading-[1.8] font-normal max-w-[620px] ${className}`}>
      {children}
    </p>
  );
}

export function CTAButton({ to, children, variant = "solid", size = "md" }:
  { to: string; children: ReactNode; variant?: "solid" | "ghost"; size?: "md" | "lg" }) {
  const cls = variant === "solid"
    ? "bg-[#e9eefc] text-[#0b1020] hover:bg-white"
    : "bg-[#0c111d]/40 border border-white/[.22] text-white hover:border-white/40";
  return (
    <Link
      to={to}
      className={`${size === "lg" ? "w-full sm:w-auto min-h-[64px] px-8 py-[20px] text-[14.5px] gap-10" : "min-h-[50px] px-[22px] py-[15px] text-[12.5px] gap-6"} inline-flex items-center justify-between rounded-[5px] font-bold no-underline transition-all duration-200 hover:-translate-y-[3px] ${cls}`}
    >
      <span>{children}</span>
      <span aria-hidden>→</span>
    </Link>
  );
}

export function PageHero({ eyebrow, titulo, texto }:
  { eyebrow: string; titulo: ReactNode; texto: string }) {
  return (
    <section className="bg-ink px-5 md:px-10 pt-36 pb-20 md:pb-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_75%_0%,rgba(39,85,196,.34),transparent_68%)]" />
      <div className="max-w-content mx-auto relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-6 mb-0 text-white font-bold text-[clamp(36px,6vw,76px)] leading-[1.02] tracking-[-.065em] max-w-[900px]">
          {titulo}
        </h1>
        <Lead className="text-white/65">{texto}</Lead>
      </div>
    </section>
  );
}
