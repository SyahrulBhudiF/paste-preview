import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useEffect, useMemo, useState } from "react";
import { createPaste } from "@/apis/paste";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PastePreview } from "./components/PastePreview";
import {
  detectPasteLanguage,
  PasteLanguages,
  type PasteLanguage,
} from "@/features/paste-preview/language";

const DraftStorageKey = "paste-preview:draft";

interface PasteFormValues {
  content: string;
  language: PasteLanguage;
}

const defaultValues: PasteFormValues = {
  content: "",
  language: "auto",
};

export function PastePreviewFeature() {
  const [content, setContent] = useState(defaultValues.content);
  const [language, setLanguage] = useState<PasteLanguage>(defaultValues.language);
  const [detectedLanguage, setDetectedLanguage] = useState<PasteLanguage>("text");
  const [activePane, setActivePane] = useState<"editor" | "preview">("editor");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewLanguage = useMemo(
    () => (language === "auto" ? detectedLanguage : language),
    [language, detectedLanguage],
  );
  const hasContent = content.trim().length > 0;

  const createPasteMutation = useMutation({
    mutationFn: (value: PasteFormValues) =>
      createPaste({
        data: {
          content: value.content,
          language: value.language,
          detectedLanguage: value.language === "auto" ? detectedLanguage : value.language,
        },
      }),
    onSuccess: (result) => {
      setShareUrl(result.url);
      localStorage.removeItem(DraftStorageKey);
    },
    onError: () => {
      setError("Could not save paste. Your editor content is still here.");
    },
  });

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setError(null);
      setShareUrl(null);

      if (!value.content.trim()) {
        setError("Paste content is required.");
        return;
      }

      await createPasteMutation.mutateAsync(value);
    },
  });

  useEffect(() => {
    const raw = localStorage.getItem(DraftStorageKey);
    if (!raw) return;

    try {
      const draft = JSON.parse(raw) as PasteFormValues;
      setContent(draft.content);
      setLanguage(draft.language);
      form.setFieldValue("content", draft.content);
      form.setFieldValue("language", draft.language);
    } catch {
      localStorage.removeItem(DraftStorageKey);
    }
  }, [form]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      localStorage.setItem(DraftStorageKey, JSON.stringify({ content, language }));
    }, 500);
    return () => window.clearTimeout(handle);
  }, [content, language]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDetectedLanguage(detectPasteLanguage(content));
    }, 600);
    return () => window.clearTimeout(handle);
  }, [content]);

  const copyShareUrl = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
  };

  return (
    <main className="min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_34rem),linear-gradient(135deg,var(--background),color-mix(in_oklch,var(--secondary)_38%,var(--background)))] text-foreground">
      <form
        className="mx-auto flex min-h-dvh w-full max-w-[1500px] flex-col gap-5 px-4 py-5 md:px-6 lg:px-8"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <header className="rounded-3xl border border-border/70 bg-card/75 p-4 shadow-sm backdrop-blur md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                public preview · expires in 7 days
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                Paste preview
              </h1>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="rounded-2xl border bg-background/70 px-3 py-2 text-xs text-muted-foreground">
                Language: <span className="font-medium text-foreground">{previewLanguage}</span>
              </div>
              <Button
                type="submit"
                disabled={createPasteMutation.isPending || !hasContent}
                className="h-11 rounded-2xl px-5 shadow-sm transition-transform active:scale-[0.98]"
              >
                {createPasteMutation.isPending ? "Saving..." : "Save & share"}
              </Button>
            </div>
          </div>

          {shareUrl ? (
            <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/10 p-3 text-sm">
              <p className="mb-2 font-medium">Share link ready</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <a className="break-all text-primary underline underline-offset-4" href={shareUrl}>
                  {shareUrl}
                </a>
                <Button type="button" size="sm" variant="secondary" onClick={copyShareUrl}>
                  Copy
                </Button>
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </header>

        <div className="grid grid-cols-2 gap-2 rounded-2xl border bg-card/70 p-1 md:hidden">
          <Button
            type="button"
            variant={activePane === "editor" ? "default" : "ghost"}
            className="rounded-xl"
            onClick={() => setActivePane("editor")}
          >
            Editor
          </Button>
          <Button
            type="button"
            variant={activePane === "preview" ? "default" : "ghost"}
            className="rounded-xl"
            onClick={() => setActivePane("preview")}
          >
            Preview
          </Button>
        </div>

        <div className="grid flex-1 gap-5 md:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
          <section
            className={
              activePane === "preview"
                ? "hidden md:flex md:min-h-0 md:flex-col"
                : "flex min-h-0 flex-col"
            }
          >
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <label className="text-sm font-semibold" htmlFor="paste-content">
                  Source
                </label>
                <p className="text-xs text-muted-foreground">Auto-detect updates after typing.</p>
              </div>
              <form.Field name="language">
                {(field) => (
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => {
                      const next = value as PasteLanguage;
                      field.handleChange(next);
                      setLanguage(next);
                    }}
                  >
                    <SelectTrigger className="h-11 w-full rounded-2xl bg-card/80 sm:w-52">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {PasteLanguages.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </form.Field>
            </div>

            <form.Field name="content">
              {(field) => (
                <textarea
                  id="paste-content"
                  value={field.state.value}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                    setContent(event.target.value);
                  }}
                  className="min-h-[62dvh] flex-1 resize-none rounded-3xl border border-border/80 bg-card/90 p-5 font-mono text-sm leading-7 shadow-sm outline-none ring-offset-background transition focus:border-primary/70 focus:ring-4 focus:ring-primary/15"
                  placeholder="Paste code, Markdown, JSON, shell commands, or notes..."
                  spellCheck={false}
                />
              )}
            </form.Field>
          </section>

          <section
            className={
              activePane === "editor"
                ? "hidden md:flex md:min-h-0 md:flex-col"
                : "flex min-h-0 flex-col"
            }
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Preview</h2>
                <p className="text-xs text-muted-foreground">
                  Rendering as <span className="text-foreground">{previewLanguage}</span>
                </p>
              </div>
              <span className="rounded-xl border bg-card/80 px-3 py-1.5 text-xs text-muted-foreground">
                {content.length.toLocaleString()} chars
              </span>
            </div>
            <div className="min-h-[62dvh] flex-1 overflow-auto rounded-3xl border border-border/80 bg-card/85 p-4 shadow-sm backdrop-blur">
              <PastePreview content={content} language={previewLanguage} />
            </div>
          </section>
        </div>
      </form>
    </main>
  );
}
