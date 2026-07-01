# Paste Preview Product Brief

## Goal

Build a paste preview web app.

First milestone only:

- left side: editable source/code area,
- right side: live preview,
- Markdown renders as formatted HTML,
- non-Markdown renders as syntax-highlighted code.

Long-term direction:

- paste any language,
- auto-detect language,
- allow manual language selection,
- generate share link,
- public link shows preview-only page,
- shared content expires after 1 week.

## UX shape

### Editor page `/`

Two-pane layout:

```txt
┌──────────────────────────────┬──────────────────────────────┐
│ Source                       │ Preview                      │
│ language select              │ rendered markdown/code       │
│ textarea / editor            │                              │
└──────────────────────────────┴──────────────────────────────┘
```

Core controls:

- language dropdown: `auto`, `markdown`, `typescript`, `javascript`, `json`, `html`, `css`, `bash`, `text`, etc.
- save/share button,
- copy link button after save.

### Preview route `/p/$pasteId`

Preview-only route. No editor. No source side by default.

For Markdown:

- render Markdown body,
- sanitize HTML,
- support GitHub-flavored Markdown.

For code:

- show highlighted code block,
- keep whitespace,
- show language label.

## Storage policy

Shared paste link lives 7 days.

Use Cloudflare KV expiration TTL:

```txt
expirationTtl = 604800 seconds
```

After expiry, `/p/$pasteId` shows expired/not found state.

## Privacy boundary

No auth for first version.

Treat all shared pastes as public to anyone with link.

Do not store secrets intentionally. UI should state: “Links are public and expire after 7 days.”

## Non-goals for first milestone

- no collaboration,
- no accounts,
- no private paste ACL,
- no comments,
- no edit-after-share,
- no database migrations,
- no analytics.
