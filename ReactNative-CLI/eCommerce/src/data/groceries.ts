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
    id: 'avocado-hass',
    name: 'Hass Avocado',
    description: 'Creamy & ripe, perfect for toast or salads',
    price: 2.49,
    unit: 'each',
    category: 'Fruits',
    tags: ['Popular', 'Vegan'],
    image: 'assets/images/groceries/avocado.png',
  },
  {
    id: 'kale-bunch',
    name: 'Organic Kale',
    description: 'Crisp leaves great for smoothies & sautés',
    price: 3.99,
    unit: 'bunch',
    category: 'Vegetables',
    tags: ['Popular', 'New'],
    image: 'assets/images/groceries/kale.png',
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
    id: 'granola-honey',
    name: 'Honey Granola',
    description: 'Crunchy oat clusters with almonds',
    price: 7.5,
    unit: '14 oz',
    category: 'Pantry',
    tags: ['New'],
    image: 'assets/images/groceries/granola.png',
  },
];

