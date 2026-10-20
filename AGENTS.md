<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Invitation UI lives in `src/components/wedding/`; all names, dates, venues, banks and wishes come from `data.ts` so copy changes never touch layout code.
- The entry gate (`PalaceGate.tsx`) is driven by the single `T` timeline object and `DOOR` percentages measured on the gate artwork; door leaves are cut from the same image, so regenerate frame + doors together if the artwork changes.
- Large decorative images ship as optimized local `.webp` imports; original user media stays as `.asset.json` CDN pointers.
