export type GameTopUpPrice = {
  amount: string
  price: number
}

export type GameTopUpPricing = {
  slug: string
  name: string
  product: string
  prices: GameTopUpPrice[]
}

export const gameTopUpPricing: GameTopUpPricing[] = [
  {
    slug: 'mobile-legends',
    name: 'Mobile Legends: Bang Bang',
    product: 'Diamonds',
    prices: [
      { amount: '86 Diamonds', price: 20000 },
      { amount: '172 Diamonds', price: 39000 },
      { amount: '257 Diamonds', price: 57000 },
      { amount: '344 Diamonds', price: 75000 },
      { amount: '706 Diamonds', price: 152000 },
    ],
  },
  {
    slug: 'free-fire',
    name: 'Free Fire',
    product: 'Diamonds',
    prices: [
      { amount: '70 Diamonds', price: 11000 },
      { amount: '140 Diamonds', price: 21000 },
      { amount: '355 Diamonds', price: 51000 },
      { amount: '720 Diamonds', price: 101000 },
      { amount: '1450 Diamonds', price: 202000 },
    ],
  },
  {
    slug: 'pubg-mobile',
    name: 'PUBG Mobile',
    product: 'UC',
    prices: [
      { amount: '60 UC', price: 17000 },
      { amount: '325 UC', price: 80000 },
      { amount: '660 UC', price: 159000 },
      { amount: '1800 UC', price: 399000 },
      { amount: '3850 UC', price: 799000 },
    ],
  },
  {
    slug: 'genshin-impact',
    name: 'Genshin Impact',
    product: 'Genesis Crystals',
    prices: [
      { amount: '60 Genesis Crystals', price: 16000 },
      { amount: '300 + 30 Genesis Crystals', price: 79000 },
      { amount: '980 + 110 Genesis Crystals', price: 239000 },
      { amount: '1980 + 260 Genesis Crystals', price: 479000 },
      { amount: 'Blessing of the Welkin Moon', price: 79000 },
    ],
  },
  {
    slug: 'valorant',
    name: 'Valorant',
    product: 'VP',
    prices: [
      { amount: '125 VP', price: 15000 },
      { amount: '420 VP', price: 48000 },
      { amount: '700 VP', price: 78000 },
      { amount: '1375 VP', price: 145000 },
      { amount: '2400 VP', price: 245000 },
    ],
  },
  {
    slug: 'honor-of-kings',
    name: 'Honor of Kings',
    product: 'Tokens',
    prices: [
      { amount: '80 Tokens', price: 16000 },
      { amount: '240 Tokens', price: 48000 },
      { amount: '400 Tokens', price: 78000 },
      { amount: '800 Tokens', price: 158000 },
      { amount: '1200 Tokens', price: 235000 },
    ],
  },
  {
    slug: 'call-of-duty-mobile',
    name: 'Call of Duty: Mobile',
    product: 'CP',
    prices: [
      { amount: '31 CP', price: 5000 },
      { amount: '62 CP', price: 10000 },
      { amount: '127 CP', price: 20000 },
      { amount: '320 CP', price: 50000 },
      { amount: '645 CP', price: 100000 },
    ],
  },
]
