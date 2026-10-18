import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion, type Variants } from "framer-motion";

// Linguagem de motion da Codexy, a mesma dos anúncios em Remotion, adaptada pro
// site: entradas rápidas (< 0,8 s), disparadas quando o elemento entra na tela.
// Quem pede "reduzir movimento" no sistema vê tudo parado (MotionConfig
// reducedMotion="user" em App.tsx + checagens abaixo).
export const ease = {
  /** Entradas: começa rápido e assenta suave. */
  out: [0.16, 1, 0.3, 1],
  /** "Pop": passa um pouco do tamanho final e volta. */
  back: [0.34, 1.56, 0.64, 1],
} as const;

const VIEWPORT = { once: true, amount: 0.3 } as const;

type Part = { text: string; className?: string };

/**
 * Título palavra por palavra: cada palavra sobe de dentro de uma máscara
 * (overflow hidden), com leve rotação e desfoque saindo. O texto completo
 * continua no HTML (SEO e leitor de tela leem normal).
 */
export function KineticText({
  parts,
  as: Tag = "span",
  className,
  delay = 0,
  onMount = false,
}: {
  parts: Part[];
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
  delay?: number;
  /** true = anima ao carregar (hero); false = quando entra na tela. */
  onMount?: boolean;
}) {
  const words = parts.flatMap((part) =>
    part.text.split(" ").filter(Boolean).map((word) => ({ word, className: part.className })),
  );
  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: delay } } };
  const word: Variants = {
    hidden: { y: "110%", rotate: 4, filter: "blur(8px)" },
    show: { y: "0%", rotate: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: ease.out } },
  };
  const MotionTag = motion[Tag];
  const trigger = onMount ? { animate: "show" } : { whileInView: "show", viewport: VIEWPORT };

  return (
    <MotionTag className={className} variants={container} initial="hidden" {...trigger}>
      {words.map((w, i) => (
        // O espaço fica fora da máscara: dentro de inline-block ele é descartado
        // e as palavras grudam. pb/-mb: a máscara não corta descendentes (g, p, ç).
        <Fragment key={i}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
            <motion.span variants={word} className={`inline-block origin-bottom-left ${w.className ?? ""}`}>
              {w.word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </MotionTag>
  );
}

/** Revela o conteúdo de baixo pra cima por recorte (clip-path), com stagger por índice. */
export function Reveal({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  // Dois níveis de propósito: o Chrome desconta o clip-path no IntersectionObserver,
  // então observar o próprio elemento recortado dá área visível 0 e ele nunca
  // dispara. O de fora (sem recorte) observa; o de dentro recebe o recorte.
  const clip: Variants = {
    hidden: { clipPath: "inset(100% 0% 0% 0% round 16px)", y: 24 },
    show: {
      clipPath: "inset(0% 0% 0% 0% round 16px)",
      y: 0,
      transition: { duration: 0.7, ease: ease.out, delay: index * 0.08 },
      // Tira o recorte no fim: senão ele corta a sombra do hover (tech-glow).
      transitionEnd: { clipPath: "none" },
    },
  };
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={VIEWPORT}>
      <motion.div variants={clip} className="h-full">
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Entrada com "pop" (escala passando um pouco de 1), pra ícones e números. */
export function Pop({ children, index = 0, className }: { children: ReactNode; index?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, ease: ease.back, delay: index * 0.08 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Número que conta até o valor quando aparece. Aceita "30+", "99%", "3+".
 * O HTML do prerender sai com o valor final; o zero só entra no navegador,
 * enquanto a seção ainda está fora da tela.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const isNumber = match !== null;
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(target);

  useEffect(() => {
    if (!isNumber || reduceMotion) return;
    if (!inView) {
      setShown(0);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.2,
      ease: ease.out,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, reduceMotion, isNumber]);

  if (!isNumber) return <span className={className}>{value}</span>;
  return (
    // tabular-nums: a largura não fica pulando enquanto conta.
    // Uma string só: {shown}{suffix} separados viram "30<!-- -->+" no HTML do prerender.
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>{`${shown}${suffix}`}</span>
  );
}

/**
 * Envolve um ícone lucide (SVG de traço) e desenha o traço quando aparece.
 * A animação em si é CSS (.draw-icon em index.css).
 */
export function DrawIcon({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT);
  return (
    <span ref={ref} className={`draw-icon ${inView ? "is-drawn" : ""} ${className ?? ""}`}>
      {children}
    </span>
  );
}
