import { BackendLocale, LocaleCode, LocalizedText } from "../types/app";

export function getLocalizedText(
  value: LocalizedText | string | undefined | null,
  locale: LocaleCode,
) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return locale === "es" ? value.es : value.en;
}

export function toBackendLocale(locale: LocaleCode): BackendLocale {
  return locale === "es" ? "ES" : "EN";
}

export function fromBackendLocale(locale?: BackendLocale): LocaleCode {
  return locale === "ES" ? "es" : "en";
}

export function formatSeconds(seconds: number) {
  const safe = Math.max(seconds, 0);
  const minutes = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const remaining = Math.floor(safe % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remaining}`;
}
