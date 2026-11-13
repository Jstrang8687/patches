# Patches

A portfolio site for Patches: photography and woodworking. Photos link to a print shop, boards and wands link to Etsy, and furniture goes through a custom order form.

**Live site:** https://jstrang8687.github.io/patches/

Plain HTML, CSS and JavaScript. No build step, nothing to install.

```
index.html          Home page
photography.html    Photography gallery
woodworking.html    Woodworking gallery
about.html          About + contact
custom.html         Custom order form
admin/              Admin page for adding artwork and changing settings
brand/              Logo ideas (not linked from the site)
js/works.js         Settings, shop links, and every piece (the admin page edits this)
js/main.js          Draws the galleries and the detail popup
css/style.css       Colors, fonts, layout
images/             Put real photos here
```

## Admin page (the easy way)

**https://jstrang8687.github.io/patches/admin/**

Add, edit, reorder, and delete artwork, upload photos, and change the email, shop links, where things sell, and print formats. It works on a phone too.

- **Photos** are resized automatically to 2000px on the longest side and saved as JPGs, so straight-from-the-camera files are fine.
- **New pieces** go first in their gallery. Use the ← → buttons to reorder.
- Nothing changes on the live site until you click **Publish to site**. Everything you changed goes up together, and the site updates about a minute later.
- If someone else published while you had the page open, publishing stops instead of overwriting their work. Reload the page and redo your change.

### Signing in

The admin page needs a GitHub access key (a "fine-grained token") that can change this repository:

1. Sign in to GitHub and open https://github.com/settings/personal-access-tokens/new
2. Name it `Patches admin`, and pick an expiration.
3. **Repository access:** Only select repositories → `patches`.
4. **Repository permissions → Contents:** Read and write. Nothing else is needed.
5. Generate it, then paste it into the admin page.

The key is saved only in that browser. Click **Sign out** on shared computers. When the key expires, make a new one the same way.

**For your brother:** add him to the repo first (**Settings → Collaborators → Add people**). Then he creates his own key from his GitHub account and selects the `patches` repo. Each person having their own key means you can turn off one without affecting the other.

## Editing by hand

Everything the admin page does is also in `js/works.js`, which you can edit directly. Keep it valid JSON after the `window.PATCHES =` line: "double quotes" around every name and text, and no comma after the last item in a list.

1. Put the photo in `images/photography/` or `images/woodworking/`. JPGs about 1600px wide, under ~500 KB, load fast.
2. Open `js/works.js` and copy one of the existing `{ ... },` blocks.
3. Change the fields:
   - `id`: a short unique name, like `"walnut-board-2"`
   - `craft`: `"photography"` or `"woodworking"`
   - `category`: the filter group, e.g. `"Wildlife"`, `"Cutting Boards"`, `"Wands"`, `"Tables & Benches"`
   - `price`: a number, e.g. `120` (delete the line to show "Inquire")
   - `status`: `"available"`, `"sold"`, or `"commission"` (past work made for a client)
   - `featured: true`: also shows the piece on the home page
   - `image`: e.g. `"images/woodworking/walnut-board-2.jpg"`
   - `link`: this piece's own listing page (its Etsy listing, its Pixieset photo...). If it's blank, the button goes to the shop's main page.
4. Delete the placeholder pieces once real ones are in.

Also update `config` in `works.js` with the real email, and Instagram if you have one.

## Where things are sold

Each kind of piece has its own buy button, set in `works.js`:

| Piece | Sold through | Button |
|---|---|---|
| Photos | `shops.prints` (Pixieset, SmugMug...) | "Buy on Pixieset" |
| Cutting boards, wands | `shops.etsy` | "Buy on Etsy" |
| Tables & benches | custom order form | "Request a quote" |

**When a shop is ready**, paste its main link in **Admin → Settings → Shops**, or edit `shops` in `works.js`:

```json
"shops": {
  "prints": { "name": "Pixieset", "url": "https://patches.pixieset.com/" },
  "etsy": { "name": "Etsy", "url": "https://www.etsy.com/shop/PatchesStudio" }
},
```

Until a shop has a `url`, its buttons say **"Inquire to buy"** and open the custom order form for that piece, and its footer link stays hidden. Nothing ever points to a dead page.

- Using SmugMug instead of Pixieset? Just change `name: "Pixieset"` to `name: "SmugMug"`.
- Want to sell a category somewhere else? Change it in **Admin → Settings → Where each kind of piece sells** (or its line in `sellOn`, e.g. `"Wands": "custom"`).
- One piece sold somewhere different? Set **Sell through** when editing that piece (or add `"shop": "etsy"` to it).

The About page text is in `about.html`, and the home page headline is in `index.html`.

## Previewing on your computer

```bash
python -m http.server 8080
```

Then open http://localhost:8080.

## Publishing with GitHub Pages

GitHub Pages is already turned on for this repo, serving the `main` branch from the root folder. Every push to `main` updates the live site within a minute or two.

## Using your GoDaddy domain (once you buy one)

1. In the GitHub repo, go to **Settings → Pages → Custom domain**, enter the domain (e.g. `www.yourdomain.com`), and save. GitHub adds a `CNAME` file to the repo.
2. In GoDaddy, open **My Products → the domain → DNS**, and add these records:
   - **CNAME**: name `www`, value `jstrang8687.github.io`
   - **A** records for name `@`, one for each of these four values: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Remove any existing `@` A record that points to GoDaddy "parking" or forwarding.
3. Wait for DNS to update. This can take from a few minutes to a few hours. Then go back to **Settings → Pages** and tick **Enforce HTTPS**.
