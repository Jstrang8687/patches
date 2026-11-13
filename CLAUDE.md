# Patches site: notes for Claude

Portfolio and shop-links site for Patches (Jason's brother): wildlife/animal photography and woodworking (cutting boards, wands, restaurant tables and benches). Plain HTML/CSS/JS, no build step. Hosted on GitHub Pages from `main` at https://jstrang8687.github.io/patches/. **Every push to `main` goes live** in about a minute.

Jason often works from his phone and isn't a developer: explain in plain words, keep replies short, and say what changed on the live site.

## Where things are

- `js/works.js`: all content. Settings, shop links, sell-on rules, print formats, and every piece. After the `window.PATCHES =` line it must stay **valid JSON** (the admin page parses it with `JSON.parse`). Keep the comment header above that line.
- `js/main.js`: renders galleries (`[data-gallery]`), filters, popups, the custom-order form, and shop links from `works.js`.
- `admin/index.html`: browser admin page that edits `works.js` and uploads photos via the GitHub API (fine-grained token, one commit per publish). Pieces added there appear automatically in the right gallery grid.
- `images/photography/`, `images/woodworking/`: piece photos (JPG, ~2000px longest side).
- `brand/`: logo idea pages, not linked from the site. Chosen so far: rust "Sewn-On Patch" badge (header), Lens & Grain "JPS" bar brand (footer and favicon), Patchwork Fox mascot (About page).
- `README.md`: owner-facing instructions (admin sign-in, shop links, GoDaddy domain steps).

## Rules for changes

- Adding or editing a piece: edit the `works` array in `js/works.js`. New pieces go first among their craft. Fields: `id`, `craft` (`photography`/`woodworking`), `category`, `title`, `price` (number, omit for "Inquire"), `status` (`available`/`sold`/`commission`), `featured`, `image`, `description`, `details` (array), `link`, optional `shop` (`prints`/`etsy`/`custom`).
- Shop links live in `shops` (`prints`, `etsy`); an empty `url` makes buttons fall back to the custom order form. Routing is in `sellOn`.
- Validate before pushing: `node -e "const s=require('fs').readFileSync('js/works.js','utf8'); JSON.parse(s.match(/^window\.PATCHES\s*=\s*([\s\S]*);\s*$/m)[1]); console.log('ok')"`
- Don't use trademarked names in listings (e.g. say "wizard wand", not "Harry Potter wand").
- No random stock photos: pieces without a photo use `"image": ""`, which shows a "photo coming soon" tile.
- Preview locally with `python -m http.server 8080` in the repo root.
- After pushing, confirm the change is live (fetch the page or `js/works.js` from the live URL).
