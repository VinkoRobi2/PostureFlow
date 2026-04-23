import type { LocaleCode } from "../../types/app";

export const HOURS_OPTIONS = [4, 6, 8, 10, 12] as const;

export function getLocalizedOnboardingText(locale: LocaleCode) {
  if (locale === "es") {
    return {
      welcome: "Respira.",
      problemTitle: "Tu silla no te sostiene. Te está absorbiendo.",
      problemStat:
        "Pasar 8 horas sentado ejerce hasta 140kg de presión sobre tus discos lumbares.",
      solutionTitle:
        "Recupera tu ergonomía. Micro-flujos de Tai Chi de 3 minutos, sin levantarte del escritorio.",
      nameTitle: "¿Cómo te llamas?",
      namePlaceholder: "Escribe tu nombre",
      nameCta: "Continuar",
      hoursTitle: (name: string) =>
        `${name || "Excelente"}, ¿cuántas horas al día pasas frente a una pantalla?`,
      hoursCaption: (hours: number) =>
        `Eso equivale a ${Math.round((hours / 24) * 365)} días al año de inactividad muscular continua.`,
      scannerGreeting: (name: string) => `Excelente, ${name || "vamos"}.`,
      scannerCta: "Continuar con mi diagnóstico",
      ahaGreeting: (name: string) => `Excelente, ${name || "vamos"}.`,
      ahaTitle: "Vamos a liberar esa tensión. Son solo 15 segundos. Acompáñame.",
      ahaSteps: ["Inhala", "Rota los hombros hacia atrás", "Exhala"],
      ahaFooter: "Tu cuerpo aprende mejor cuando siente el cambio, no cuando lo lee.",
      ahaCta: "Sentí el alivio",
      paywallTitle: "Desbloquea tu ergonomía total.",
      paywallTrust:
        "Prueba 7 días gratis. Te enviaremos una notificación 1 día antes de que termine. Cancela con un toque.",
      paywallCta: "Iniciar mi prueba sin riesgo",
      paywallSecondary: "Ya tengo cuenta",
      paywallBadge: "Black Card Access",
      authPrompt: "Activa tu plan para guardar tu progreso y personalizar tu flujo.",
      continueTap: "Toca para continuar",
    };
  }

  return {
    welcome: "Hey.",
    problemTitle: "Does your chair feel like it's absorbing you?",
    problemStat:
      "Spending 8 hours seated can place up to 140kg of pressure on your lumbar discs.",
    solutionTitle:
      "Reclaim your ergonomics. 3-minute Tai Chi micro-flows, without leaving your desk.",
    nameTitle: "What's your name?",
    namePlaceholder: "Type your name",
    nameCta: "Continue",
    hoursTitle: (name: string) =>
      `${name || "Let’s begin"}, how many hours a day do you spend in front of a screen?`,
    hoursCaption: (hours: number) =>
      `That equals ${Math.round((hours / 24) * 365)} days a year of continuous muscular inactivity.`,
    scannerGreeting: (name: string) => `Excellent, ${name || "let’s begin"}.`,
    scannerCta: "Continue with my diagnosis",
    ahaGreeting: (name: string) => `Excellent, ${name || "let’s begin"}.`,
    ahaTitle: "Let's release that tension. It only takes 15 seconds. Stay with me.",
    ahaSteps: ["Inhale", "Roll your shoulders back", "Exhale"],
    ahaFooter:
      "Your body trusts a product faster when it can physically feel the shift.",
    ahaCta: "I felt the relief",
    paywallTitle: "Unlock your full ergonomics.",
    paywallTrust:
      "Try it free for 7 days. We'll notify you 1 day before it ends. Cancel in one tap.",
    paywallCta: "Start my risk-free trial",
    paywallSecondary: "I already have an account",
    paywallBadge: "Black Card Access",
    authPrompt: "Activate your plan to save progress and personalize your flow.",
    continueTap: "Tap anywhere to continue",
  };
}
