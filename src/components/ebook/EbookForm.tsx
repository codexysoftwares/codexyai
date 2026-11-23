import { useEffect, useRef, useState, type FormEvent } from "react";
import { Download, Loader2 } from "lucide-react";

/**
 * Formulário do e-book "IA para automatizar processos", usado no popup
 * (EbookPopup) e na página /ebook/. Envia para o módulo lead-capture
 * (plano/modules/lead-capture) e libera o PDF na hora.
 */

const SITE = "codexy";
const API_URL = import.meta.env.VITE_LEAD_API_URL ?? "https://codexy.com.br/api/leads/ebook";
export const EBOOK_PDF_URL = "/ebook/ia-para-automatizar-processos.pdf";
const PDF_NAME = "IA-para-automatizar-processos-CODEXY.pdf";
const PRIVACY_URL = "/politica-privacidade/";
export const EBOOK_STORAGE_KEY = "codexy:ebook-ia";

export function markEbookDone() {
  try {
    localStorage.setItem(EBOOK_STORAGE_KEY, JSON.stringify({ done: true }));
  } catch {
    // navegação privada sem storage: sem problema
  }
}

function startDownload() {
  const a = document.createElement("a");
  a.href = EBOOK_PDF_URL;
  a.download = PDF_NAME;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

interface EbookFormProps {
  /** Vai para o lead (page_path): de onde a pessoa pediu o e-book. */
  pagePath: string;
  /** Foca o primeiro campo ao montar (popup). */
  autoFocus?: boolean;
  /** id do título, para o aria-labelledby de quem envolve o formulário. */
  titleId?: string;
  /** Esconde o título interno quando a página já tem o seu. */
  hideHeading?: boolean;
  onDone?: () => void;
}

const inputClass =
  "mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base outline-none focus:border-primary";

export default function EbookForm({ pagePath, autoFocus, titleId, hideHeading, onDone }: EbookFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const mountedAt = useRef(0);
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
    if (autoFocus) firstInput.current?.focus();
  }, [autoFocus]);

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
          page_path: pagePath,
          elapsed_ms: Date.now() - mountedAt.current,
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
    markEbookDone();
    setStatus("done");
    startDownload();
    onDone?.();
  }

  if (status === "done") {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-4">
        <h2 id={titleId} className="text-2xl font-bold text-primary">
          Seu e-book está baixando
        </h2>
        <p className="text-tech-gray">Se o download não começou, use o botão abaixo. Boa leitura!</p>
        <a
          href={EBOOK_PDF_URL}
          download={PDF_NAME}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90"
        >
          <Download className="h-4 w-4" /> Baixar o e-book
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {!hideHeading && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">E-book grátis</p>
          <h2 id={titleId} className="mt-1 text-2xl font-bold leading-tight text-primary">
            Como usar IA para automatizar os processos da sua empresa
          </h2>
          <p className="mt-2 text-sm text-tech-gray">Guia prático, sem jargão. Preencha e baixe na hora.</p>
        </div>
      )}

      <label className="block text-sm font-medium text-primary">
        Nome
        <input ref={firstInput} name="name" required minLength={2} maxLength={80} autoComplete="name" className={inputClass} />
      </label>
      <label className="block text-sm font-medium text-primary">
        E-mail
        <input name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} />
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
          className={inputClass}
        />
      </label>

      {/* Campo invisível contra robô: gente não vê nem preenche. */}
      <input name="company_site" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <label className="flex gap-2 text-xs leading-relaxed text-tech-gray">
        <input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
        <span>
          Autorizo a CODEXY a usar meus dados para enviar o e-book e entrar em contato sobre os seus serviços, conforme a{" "}
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
  );
}
