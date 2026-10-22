// ============================================================
//  PATCHES: site settings and the list of pieces.
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

  // Ways a photo can be ordered. Shown on the Photography page and in
  // each photo's popup. "layout" picks the little diagram:
  //   "single", "large", "triptych" (one photo split across 3 panels),
  //   or "set" (3 different photos hung together).
  printFormats: [
    { id: "print", layout: "single", name: "Classic Print",
      sizes: "8×10 to 16×20 in", from: 45,
      blurb: "Archival paper print, signed. Ready for your own frame." },
    { id: "large", layout: "large", name: "Large Statement Piece",
      sizes: "24×36 to 40×60 in", from: 250,
      blurb: "Big canvas or metal print that anchors a whole wall." },
    { id: "triptych", layout: "triptych", name: "3-Piece Split",
      sizes: "3 panels, 36×24 to 72×36 in overall", from: 300,
      blurb: "One photo split across three panels, hung side by side." },
    { id: "set", layout: "set", name: "Gallery Set of 3",
      sizes: "3 matching prints, 11×14 or 16×20 in", from: 150,
      blurb: "Three related photos in the same size and finish." },
  ],

  // Each piece:
  //   id          unique short name, no spaces
  //   craft       "photography" or "woodworking"
  //   category    group used for the filter buttons, e.g. "Wildlife", "Wands"
  //   title       name of the piece
  //   price       number in dollars (leave out to show "Inquire")
  //   status      "available", "sold", or "commission" (made for a client,
  //               shown as past work with a "Request something similar" button)
  //   featured    true to show it on the home page
  //   image       path to the photo, e.g. "images/photography/fox.jpg"
  //               (leave "" to show a "photo coming soon" tile)
  //   description a sentence or two
  //   details     list of short facts (size, material, print type...)
  //   etsy        link to this piece's Etsy listing
  works: [
    // ---------- Photography: animals (placeholders) ----------
    {
      id: "red-fox", craft: "photography", category: "Wildlife", title: "Red Fox in Snow",
      price: 85, status: "available", featured: true, image: "",
      description: "A red fox pausing mid-hunt in fresh snow.",
      details: ["Signed archival print", "Available in every format below"],
      etsy: "",
    },
    {
      id: "owl", craft: "photography", category: "Birds", title: "Great Horned Owl",
      price: 85, status: "available", featured: true, image: "",
      description: "Eye contact from a great horned owl at dusk.",
      details: ["Signed archival print", "Popular as a 3-piece split"],
      etsy: "",
    },
    {
      id: "buck", craft: "photography", category: "Wildlife", title: "Whitetail at Dawn",
      price: 95, status: "available", image: "",
      description: "A whitetail buck in the first light of morning.",
      details: ["Signed archival print"],
      etsy: "",
    },
    {
      id: "heron", craft: "photography", category: "Birds", title: "Heron on the Water",
      price: 75, status: "available", image: "",
      description: "A great blue heron standing still in shallow water.",
      details: ["Signed archival print"],
      etsy: "",
    },
    {
      id: "black-bear", craft: "photography", category: "Wildlife", title: "Black Bear",
      price: 95, status: "sold", image: "",
      description: "A black bear crossing an open meadow.",
      details: ["Original print sold; other formats available"],
      etsy: "",
    },
    {
      id: "barn-cat", craft: "photography", category: "Farm & Pets", title: "Barn Cat",
      price: 65, status: "available", image: "",
      description: "The barn's resident mouser, caught in a patch of sun.",
      details: ["Signed archival print"],
      etsy: "",
    },

    // ---------- Woodworking (placeholders) ----------
    {
      id: "restaurant-tables", craft: "woodworking", category: "Tables & Benches",
      title: "Restaurant Dining Tables", status: "commission", featured: true, image: "",
      description: "A full set of solid hardwood dining tables built for a local restaurant.",
      details: ["Commissioned project", "Built to fit the dining room", "Commercial-grade finish"],
      etsy: "",
    },
    {
      id: "restaurant-benches", craft: "woodworking", category: "Tables & Benches",
      title: "Restaurant Bench Seating", status: "commission", image: "",
      description: "Matching benches built alongside the dining tables.",
      details: ["Commissioned project", "Solid hardwood"],
      etsy: "",
    },
    {
      id: "walnut-board", craft: "woodworking", category: "Cutting Boards",
      title: "Walnut End-Grain Cutting Board", price: 180, status: "available", featured: true, image: "",
      description: "Heavy end-grain board in black walnut, finished with food-safe oil and beeswax.",
      details: ["Black walnut", "18 × 12 × 1.75 in", "Rubber feet", "One of a kind"],
      etsy: "",
    },
    {
      id: "maple-cherry-board", craft: "woodworking", category: "Cutting Boards",
      title: "Maple & Cherry Edge-Grain Board", price: 95, status: "available", image: "",
      description: "Everyday board with alternating maple and cherry strips.",
      details: ["Maple and cherry", "16 × 10 × 1 in", "Food-safe finish"],
      etsy: "",
    },
    {
      id: "charcuterie", craft: "woodworking", category: "Cutting Boards",
      title: "Charcuterie Serving Board", price: 75, status: "sold", image: "",
      description: "Long serving board with a carved handle.",
      details: ["Walnut", "24 × 8 in"],
      etsy: "",
    },
    {
      id: "wand-elder", craft: "woodworking", category: "Wands",
      title: "Hand-Carved Wizard Wand", price: 45, status: "available", featured: true, image: "",
      description: "Hand-carved and turned wand with a knotted handle.",
      details: ["Hardwood", "About 14 in", "Gift box included"],
      etsy: "",
    },
    {
      id: "wand-spiral", craft: "woodworking", category: "Wands",
      title: "Spiral Wand", price: 40, status: "available", image: "",
      description: "Twisting spiral carved down the length of the shaft.",
      details: ["Cherry", "About 13 in"],
      etsy: "",
    },
  ],
};
