/**
 * Centralized content configuration for the Kamadhenu Junnu landing page.
 *
 * All copy, labels, and editable business information live here so that
 * the brand owner can update text in one place without touching components.
 *
 * Items marked with "OWNER_CONFIRM" require verification from the business owner.
 */

// ──────────────────────────── Brand ────────────────────────────
export const brand = {
  name: 'KAMADHENU JUNNU',
  tagline: 'Traditional South Indian Colostrum Milk Dessert',
  shortDescription:
    'Inspired by the richness of Indian dairy heritage and the timeless tradition of Junnu.',
} as const;

// ──────────────────────────── Navigation ────────────────────────────
export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Our Story', href: '#our-story' },
  { label: 'Our Cow', href: '#our-cow' },
  { label: 'Milk Journey', href: '#milk-journey' },
  { label: 'Our Product', href: '#our-product' },
  { label: 'Preparation', href: '#preparation' },
  { label: 'Quality', href: '#quality' },
  { label: 'Contact', href: '#contact' },
] as const;

// ──────────────────────────── Hero ────────────────────────────
export const hero = {
  headline: ['ROOTED IN TRADITION.', 'CRAFTED WITH LOVE.'],
  supporting:
    'Discover the story of Kamadhenu Junnu — inspired by the richness of Indian dairy heritage and the timeless tradition of Junnu.',
  primaryCta: 'EXPLORE OUR STORY',
  secondaryCta: 'DISCOVER OUR PRODUCT',
} as const;

// ──────────────────────────── Our Story ────────────────────────────
export const ourStory = {
  heading: 'THE STORY BEHIND KAMADHENU',
  paragraphs: [
    "In the heart of India's dairy traditions lies a deep respect for the cow, for pure milk, and for the time-honoured recipes that have nourished generations. Kamadhenu Junnu is born from this reverence — a commitment to bringing an authentic traditional experience to every home.",
    'The name Kamadhenu is inspired by the sacred wish-fulfilling cow of Indian mythology, symbolising abundance, nourishment, and purity. Our mission is to honour that legacy by making the traditional Junnu preparation accessible and convenient, while staying true to its roots.',
    /* OWNER_CONFIRM: Add specific brand origin story once confirmed. */
  ],
} as const;

// ──────────────────────────── The Cow Story ────────────────────────────
export const cowStory = {
  heading: 'WHERE OUR STORY BEGINS',
  paragraphs: [
    'Every great dairy tradition begins with the cow. In rural India, the bond between the farmer and the cow is one of mutual respect, care, and daily devotion. The cow is not merely a source of milk — she is a part of the family.',
    'At Kamadhenu, we celebrate indigenous Indian cow breeds that have sustained dairy traditions for centuries. Raised in natural, open-farm environments, these cows graze on fresh pasture, producing rich, wholesome milk that forms the foundation of our Junnu powder.',
    /* OWNER_CONFIRM: Confirm specific breed details and farming practices. */
  ],
} as const;

// ──────────────────────────── Milk Journey ────────────────────────────
export const milkJourney = {
  heading: 'FROM FARM TO TRADITION',
  steps: [
    {
      number: 1,
      title: 'The Dairy Farm',
      description:
        'Our journey begins at traditional dairy farms where indigenous cows are raised with care in natural, open environments.',
    },
    {
      number: 2,
      title: 'Milk Sourcing',
      description:
        'Fresh milk is sourced directly from trusted farms, ensuring the highest quality colostrum milk for our product.',
    },
    {
      number: 3,
      title: 'Milk Collection',
      description:
        'Carefully collected using hygienic stainless steel containers, preserving the natural richness of the milk.',
    },
    {
      number: 4,
      title: 'Quality Checking',
      description:
        'Each batch undergoes quality checks to ensure it meets our standards before processing.',
      /* OWNER_CONFIRM: Detail specific quality processes once confirmed. */
    },
    {
      number: 5,
      title: 'Processing',
      description:
        'The colostrum milk is gently processed and transformed into a convenient powder form, retaining its traditional essence.',
    },
    {
      number: 6,
      title: 'Ready for You',
      description:
        'The finished Kamadhenu Junnu Powder is carefully packaged and made ready for you to bring the tradition home.',
    },
  ],
} as const;

// ──────────────────────────── Junnu Story ────────────────────────────
export const junnuStory = {
  heading: 'A TRADITIONAL TASTE WORTH DISCOVERING',
  paragraphs: [
    'Junnu — also known as Ginnu or Kharvas in different regions — is a beloved traditional South Indian dessert made from colostrum milk, the first milk produced by a cow after calving. Prized for its unique custard-like texture and naturally sweet flavour, Junnu has been a cherished part of Indian food culture for generations.',
    'Traditionally, families would prepare Junnu during the brief window when colostrum milk is available, making it a rare and celebratory treat. The process of steaming fresh colostrum with a touch of jaggery produces a delicate, set dessert that is unlike anything else in Indian cuisine.',
    'Kamadhenu Junnu Powder brings this experience within reach of every kitchen. By carefully processing colostrum milk into a convenient powder format, we make it possible to enjoy this traditional delicacy anytime, without waiting for a seasonal occasion.',
  ],
} as const;

// ──────────────────────────── Product ────────────────────────────
export const product = {
  heading: 'INTRODUCING KAMADHENU JUNNU',
  name: 'Kamadhenu Milk Junnu Powder',
  pack: '100g × 120pc = 1 bag',
  description:
    'Traditional South Indian Colostrum Milk Dessert. No Preservatives. High in Protein & Calcium.',
  /* NOTE: The description above is from the existing db.ts DEFAULT_PRODUCT.
     Do not expand or add claims without owner verification. */
  imageUrl: '/product-image.png',
  features: [
    'Traditional South Indian Colostrum Milk Dessert',
    'No Preservatives',
    'High in Protein & Calcium',
  ],
  cta: 'LOGIN TO ORDER',
} as const;

// ──────────────────────────── Preparation ────────────────────────────
export const preparation = {
  heading: 'BRING THE TRADITION TO YOUR HOME',
  note: 'Detailed preparation instructions will be updated with verified product-specific quantities and timings.',
  /* OWNER_CONFIRM: Replace placeholder steps with verified instructions. */
  steps: [
    {
      number: 1,
      title: 'Gather Ingredients',
      instruction:
        'You will need Kamadhenu Junnu Powder, water or milk, and jaggery or sugar to taste.',
      /* OWNER_CONFIRM: Specify exact quantities and ratios. */
    },
    {
      number: 2,
      title: 'Mix the Powder',
      instruction:
        'Dissolve the Junnu powder in the required amount of water or milk and stir until smooth.',
      /* OWNER_CONFIRM: Specify exact liquid quantity per 100g sachet. */
    },
    {
      number: 3,
      title: 'Add Sweetener',
      instruction:
        'Add jaggery or sugar to the mixture according to your taste preference.',
    },
    {
      number: 4,
      title: 'Steam to Set',
      instruction:
        'Pour the mixture into a greased vessel and steam until it sets into a firm, custard-like texture.',
      /* OWNER_CONFIRM: Specify steaming time and temperature. */
    },
    {
      number: 5,
      title: 'Cool & Serve',
      instruction:
        'Allow the Junnu to cool, then slice and serve. Enjoy the authentic traditional taste at home.',
    },
  ],
} as const;

// ──────────────────────────── Quality ────────────────────────────
export const quality = {
  heading: 'QUALITY DESERVES ATTENTION',
  items: [
    {
      title: 'Ingredient Information',
      description:
        'Made from carefully sourced colostrum milk powder. Full ingredient list available on product packaging.',
      /* OWNER_CONFIRM: Provide complete ingredient list. */
    },
    {
      title: 'Product Handling',
      description:
        'Processed and packaged under hygienic conditions to maintain product integrity.',
    },
    {
      title: 'Storage Instructions',
      description:
        'Store in a cool, dry place away from direct sunlight. Keep the packet sealed after opening.',
      /* OWNER_CONFIRM: Verify specific storage requirements and shelf life. */
    },
    {
      title: 'Packaging Information',
      description:
        'Each bag contains 120 individual 100g sachets, designed for convenient single-use preparation.',
    },
    {
      title: 'Customer Support',
      description:
        'For questions about our product, please contact our support team through the details provided below.',
    },
  ],
} as const;

// ──────────────────────────── Call to Action ────────────────────────────
export const callToAction = {
  heading: 'DISCOVER THE TRADITION OF KAMADHENU',
  supporting:
    'Explore our product and experience a traditional favourite inspired by Indian dairy heritage.',
  primaryCta: 'EXPLORE OUR PRODUCT',
  secondaryCta: 'LOGIN / ORDER',
} as const;

// ──────────────────────────── Proprietor / Contact ────────────────────────────
export const proprietor = {
  sectionTag: 'DIRECT INQUIRIES & SUPPORT',
  heading: 'PROPRIETOR & CONTACT INFORMATION',
  supporting:
    'For personal orders, bulk distribution, festive inquiries, or product information, connect directly with the proprietor of Kamadhenu Junnu.',
  name: 'Mahesh Pampa',
  title: 'Proprietor & Founder',
  phone: '8310328856',
  displayPhone: '+91 83103 28856',
  callUrl: 'tel:8310328856',
  whatsappUrl:
    'https://wa.me/918310328856?text=Hello%20Mahesh%20Pampa%20ji%2C%20I%20would%20like%20to%20inquire%20about%20Kamadhenu%20Junnu.',
  availability: 'Monday – Saturday: 9:00 AM – 7:00 PM IST',
  location: 'Andhra Pradesh & Telangana, India',
  features: [
    {
      title: 'Direct Personal Assistance',
      description:
        'Speak directly with the proprietor for order inquiries, customized packaging, or wholesale orders.',
    },
    {
      title: 'Quick WhatsApp Response',
      description:
        'Send a message anytime for swift product details, preparation advice, and delivery schedules.',
    },
    {
      title: 'Authentic Quality Assured',
      description:
        'Guaranteed genuine colostrum dairy heritage crafted with traditional hygiene and pure ingredients.',
    },
  ],
} as const;

// ──────────────────────────── Footer ────────────────────────────
export const footer = {
  brand: brand.name,
  description:
    'Inspired by the richness of Indian dairy heritage and the timeless tradition of Junnu. Bringing a traditional South Indian favourite to your home.',
  contact: {
    proprietor: 'Mahesh Pampa',
    phone: '+91 83103 28856',
    rawPhone: '8310328856',
    email: '',
    address: 'Andhra Pradesh & Telangana, India',
  },
  copyright: `© ${new Date().getFullYear()} Kamadhenu Junnu. All rights reserved.`,
} as const;

// ──────────────────────────── SEO ────────────────────────────
export const seo = {
  title: 'Kamadhenu Junnu | Traditional South Indian Junnu',
  description:
    'Discover Kamadhenu Junnu, a product inspired by traditional South Indian dairy heritage. Explore our product story, preparation and quality information.',
} as const;
