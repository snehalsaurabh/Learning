export const groceryImages = {
  'assets/images/groceries/mango.png': require('../../assets/images/groceries/mango.png'),
  'assets/images/groceries/cabbage.png': require('../../assets/images/groceries/cabbage.png'),
  'assets/images/groceries/berries.png': require('../../assets/images/groceries/berries.png'),
  'assets/images/groceries/almond-milk.png': require('../../assets/images/groceries/almond-milk.png'),
  'assets/images/groceries/sourdough.png': require('../../assets/images/groceries/sourdough.png'),
  'assets/images/groceries/granola.png': require('../../assets/images/groceries/granola.png'),
} as const;

// Hero image
export const heroImage = require('../../assets/images/hero.png');

export function getImageSource(imagePath: string): number | undefined {
  return groceryImages[imagePath as keyof typeof groceryImages];
}

export function getHeroImageSource(): number {
  return heroImage;
}
