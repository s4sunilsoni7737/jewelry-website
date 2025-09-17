const {  ObjectId } = require('mongodb');

const products = [
  {
    name: "Diamond Engagement Ring",
    category: "rings",
    price: 2500,
    material: "gold",
    description: "Stunning 18k gold engagement ring featuring a brilliant 1-carat diamond center stone with intricate detailing.",
    specifications: {
      weight: "3.5g",
      size: "6-8 (adjustable)",
      metalPurity: "18k Gold",
      gemstone: "1ct Diamond"
    },
    featured: true,
    inStock: true,
    icon: "💍",
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7",
    owner: new ObjectId("688308407d30574f52400dcc") // kesarchand
  },
  {
    name: "Pearl Drop Necklace",
    category: "necklaces",
    price: 850,
    material: "silver",
    description: "Elegant freshwater pearl necklace with sterling silver chain, perfect for formal occasions.",
    specifications: {
      weight: "25g",
      length: "18 inches",
      metalPurity: "Sterling Silver",
      gemstone: "Freshwater Pearls"
    },
    featured: true,
    inStock: true,
    icon: "📿",
    image: "https://images.unsplash.com/photo-1611080626919-7ef0e64d9a1b",
    owner: new ObjectId("688308407d30574f52400dcc") // kesarchand
  },
  {
    name: "Sapphire Stud Earrings",
    category: "earrings",
    price: 1200,
    material: "platinum",
    description: "Beautiful blue sapphire stud earrings set in platinum with secure backing.",
    specifications: {
      weight: "2.1g",
      size: "6mm",
      metalPurity: "Platinum",
      gemstone: "Blue Sapphire"
    },
    featured: false,
    inStock: true,
    icon: "💎",
    image: "https://images.unsplash.com/photo-1611080566373-3f6c6f4d9c84",
    owner: new ObjectId("688308407d30574f52400dcd") // manish
  },
  {
    name: "Gold Chain Bracelet",
    category: "bracelets",
    price: 650,
    material: "gold",
    description: "Classic 14k gold chain bracelet with secure clasp, perfect for everyday wear.",
    specifications: {
      weight: "8.2g",
      length: "7.5 inches",
      metalPurity: "14k Gold",
      gemstone: "None"
    },
    featured: false,
    inStock: true,
    icon: "⛓️",
    image: "https://images.unsplash.com/photo-1611078489935-1fbe44770b27",
    owner: new ObjectId("688308407d30574f52400dcc") // kesarchand
  },
  {
    name: "Ruby Tennis Bracelet",
    category: "bracelets",
    price: 3200,
    material: "platinum",
    description: "Luxurious tennis bracelet featuring brilliant-cut rubies set in platinum.",
    specifications: {
      weight: "15.3g",
      length: "7 inches",
      metalPurity: "Platinum",
      gemstone: "Ruby"
    },
    featured: true,
    inStock: true,
    icon: "⛓️",
    image: "https://images.unsplash.com/photo-1604145559206-05c8844da510",
    owner: new ObjectId("688308407d30574f52400dcd") // manish
  },
  {
    name: "Luxury Swiss Watch",
    category: "watches",
    price: 5500,
    material: "gold",
    description: "Precision Swiss-made timepiece with 18k gold case and leather strap.",
    specifications: {
      weight: "120g",
      diameter: "40mm",
      metalPurity: "18k Gold",
      movement: "Swiss Automatic"
    },
    featured: true,
    inStock: true,
    icon: "⌚",
    image: "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e",
    owner: new ObjectId("688308407d30574f52400dcd") // manish
  },
  {
    name: "Emerald Pendant",
    category: "necklaces",
    price: 1800,
    material: "gold",
    description: "Stunning emerald pendant with 18k gold chain, perfect statement piece.",
    specifications: {
      weight: "12.5g",
      length: "20 inches",
      metalPurity: "18k Gold",
      gemstone: "Emerald"
    },
    featured: false,
    inStock: true,
    icon: "📿",
    image: "https://images.unsplash.com/photo-1603052875763-e906376b54f7",
    owner: new ObjectId("688308407d30574f52400dcc") // kesarchand
  },
  {
    name: "Diamond Hoop Earrings",
    category: "earrings",
    price: 980,
    material: "silver",
    description: "Sparkling diamond hoop earrings in sterling silver with secure hinged closure.",
    specifications: {
      weight: "3.8g",
      diameter: "20mm",
      metalPurity: "Sterling Silver",
      gemstone: "Diamond"
    },
    featured: false,
    inStock: true,
    icon: "💎",
    image: "https://images.unsplash.com/photo-1621926846141-99fa8c3f0a18",
    owner: new ObjectId("688308407d30574f52400dcd") // manish
  },
  {
    name: "Vintage Gold Ring",
    category: "rings",
    price: 1450,
    material: "gold",
    description: "Antique-inspired gold ring with intricate filigree work and vintage charm.",
    specifications: {
      weight: "4.2g",
      size: "5-9 (adjustable)",
      metalPurity: "14k Gold",
      gemstone: "None"
    },
    featured: false,
    inStock: true,
    icon: "💍",
    image: "https://images.unsplash.com/photo-1589987601331-e95072f8fcdd",
    owner: new ObjectId("688308407d30574f52400dcd") // manish
  },
  {
    name: "Silver Charm Bracelet",
    category: "bracelets",
    price: 320,
    material: "silver",
    description: "Delicate sterling silver charm bracelet with removable charms.",
    specifications: {
      weight: "18g",
      length: "8 inches",
      metalPurity: "Sterling Silver",
      gemstone: "None"
    },
    featured: false,
    inStock: true,
    icon: "⛓️",
    image: "https://images.unsplash.com/photo-1604503473273-fbcba8e6c92e",
    owner: new ObjectId("688308407d30574f52400dcc") // kesarchand
  },
  {
    name: "Platinum Wedding Band",
    category: "rings",
    price: 2200,
    material: "platinum",
    description: "Classic platinum wedding band with comfort fit and polished finish.",
    specifications: {
      weight: "6.8g",
      width: "4mm",
      metalPurity: "Platinum",
      gemstone: "None"
    },
    featured: true,
    inStock: true,
    icon: "💍",
    image: "https://images.unsplash.com/photo-1611581086853-3e9f1c832e6c",
    owner: new ObjectId("688308407d30574f52400dcd") // manish
  },
  {
    name: "Diamond Tennis Necklace",
    category: "necklaces",
    price: 4200,
    material: "diamond",
    description: "Spectacular diamond tennis necklace with brilliant-cut diamonds.",
    specifications: {
      weight: "35g",
      length: "16 inches",
      metalPurity: "18k White Gold",
      gemstone: "Diamond"
    },
    featured: true,
    inStock: true,
    icon: "📿",
    image: "https://images.unsplash.com/photo-1589987601702-e07a3e6b08f5",
    owner: new ObjectId("688308407d30574f52400dcc") // kesarchand
  }
];

module.exports = { products };
