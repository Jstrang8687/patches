# Patches

A portfolio site for Patches: photography and woodworking. Each piece links to Etsy for checkout.

**Live site:** https://jstrang8687.github.io/patches/

Plain HTML, CSS and JavaScript. No build step, nothing to install.

```
index.html          Home page
photography.html    Photography gallery
woodworking.html    Woodworking gallery
about.html          About + contact
js/works.js         <-- settings and every piece for sale (edit this one)
js/main.js          Draws the galleries and the detail popup
css/style.css       Colors, fonts, layout
images/             Put real photos here
```

## Adding or changing a piece

1. Put the photo in `images/photography/` or `images/woodworking/`. JPGs about 1600px wide, under ~500 KB, load fast.
2. Open `js/works.js` and copy one of the existing `{ ... },` blocks.
3. Change the fields:
   - `id`: a short unique name, like `"walnut-board-2"`
   - `craft`: `"photography"` or `"woodworking"`
   - `price`: a number, e.g. `120` (delete the line to show "Inquire")
   - `status`: `"available"` or `"sold"`
   - `featured: true`: also shows the piece on the home page
   - `image`: e.g. `"images/woodworking/walnut-board-2.jpg"`
   - `etsy`: the piece's Etsy listing URL. If it's blank, the button goes to the main shop.
4. Delete the placeholder pieces once real ones are in.

Also update `config` at the top of `works.js`: the real email, the Etsy shop link, and Instagram if you have one.

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
