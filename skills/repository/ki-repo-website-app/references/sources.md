# Sources

**Refresh:** external-spec · monthly

| ID | Source | Relevance | Last reviewed |
|---|---|---|---|
| VITE | <https://vite.dev/guide/> | React templates, `index.html`, and `vite`/`vite build` lifecycle | 2026-10-04 |
| VITE-OUT | <https://vite.dev/config/build-options.html#build-outdir> | Default `dist` output | 2026-10-04 |
| REACT | <https://react.dev/learn/creating-a-react-app> | Client-only React applications and framework/build-tool selection | 2026-10-04 |

## Last review

Reviewed 2026-10-04; all three sources were reachable and no standard change was needed. Vite (now major version 8, bundling with Rolldown) still treats a root `index.html` as the entry, scaffolds `react` and `react-ts` templates with `vite` and `vite build` scripts, and defaults `build.outDir` to `dist`. React still names Vite as a from-scratch build tool for a client-only application alongside framework options. The purpose boundary and the core-owned site-root contract hold. Previously reviewed 2026-08-14, when the interactive app implementation was separated from the content-site standard.
