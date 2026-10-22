// ============================================================
//  PATCHES: site settings and the list of pieces for sale.
//  This is the only file you need to edit to add, change, or
//  mark work as sold. See README.md for step-by-step help.
// ============================================================

window.PATCHES = {
  config: {
    siteName: "Patches",
    email: "hello@example.com",                 // TODO: real contact email
    etsyShop: "https://www.etsy.com/shop/YOURSHOP", // TODO: real Etsy shop link
    instagram: "",                               // optional, e.g. "https://instagram.com/patches"
  },

  // Each piece:
  //   id          unique short name, no spaces
  //   craft       "photography" or "woodworking"
  //   title       name of the piece
  //   price       number in dollars (leave out to show "Inquire")
  //   status      "available" or "sold"
  //   featured    true to show it on the home page
  //   image       path to the photo, e.g. "images/photography/lake.jpg"
  //   description a sentence or two
  //   details     list of short facts (size, material, print type...)
  //   etsy        link to this piece's Etsy listing
  works: [
    // ---------- Photography (placeholders) ----------
    {
      id: "morning-fog", craft: "photography", title: "Morning Fog",
      price: 85, status: "available", featured: true,
      image: "https://picsum.photos/seed/patches-fog/1200/900",
      description: "Low fog lifting off the water just after sunrise.",
      details: ["Archival matte print", "12 × 16 in", "Signed, limited run of 25"],
      etsy: "",
    },
    {
      id: "old-barn", craft: "photography", title: "Old Barn, Late Light",
      price: 120, status: "available",
      image: "https://picsum.photos/seed/patches-barn/1200/1500",
      description: "Last light on weathered boards, shot on a back road in October.",
      details: ["Lustre print", "16 × 20 in", "Ships rolled in a tube"],
      etsy: "",
    },
    {
      id: "river-stones", craft: "photography", title: "River Stones",
      price: 65, status: "sold",
      image: "https://picsum.photos/seed/patches-stones/1200/800",
      description: "Smooth stones under clear, moving water.",
      details: ["Archival matte print", "8 × 12 in"],
      etsy: "",
    },
    {
      id: "pines", craft: "photography", title: "Pines in Snow",
      price: 95, status: "available",
      image: "https://picsum.photos/seed/patches-pines/1200/1200",
      description: "A quiet stand of pines after the first heavy snow.",
      details: ["Metal print", "12 × 12 in", "Ready to hang"],
      etsy: "",
    },
    {
      id: "city-rain", craft: "photography", title: "City Rain",
      price: 75, status: "available",
      image: "https://picsum.photos/seed/patches-rain/1200/900",
      description: "Streetlights reflected on wet pavement.",
      details: ["Archival matte print", "11 × 14 in"],
      etsy: "",
    },
    {
      id: "wildflowers", craft: "photography", title: "Wildflowers",
      price: 70, status: "available",
      image: "https://picsum.photos/seed/patches-flowers/1200/1500",
      description: "A summer field, close to the ground.",
      details: ["Lustre print", "11 × 14 in"],
      etsy: "",
    },

    // ---------- Woodworking (placeholders) ----------
    {
      id: "walnut-board", craft: "woodworking", title: "Walnut End-Grain Cutting Board",
      price: 180, status: "available", featured: true,
      image: "https://picsum.photos/seed/patches-walnut/1200/900",
      description: "Heavy end-grain board in black walnut, finished with food-safe oil and beeswax.",
      details: ["Black walnut", "18 × 12 × 1.75 in", "Rubber feet", "One of a kind"],
      etsy: "",
    },
    {
      id: "maple-bowl", craft: "woodworking", title: "Turned Maple Bowl",
      price: 140, status: "available", featured: true,
      image: "https://picsum.photos/seed/patches-bowl/1200/1200",
      description: "Hand-turned from a single piece of spalted maple.",
      details: ["Spalted maple", "10 in diameter", "Decorative use"],
      etsy: "",
    },
    {
      id: "oak-shelf", craft: "woodworking", title: "Floating Oak Shelf",
      price: 95, status: "available",
      image: "https://picsum.photos/seed/patches-shelf/1200/800",
      description: "Clean, simple shelf with hidden mounting hardware.",
      details: ["White oak", "36 × 8 in", "Hardware included"],
      etsy: "",
    },
    {
      id: "cherry-box", craft: "woodworking", title: "Cherry Keepsake Box",
      price: 110, status: "sold",
      image: "https://picsum.photos/seed/patches-box/1200/1200",
      description: "Small box with hand-cut dovetails and a fitted lid.",
      details: ["Cherry and maple", "8 × 5 × 4 in"],
      etsy: "",
    },
    {
      id: "side-table", craft: "woodworking", title: "Live-Edge Side Table",
      price: 450, status: "available",
      image: "https://picsum.photos/seed/patches-table/1200/1500",
      description: "Live-edge slab top on a minimal steel base.",
      details: ["Ash slab, steel base", "22 × 16 × 24 in", "Local pickup or freight"],
      etsy: "",
    },
    {
      id: "coasters", craft: "woodworking", title: "Mixed Hardwood Coasters (Set of 4)",
      price: 40, status: "available",
      image: "https://picsum.photos/seed/patches-coasters/1200/900",
      description: "Offcuts from bigger projects, given a second life.",
      details: ["Walnut, maple, cherry", "4 in square", "Sealed for moisture"],
      etsy: "",
    },
  ],
};
