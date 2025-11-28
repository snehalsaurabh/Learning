export type GroceryItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  tags: string[];
  image: string;
};

export const groceryCategories = [
  'Popular',
  'Fruits',
  'Vegetables',
  'Dairy',
  'Bakery',
  'Pantry',
] as const;

export const groceries: GroceryItem[] = [
  {
    id: 'Mango',
    name: 'Alphonso Mango',
    description: 'Creamy & ripe, perfect for smoothies',
    price: 2.49,
    unit: 'each',
    category: 'Fruits',
    tags: ['Popular', 'Vegan'],
    image: 'assets/images/groceries/mango.png',
  },
  {
    id: 'Cabbage',
    name: 'Organic Cabbage',
    description: 'Crisp leaves great for smoothies and sandwiches',
    price: 3.99,
    unit: 'bunch',
    category: 'Vegetables',
    tags: ['Popular', 'New'],
    image: 'assets/images/groceries/cabbage.png',
  },
  {
    id: 'berries-mix',
    name: 'Berry Medley',
    description: 'Strawberries, blueberries & raspberries',
    price: 5.49,
    unit: '12 oz',
    category: 'Fruits',
    tags: ['Popular'],
    image: 'assets/images/groceries/berries.png',
  },
  {
    id: 'almond-milk',
    name: 'Almond Milk',
    description: 'Unsweetened, barista blend',
    price: 4.59,
    unit: '32 oz',
    category: 'Dairy',
    tags: ['Vegan'],
    image: 'assets/images/groceries/almond-milk.png',
  },
  {
    id: 'sourdough-loaf',
    name: 'Sourdough Loaf',
    description: 'Slow-fermented artisan bread',
    price: 6.25,
    unit: 'loaf',
    category: 'Bakery',
    tags: ['Popular'],
    image: 'assets/images/groceries/sourdough.png',
  },
  {
    id: 'Pantanjali Oats',
    name: 'Patanjali Oats',
    description: 'Crunchy oat clusters with almonds',
    price: 7.5,
    unit: '14 oz',
    category: 'Pantry',
    tags: ['New'],
    image: 'assets/images/groceries/granola.png',
  },
];

