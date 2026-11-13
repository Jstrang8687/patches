// ============================================================
//  PATCHES: site settings, shop links, and every piece.
//
//  The easy way to change this: the admin page at /admin/
//  (see README.md). It rewrites this file when you publish.
//
//  Editing by hand works too, but keep it valid JSON after the
//  "window.PATCHES =" line: "double quotes" around every name and
//  text, no comments inside, and no comma after the last item.
//
//  Fields on each piece in "works":
//    id          unique short name, no spaces
//    craft       "photography" or "woodworking"
//    category    filter group, e.g. "Wildlife", "Wands"
//    title, description
//    price       number in dollars (leave out to show "Inquire")
//    status      "available", "sold", or "commission"
//    featured    true to also show it on the home page
//    image       e.g. "images/photography/red-fox.jpg" ("" = coming soon tile)
//    details     list of short facts
//    link        this piece's own listing page ("" = the shop's main page)
//    shop        optional override: "prints", "etsy", or "custom"
//
//  shops:   each shop's name and main link ("" = not set up yet; buttons
//           fall back to the custom order form)
//  sellOn:  which shop each category or craft sells through
//  printFormats: ways a photo can be ordered; layout is
//           "single", "large", "triptych", or "set"
// ============================================================
window.PATCHES = {
  "config": {
    "siteName": "Patches",
    "email": "hello@example.com",
    "instagram": ""
  },
  "shops": {
    "prints": {
      "name": "Pixieset",
      "url": ""
    },
    "etsy": {
      "name": "Etsy",
      "url": ""
    }
  },
  "sellOn": {
    "photography": "prints",
    "Cutting Boards": "etsy",
    "Wands": "etsy",
    "Tables & Benches": "custom",
    "woodworking": "etsy"
  },
  "printFormats": [
    {
      "id": "print",
      "layout": "single",
      "name": "Classic Print",
      "sizes": "8×10 to 16×20 in",
      "from": 45,
      "blurb": "Archival paper print, signed. Ready for your own frame."
    },
    {
      "id": "large",
      "layout": "large",
      "name": "Large Statement Piece",
      "sizes": "24×36 to 40×60 in",
      "from": 250,
      "blurb": "Big canvas or metal print that anchors a whole wall."
    },
    {
      "id": "triptych",
      "layout": "triptych",
      "name": "3-Piece Split",
      "sizes": "3 panels, 36×24 to 72×36 in overall",
      "from": 300,
      "blurb": "One photo split across three panels, hung side by side."
    },
    {
      "id": "set",
      "layout": "set",
      "name": "Gallery Set of 3",
      "sizes": "3 matching prints, 11×14 or 16×20 in",
      "from": 150,
      "blurb": "Three related photos in the same size and finish."
    }
  ],
  "works": [
    {
      "id": "red-fox",
      "craft": "photography",
      "category": "Wildlife",
      "title": "Red Fox in Snow",
      "price": 85,
      "status": "available",
      "featured": true,
      "image": "",
      "description": "A red fox pausing mid-hunt in fresh snow.",
      "details": [
        "Signed archival print",
        "Available in every format below"
      ],
      "link": ""
    },
    {
      "id": "owl",
      "craft": "photography",
      "category": "Birds",
      "title": "Great Horned Owl",
      "price": 85,
      "status": "available",
      "featured": true,
      "image": "",
      "description": "Eye contact from a great horned owl at dusk.",
      "details": [
        "Signed archival print",
        "Popular as a 3-piece split"
      ],
      "link": ""
    },
    {
      "id": "buck",
      "craft": "photography",
      "category": "Wildlife",
      "title": "Whitetail at Dawn",
      "price": 95,
      "status": "available",
      "image": "",
      "description": "A whitetail buck in the first light of morning.",
      "details": [
        "Signed archival print"
      ],
      "link": ""
    },
    {
      "id": "heron",
      "craft": "photography",
      "category": "Birds",
      "title": "Heron on the Water",
      "price": 75,
      "status": "available",
      "image": "",
      "description": "A great blue heron standing still in shallow water.",
      "details": [
        "Signed archival print"
      ],
      "link": ""
    },
    {
      "id": "black-bear",
      "craft": "photography",
      "category": "Wildlife",
      "title": "Black Bear",
      "price": 95,
      "status": "sold",
      "image": "",
      "description": "A black bear crossing an open meadow.",
      "details": [
        "Original print sold; other formats available"
      ],
      "link": ""
    },
    {
      "id": "barn-cat",
      "craft": "photography",
      "category": "Farm & Pets",
      "title": "Barn Cat",
      "price": 65,
      "status": "available",
      "image": "",
      "description": "The barn's resident mouser, caught in a patch of sun.",
      "details": [
        "Signed archival print"
      ],
      "link": ""
    },
    {
      "id": "restaurant-tables",
      "craft": "woodworking",
      "category": "Tables & Benches",
      "title": "Restaurant Dining Tables",
      "status": "commission",
      "featured": true,
      "image": "",
      "description": "A full set of solid hardwood dining tables built for a local restaurant.",
      "details": [
        "Commissioned project",
        "Built to fit the dining room",
        "Commercial-grade finish"
      ],
      "link": ""
    },
    {
      "id": "restaurant-benches",
      "craft": "woodworking",
      "category": "Tables & Benches",
      "title": "Restaurant Bench Seating",
      "status": "commission",
      "image": "",
      "description": "Matching benches built alongside the dining tables.",
      "details": [
        "Commissioned project",
        "Solid hardwood"
      ],
      "link": ""
    },
    {
      "id": "walnut-board",
      "craft": "woodworking",
      "category": "Cutting Boards",
      "title": "Walnut End-Grain Cutting Board",
      "price": 180,
      "status": "available",
      "featured": true,
      "image": "",
      "description": "Heavy end-grain board in black walnut, finished with food-safe oil and beeswax.",
      "details": [
        "Black walnut",
        "18 × 12 × 1.75 in",
        "Rubber feet",
        "One of a kind"
      ],
      "link": ""
    },
    {
      "id": "maple-cherry-board",
      "craft": "woodworking",
      "category": "Cutting Boards",
      "title": "Maple & Cherry Edge-Grain Board",
      "price": 95,
      "status": "available",
      "image": "",
      "description": "Everyday board with alternating maple and cherry strips.",
      "details": [
        "Maple and cherry",
        "16 × 10 × 1 in",
        "Food-safe finish"
      ],
      "link": ""
    },
    {
      "id": "charcuterie",
      "craft": "woodworking",
      "category": "Cutting Boards",
      "title": "Charcuterie Serving Board",
      "price": 75,
      "status": "sold",
      "image": "",
      "description": "Long serving board with a carved handle.",
      "details": [
        "Walnut",
        "24 × 8 in"
      ],
      "link": ""
    },
    {
      "id": "wand-elder",
      "craft": "woodworking",
      "category": "Wands",
      "title": "Hand-Carved Wizard Wand",
      "price": 45,
      "status": "available",
      "featured": true,
      "image": "",
      "description": "Hand-carved and turned wand with a knotted handle.",
      "details": [
        "Hardwood",
        "About 14 in",
        "Gift box included"
      ],
      "link": ""
    },
    {
      "id": "wand-spiral",
      "craft": "woodworking",
      "category": "Wands",
      "title": "Spiral Wand",
      "price": 40,
      "status": "available",
      "image": "",
      "description": "Twisting spiral carved down the length of the shaft.",
      "details": [
        "Cherry",
        "About 13 in"
      ],
      "link": ""
    }
  ]
};
