import { ArrowRight, BookOpen } from "lucide-react";

/**
 * Convite para o e-book dentro do texto dos posts do blog. Leva para /ebook/,
 * que registra de qual post a pessoa veio. Funciona igual no celular (não é
 * popup, então não sofre a penalidade do Google para intersticial).
 */
const EbookInlineCta = () => (
  <aside className="my-10 flex flex-col gap-4 rounded-2xl border border-primary/15 bg-secondary/50 p-6 sm:flex-row sm:items-center sm:gap-6">
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
      <BookOpen className="h-7 w-7" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-bold uppercase tracking-widest text-accent">E-book grátis</p>
      <p className="mt-1 text-lg font-bold leading-snug text-primary">Como usar IA para automatizar os processos da sua empresa</p>
      <p className="mt-1 text-sm text-tech-gray">8 processos para começar, fluxos prontos, custos e um plano de 30 dias.</p>
    </div>
    <a
      href="/ebook/"
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
    >
      Baixar grátis <ArrowRight className="h-4 w-4" />
    </a>
  </aside>
);

export default EbookInlineCta;
