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
- Invitation UI lives in `src/components/invitation/`; content comes from `data.ts`, official graphics from `assets.ts` (CDN `.asset.json` pointers).
- The opening (`Landing.tsx`) runs every layer off one `JOURNEY` clock with marks in `M`; the closed-gate image only sizes the stage while the left/right leaves are shown from the start, so opening never swaps images.
