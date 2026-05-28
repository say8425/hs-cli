export const SUPPORTED_LOCALES = [
  "enUS",
  "enGB",
  "frFR",
  "deDE",
  "koKR",
  "esES",
  "esMX",
  "ruRU",
  "zhTW",
  "zhCN",
  "itIT",
  "ptBR",
  "plPL",
  "jaJP",
  "thTH",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "enUS";

const LANG_PREFIX_MAP: Readonly<Record<string, Locale>> = {
  ko: "koKR",
  en: "enUS",
  ja: "jaJP",
  zh: "zhCN",
  fr: "frFR",
  de: "deDE",
  es: "esES",
  ru: "ruRU",
  it: "itIT",
  pt: "ptBR",
  pl: "plPL",
  th: "thTH",
};

const SUPPORTED_SET: ReadonlySet<string> = new Set(SUPPORTED_LOCALES);

export const isValidLocale = (input: string): input is Locale => SUPPORTED_SET.has(input);

export const normalizeLocale = (input: string): Locale | undefined => {
  const trimmed = input.trim();
  if (trimmed.length === 0) return undefined;

  if (isValidLocale(trimmed)) return trimmed;

  const compact = trimmed.replaceAll(/[-_]/g, "");
  if (isValidLocale(compact)) return compact;

  const lower = trimmed.toLowerCase();
  const [primary, region] = lower.split(/[-_]/);

  if (region) {
    const candidate = `${primary}${region.toUpperCase()}`;
    if (isValidLocale(candidate)) return candidate;
  }

  if (primary && primary in LANG_PREFIX_MAP) return LANG_PREFIX_MAP[primary];

  return undefined;
};

const readEnv = (key: string): string | undefined => {
  const value = process.env[key];
  return value && value.length > 0 ? value : undefined;
};

export const detectLocale = (): Locale => {
  const candidates = [
    readEnv("HS_CLI_LOCALE"),
    readEnv("LC_ALL"),
    readEnv("LC_MESSAGES"),
    readEnv("LANG"),
    readEnv("LANGUAGE"),
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const stripped = raw.split(".")[0].split(":")[0];
    const resolved = normalizeLocale(stripped);
    if (resolved) return resolved;
  }

  return DEFAULT_LOCALE;
};

export const resolveLocale = (input?: string): Locale => {
  if (input === undefined || input === "") return detectLocale();
  const resolved = normalizeLocale(input);
  if (!resolved) {
    throw new Error(`Unknown locale "${input}". Supported: ${SUPPORTED_LOCALES.join(", ")}`);
  }
  return resolved;
};
