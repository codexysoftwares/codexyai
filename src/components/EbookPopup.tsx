import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BookOpen, Check, X } from "lucide-react";
import EbookForm, { EBOOK_STORAGE_KEY } from "@/components/ebook/EbookForm";

/**
 * Popup do e-book "IA para automatizar processos" (captura de lead).
 *
 * Quando aparece (uma vez; fechou → some por 14 dias; enviou → nunca mais):
 * - Computador: janela ao tentar sair da página, após 45 s ou ao rolar 60%.
 * - Celular: só um cartão pequeno no rodapé. O formulário abre quando a pessoa
 *   toca nele — o Google penaliza popup que cobre a página no celular.
 * Renderiza só depois de montar no navegador (sem divergência com o prerender).
 *
 * O formulário (EbookForm) é o mesmo da página /ebook/, onde o popup não aparece.
 */

const HIDDEN_PATHS = ["/politica-privacidade", "/termos-uso", "/cookies", "/preview", "/ebook"];

const SNOOZE_DAYS = 14;
const MIN_DELAY_MS = 10_000;
const AUTO_OPEN_MS = 45_000;
const SCROLL_RATIO = 0.6;

type Stage = "hidden" | "teaser" | "open";

function readState(): { done?: boolean; snoozedUntil?: number } {
  try {
    return JSON.parse(localStorage.getItem(EBOOK_STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeState(value: { done?: boolean; snoozedUntil?: number }) {
  try {
    localStorage.setItem(EBOOK_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // navegação privada sem storage: o popup pode voltar, sem problema
  }
}

export default function EbookPopup() {
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<Stage>("hidden");
  const [done, setDone] = useState(false);

  const blocked = HIDDEN_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => setMounted(true), []);

  // Gatilhos: só arma se a pessoa ainda não baixou nem fechou recentemente.
  useEffect(() => {
    if (!mounted || blocked || stage !== "hidden") return;
    const saved = readState();
    if (saved.done || (saved.snoozedUntil ?? 0) > Date.now()) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const startedAt = Date.now();
    const show = () => {
      if (Date.now() - startedAt < MIN_DELAY_MS) return;
      setStage(isMobile ? "teaser" : "open");
    };

    const timer = window.setTimeout(() => setStage(isMobile ? "teaser" : "open"), AUTO_OPEN_MS);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_RATIO) show();
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!isMobile) document.addEventListener("mouseout", onLeave);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [mounted, blocked, stage]);

  const dismiss = useCallback(() => {
    if (!done) writeState({ snoozedUntil: Date.now() + SNOOZE_DAYS * 86_400_000 });
    setStage("hidden");
  }, [done]);

  useEffect(() => {
    if (stage !== "open") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [stage, dismiss]);

  if (!mounted || blocked || stage === "hidden") return null;

  if (stage === "teaser") {
    return (
      <div className="fixed inset-x-3 bottom-3 z-40 mr-[4.5rem] flex items-center gap-3 rounded-2xl border border-primary/15 bg-background p-3 shadow-xl shadow-black/15">
        <BookOpen className="h-8 w-8 shrink-0 text-primary" />
        <button type="button" onClick={() => setStage("open")} className="min-w-0 flex-1 text-left">
          <span className="block text-sm font-semibold leading-tight text-primary">E-book grátis: IA para automatizar processos</span>
          <span className="text-xs text-tech-gray">Toque para receber</span>
        </button>
        <button type="button" onClick={dismiss} aria-label="Fechar" className="rounded-full p-1 text-tech-gray hover:bg-secondary">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={dismiss}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ebook-popup-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-background shadow-2xl sm:grid sm:grid-cols-[0.9fr_1.1fr] sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-1.5 text-tech-gray hover:bg-secondary"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col justify-center gap-4 bg-gradient-to-br from-primary to-accent p-6 text-white sm:p-8">
          <div className="mx-auto hidden aspect-[3/4] w-40 flex-col justify-between rounded-lg bg-white/10 p-4 shadow-2xl ring-1 ring-white/25 sm:flex">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">E-book gratuito</span>
            <span className="text-lg font-bold leading-tight">IA para automatizar processos</span>
            <span className="text-[10px] font-semibold tracking-widest">CODEXY</span>
          </div>
          <ul className="space-y-2 text-sm text-white/90">
            {[
              "Como achar as tarefas que valem automatizar",
              "Exemplos prontos de atendimento, agenda e cobrança",
              "Quanto custa e por onde começar sem errar",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 sm:p-8">
          <EbookForm pagePath={pathname} autoFocus titleId="ebook-popup-title" onDone={() => setDone(true)} />
        </div>
      </div>
    </div>
  );
}
