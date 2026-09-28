# Sources

**Refresh:** external-spec · monthly

| ID | Source | Relevance | Last reviewed |
|---|---|---|---|
| VITE | <https://vite.dev/guide/> | React templates, `index.html`, and `vite`/`vite build` lifecycle | 2026-09-28 |
| VITE-OUT | <https://vite.dev/config/build-options.html#build-outdir> | Default `dist` output | 2026-09-28 |
| REACT | <https://react.dev/learn/creating-a-react-app> | Client-only React applications and framework/build-tool selection | 2026-09-28 |

## Last review

REFRESH last run **2026-09-28**. vite.dev and react.dev were unreachable from the refresh environment; template structure confirmed via GitHub. The core contract (index.html, src/main.jsx, vite build lifecycle) is unchanged.

- **Vite:** Latest release is **v8.3.1** (released 2026-09-24). The `create-vite` React template retains its standard `index.html` / `src/main.jsx` structure. vite.dev/guide was inaccessible; version bump from the prior review version noted — recheck guide on next accessible refresh for any lifecycle changes.
- **React:** react.dev inaccessible during this refresh. The template entry structure is consistent with prior state.
- **Open watch-item:** Vite is now at major version 8; re-confirm the `vite.dev/guide` lifecycle and `build-outdir` defaults are unchanged when the domain becomes accessible.
