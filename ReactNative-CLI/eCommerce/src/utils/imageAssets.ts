/**
 * Image Assets Mapping
 * 
 * Maps image path strings to their corresponding require() statements.
 * React Native requires static require() calls for images, so we maintain
 * a mapping here to allow dynamic image resolution from path strings.
 */

// Grocery item images
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

/**
 * Get image source by path string
 * @param imagePath - The image path string from grocery data
 * @returns Image source for React Native Image component, or undefined if not found
 */
export function getImageSource(imagePath: string): number | undefined {
  return groceryImages[imagePath as keyof typeof groceryImages];
}

/**
 * Get hero image source
 * @returns Hero image source for React Native Image component
 */
export function getHeroImageSource(): number {
  return heroImage;
}
