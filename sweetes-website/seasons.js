/* =========================================================
   SWEET E'S SEASON SWITCH
   ---------------------------------------------------------
   To change the season, change the word in quotes below.
   Options: "christmas"  or  "everyday"
   Save the file and the site updates in a minute or two.
   ========================================================= */

const ACTIVE_SEASON = "christmas";

/* Where every "Order" button goes (the shop page on this site). */
const ORDER_URL = "menu.html";

/* Square items to leave off the website menu (exact names from Square). */
const HIDE_ITEMS = [
  "Little Debbie Cake",
  "Drizzled Pecan Brittle 10oz"
];


/* ---------------------------------------------------------
   Everything below is the content for each season.
   --------------------------------------------------------- */

const SEASONS = {

  christmas: {
    navLabel: "Christmas",
    squareCategory: "Christmas",          // Square category shown first in the shop
    shopTitle: "Christmas treats",
    colors: {
      paper:  "#fbf6ee",   // page background
      ink:    "#3d1a16",   // main text, dark chocolate
      accent: "#9e1b32",   // cranberry red, buttons
      deep:   "#1f4a34",   // pine green, banner + footer
      gold:   "#b8955a"    // thin gold lines
    },
    snow: true,
    storyImage: "images/christmas/ornament-round.jpg",   // photo next to "My story"

    banner: "Christmas orders are open. Everything is made to order and ready within 3 business days.",

    hero: {
      eyebrow: "Christmas at Sweet E's",
      titleItalic: "Chocolate for",
      title: "everyone on your list.",
      text: "Reindeer, ornaments, suckers and gift bags, all made by hand in my kitchen. Christmas sneaks up fast every year, so get your order in early.",
      button: "Order for Christmas",
      image: "images/christmas/rudolph.jpg",
      imageAlt: "Solid chocolate Rudolph with a red nose"
    },

    featured: {
      eyebrow: "New for the season",
      title: "My Christmas lineup",
      text: "Every piece comes in milk or dark chocolate. They fit right in the top of a stocking.",
      items: [
        { name: "Rudolph",              price: "$4.00",  note: "Solid chocolate with a red nose", image: "images/christmas/rudolph.jpg" },
        { name: "Christmas Tree Sucker", price: "$2.25", note: "1 oz chocolate sucker",           image: "images/christmas/tree-sucker.jpg" },
        { name: "Gingerbread Sucker",   price: "$2.25",  note: "1 oz chocolate sucker",           image: "images/christmas/gingerbread-sucker.jpg" },
        { name: "Present Sucker",       price: "$3.25",  note: "2 oz chocolate sucker",           image: "images/christmas/present-sucker.jpg" },
        { name: "Solid Ornament",       price: "$1.50",  note: "1 oz, round",                     image: "images/christmas/ornament-round.jpg" },
        { name: "Lump of Coal",         price: "$2.00",  note: "For the naughty list",            image: "images/christmas/lump-of-coal.jpg" },
        { name: "Merry Christmas Bar",  price: "$1.50",  note: "1 oz plaque",                     image: "images/christmas/plaque-merry-christmas.jpg" },
        { name: "Seasons Greetings Bar", price: "$2.00", note: "1.2 oz plaque",                   image: "images/christmas/plaque-seasons-greetings.jpg" }
      ]
    },

    giftSets: {
      eyebrow: "Little gifts, done",
      title: "Christmas gift bags and boxes",
      text: "For teachers, neighbors, coworkers and the mail carrier. I pack these by hand.",
      items: [
        { name: "Brittle Box",                price: "$33.00", note: "6 oz peanut brittle, 6 oz bare pecan brittle and 6 oz drizzled milk pecan brittle" },
        { name: "Paper Bag Gift Bag",         price: "$18.00", note: "Assorted. Vanilla wafers, a soft caramel gem, a puddle, a Nella, a pecan turtle and more" },
        { name: "Big Gift Box",               price: "$17.00", note: "Assorted. Cashew and pecan turtles, a puddle, a soft caramel gem, a Seasons Greetings bar and more" },
        { name: "Mini Red Snowflake Box",     price: "$12.00", note: "All dark. Maple leaf cream cookie, pecan turtle, Or-E-O, kissed cookie and a chocolate wafer" },
        { name: "Grinch Bag",                 price: "$12.00", note: "All milk. Graham, Or-E-O, kissed cookie, Rice Krispie and a Christmas tree cake" },
        { name: "Open Stocking",              price: "$10.00", note: "All milk. Kissed cookie, mini Krispie, 2 Or-E-Os and a gingerbread boy" },
        { name: "Small Fabric Gift Bag",      price: "$8.50",  note: "Assorted. A puddle, a Nella and a mini paddle" },
        { name: "Small Tote",                 price: "$5.75",  note: "A Merry Christmas bar, a Noel bar and 2 peppermint rods" }
      ]
    }
  },

  everyday: {
    squareCategory: "",
    shopTitle: "",
    colors: {
      paper:  "#fbf6ee",
      ink:    "#3d1a16",
      accent: "#6b2a24",
      deep:   "#3d1a16",
      gold:   "#b8955a"
    },
    snow: false,
    storyImage: "images/products/bare-pecan-brittle.jpg",

    banner: "Everything is made to order and ready within 3 business days. Free local pickup.",

    hero: {
      eyebrow: "Hand-crafted. Family recipe.",
      titleItalic: "Chocolate",
      title: "worth savoring.",
      text: "Real peanut butter, fresh nuts and rich caramel, dipped by hand in small batches in Waukesha.",
      button: "Start your order",
      image: "images/products/turtles.jpg",
      imageAlt: "Pecan turtles"
    },

    featured: null,
    giftSets: null
  }
};
