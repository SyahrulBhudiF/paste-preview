import { describe, expect, it } from "vitest";
import { detectPasteLanguage, normalizeLanguage } from "@/features/paste-preview/language";

describe("language utilities", () => {
  it("detects markdown before generic text", () => {
    expect(detectPasteLanguage("# Hello\n\n- one")).toBe("markdown");
  });

  it("detects json", () => {
    expect(detectPasteLanguage('{ "ok": true }')).toBe("json");
  });

  it("detects TypeScript before Markdown blockquote syntax", () => {
    expect(
      detectPasteLanguage(
        'import ReactMarkdown from "react-markdown";\n\nexport function View() {\n  return <ReactMarkdown>{content}</ReactMarkdown>;\n}',
      ),
    ).toBe("typescript");
  });

  it("normalizes aliases", () => {
    expect(normalizeLanguage("ts")).toBe("typescript");
    expect(normalizeLanguage("sh")).toBe("bash");
  });
});
