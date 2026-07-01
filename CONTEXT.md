# Paste Preview — Glossary

## Terms

### Paste

A user-created snippet of text (up to max size) stored with a language tag and expiration. One Paste maps to one KV entry.

### Paste ID

Short URL-safe identifier (nanoid) for a Paste. 4–64 chars. Generated server-side on creation.

### Paste Payload

The JSON blob stored in KV for one Paste: id, content, language, detectedLanguage, createdAt, expiresAt.

### Language Tag

The language a Paste is written in. Values: auto, markdown, typescript, javascript, json, html, css, bash, text. Manual selection overrides auto-detection.

### Shared Paste Link

A public URL at `/p/$pasteId`. Preview-only, no editor. Expires when KV TTL is reached (7 days).

### Editor Page

The `/` route. Two-pane layout: source/editor on the left, live preview on the right. Not persisted until user explicitly saves.

### Preview Page

The `/p/$pasteId` route. Read-only rendered view of a saved Paste.

### Effect Service Pattern

Use `Context.Service` class-style services. `effect@4.0.0-beta.92` does not export `ServiceMap`; current npm v4 beta exposes class-style services through `Context.Service`.

### Error Handling UX

KV failures show inline error banners near the failed action (save button for create, preview area for get). Editor content is never lost. No full-page error redirects.

### Deployment Domain

Production URL: `preview.ryuko.my.id`. Custom subdomain on existing domain `ryuko.my.id`. Set up via Cloudflare DNS CNAME to Workers.

### Post-Save Behavior

After successful save, editor stays live. Share link + copy button appear inline below the save button. Editor remains editable — user can tweak and re-save. Share link updates on each save.

### Editor Persistence

Editor content and language selection persist to localStorage, debounced ~500ms. Restore on page load. Clear after successful paste creation.

### Preview Page Display

Shared preview page shows a full metadata bar: language label, expiry countdown ("Expires in X days"), and a "View Source" toggle to see raw content. Content renders below the bar. Toggle swaps between rendered and raw view (no side-by-side). Site must be responsive and mobile-friendly.

### Editor Layout

Desktop: two-pane side-by-side (source left, preview right). Mobile (< 768px): tab switcher with "Editor" and "Preview" tabs, one visible at a time.

### Auto-Detect Language

When language is "auto", detected language appears after ~1s pause in typing (debounced). No live detection on every keystroke.

### Expiry Display

Preview metadata bar shows relative + exact: "Expires in 3 days (Jul 9, 2026)". When under 24h: "Expires in 12 hours". When under 1h: "Expires soon".
