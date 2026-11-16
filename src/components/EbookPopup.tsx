import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { BookOpen, Check, Download, Loader2, X } from "lucide-react";

/**
 * Popup do e-book "IA para automatizar processos" (captura de lead).
 *
 * Quando aparece (uma vez; fechou → some por 14 dias; enviou → nunca mais):
 * - Computador: janela ao tentar sair da página, após 45 s ou ao rolar 60%.
 * - Celular: só um cartão pequeno no rodapé. O formulário abre quando a pessoa
 *   toca nele — o Google penaliza popup que cobre a página no celular.
 * Renderiza só depois de montar no navegador (sem divergência com o prerender).
 *
 * O formulário vai para o módulo lead-capture (plano/modules/lead-capture).
 */

const SITE = "codexy";
const API_URL = import.meta.env.VITE_LEAD_API_URL ?? "https://codexy.com.br/api/leads/ebook";
const PDF_URL = "/ebook/ia-para-automatizar-processos.pdf";
const PDF_NAME = "IA-para-automatizar-processos-CODEXY.pdf";
const PRIVACY_URL = "/politica-privacidade/";
const HIDDEN_PATHS = ["/politica-privacidade", "/termos-uso", "/cookies", "/preview"];

const STORAGE_KEY = "codexy:ebook-ia";
const SNOOZE_DAYS = 14;
const MIN_DELAY_MS = 10_000;
const AUTO_OPEN_MS = 45_000;
const SCROLL_RATIO = 0.6;

type Stage = "hidden" | "teaser" | "open";

function readState(): { done?: boolean; snoozedUntil?: number } {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeState(value: { done?: boolean; snoozedUntil?: number }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // navegação privada sem storage: o popup pode voltar, sem problema
  }
}

function startDownload() {
  const a = document.createElement("a");
  a.href = PDF_URL;
  a.download = PDF_NAME;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function EbookPopup() {
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<Stage>("hidden");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const openedAt = useRef(0);
  const firstInput = useRef<HTMLInputElement>(null);

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
    if (status !== "done") writeState({ snoozedUntil: Date.now() + SNOOZE_DAYS * 86_400_000 });
    setStage("hidden");
  }, [status]);

  useEffect(() => {
    if (stage !== "open") return;
    openedAt.current = Date.now();
    firstInput.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [stage, dismiss]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError("");
    setStatus("sending");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: SITE,
          name: form.get("name"),
          email: form.get("email"),
          whatsapp: form.get("whatsapp"),
          consent: form.get("consent") === "on",
          company_site: form.get("company_site"),
          page_path: pathname,
          elapsed_ms: Date.now() - openedAt.current,
        }),
      });
      if (res.status === 400 || res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Confira os dados e tente de novo.");
        setStatus("idle");
        return;
      }
      // Erro do servidor: não prende quem já preencheu tudo, entrega o e-book igual.
      if (!res.ok) console.error("lead do e-book não registrado:", res.status);
    } catch (err) {
      console.error("lead do e-book não registrado:", err);
    }
    writeState({ done: true });
    setStatus("done");
    startDownload();
  }

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
          {status === "done" ? (
            <div className="flex h-full flex-col items-start justify-center gap-4">
              <h2 id="ebook-popup-title" className="text-2xl font-bold text-primary">
                Seu e-book está baixando
              </h2>
              <p className="text-tech-gray">
                Se o download não começou, use o botão abaixo. Boa leitura!
              </p>
              <a
                href={PDF_URL}
                download={PDF_NAME}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90"
              >
                <Download className="h-4 w-4" /> Baixar o e-book
              </a>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent">E-book grátis</p>
                <h2 id="ebook-popup-title" className="mt-1 text-2xl font-bold leading-tight text-primary">
                  Como usar IA para automatizar os processos da sua empresa
                </h2>
                <p className="mt-2 text-sm text-tech-gray">Guia prático, sem jargão. Preencha e baixe na hora.</p>
              </div>

              <label className="block text-sm font-medium text-primary">
                Nome
                <input
                  ref={firstInput}
                  name="name"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base outline-none focus:border-primary"
                />
              </label>
              <label className="block text-sm font-medium text-primary">
                E-mail
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base outline-none focus:border-primary"
                />
              </label>
              <label className="block text-sm font-medium text-primary">
                WhatsApp <span className="font-normal text-tech-gray">(opcional)</span>
                <input
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  maxLength={20}
                  autoComplete="tel"
                  placeholder="(31) 99999-9999"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base outline-none focus:border-primary"
                />
              </label>

              {/* Campo invisível contra robô: gente não vê nem preenche. */}
              <input name="company_site" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

              <label className="flex gap-2 text-xs leading-relaxed text-tech-gray">
                <input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
                <span>
                  Autorizo a CODEXY a usar meus dados para enviar o e-book e entrar em contato sobre os seus serviços,
                  conforme a{" "}
                  <a href={PRIVACY_URL} target="_blank" rel="noopener" className="underline">
                    Política de Privacidade
                  </a>
                  . Posso cancelar quando quiser.
                </span>
              </label>

              {error && <p className="text-sm font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Quero o e-book grátis
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
