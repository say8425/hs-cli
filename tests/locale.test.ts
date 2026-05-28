import { describe, it, expect } from "bun:test";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  detectLocale,
  isValidLocale,
  normalizeLocale,
  resolveLocale,
} from "../src/services/locale.ts";

describe("isValidLocale", () => {
  it("accepts every supported locale", () => {
    for (const loc of SUPPORTED_LOCALES) {
      expect(isValidLocale(loc)).toBe(true);
    }
  });

  it("rejects garbage", () => {
    expect(isValidLocale("xxYY")).toBe(false);
    expect(isValidLocale("")).toBe(false);
  });
});

describe("normalizeLocale", () => {
  it("returns the exact code when already supported", () => {
    expect(normalizeLocale("koKR")).toBe("koKR");
    expect(normalizeLocale("enUS")).toBe("enUS");
  });

  it("normalizes BCP-47 / POSIX style", () => {
    expect(normalizeLocale("ko-KR")).toBe("koKR");
    expect(normalizeLocale("ko_KR")).toBe("koKR");
    expect(normalizeLocale("en-US")).toBe("enUS");
    expect(normalizeLocale("zh-CN")).toBe("zhCN");
  });

  it("falls back to language-only by prefix", () => {
    expect(normalizeLocale("ko")).toBe("koKR");
    expect(normalizeLocale("ja")).toBe("jaJP");
    expect(normalizeLocale("en")).toBe("enUS");
    expect(normalizeLocale("zh")).toBe("zhCN");
  });

  it("returns undefined for unknown input", () => {
    expect(normalizeLocale("foobar")).toBeUndefined();
    expect(normalizeLocale("")).toBeUndefined();
  });
});

describe("detectLocale", () => {
  it("returns a supported locale", () => {
    const detected = detectLocale();
    expect(SUPPORTED_LOCALES).toContain(detected);
  });

  it("honors HS_CLI_LOCALE override", () => {
    const before = process.env.HS_CLI_LOCALE;
    process.env.HS_CLI_LOCALE = "jaJP";
    try {
      expect(detectLocale()).toBe("jaJP");
    } finally {
      if (before === undefined) delete process.env.HS_CLI_LOCALE;
      else process.env.HS_CLI_LOCALE = before;
    }
  });

  it("falls back to DEFAULT_LOCALE when no env hints are present", () => {
    const snapshot: Record<string, string | undefined> = {};
    for (const key of ["HS_CLI_LOCALE", "LC_ALL", "LC_MESSAGES", "LANG", "LANGUAGE"]) {
      snapshot[key] = process.env[key];
      delete process.env[key];
    }
    try {
      expect(detectLocale()).toBe(DEFAULT_LOCALE);
    } finally {
      for (const [key, value] of Object.entries(snapshot)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });
});

describe("resolveLocale", () => {
  it("returns detected locale when called with no argument", () => {
    const before = process.env.HS_CLI_LOCALE;
    process.env.HS_CLI_LOCALE = "deDE";
    try {
      expect(resolveLocale()).toBe("deDE");
    } finally {
      if (before === undefined) delete process.env.HS_CLI_LOCALE;
      else process.env.HS_CLI_LOCALE = before;
    }
  });

  it("normalizes a user-provided value", () => {
    expect(resolveLocale("ko-KR")).toBe("koKR");
    expect(resolveLocale("en")).toBe("enUS");
  });

  it("throws on unsupported locale", () => {
    expect(() => resolveLocale("klingon")).toThrow(/Unknown locale/);
  });
});
