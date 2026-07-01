import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import { normalizeLanguage } from "@/features/paste-preview/language";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("css", css);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("typescript", typescript);

export function CodePreview({ content, language }: { content: string; language: string }) {
  const normalized = normalizeLanguage(language);
  const highlighted =
    normalized === "text" || normalized === "auto" || normalized === "markdown"
      ? hljs.highlightAuto(content).value
      : hljs.highlight(content, { language: normalized, ignoreIllegals: true }).value;

  return (
    <pre className="overflow-x-auto p-5 font-mono text-sm leading-7 text-foreground">
      <code className={`language-${normalized}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  );
}
