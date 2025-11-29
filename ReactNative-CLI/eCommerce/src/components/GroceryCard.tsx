import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GroceryItem } from '../data/groceries';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { getImageSource } from '../utils/imageAssets';

type GroceryCardProps = {
  item: GroceryItem;
  onAddToCart: (item: GroceryItem) => void;
};

export function GroceryCard({ item, onAddToCart }: GroceryCardProps) {
  const imageSource = getImageSource(item.image);
  
  return (
    <View style={styles.card}>
      <View style={styles.hero}>
        {imageSource ? (
          <Image source={imageSource} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <>
            <Text style={styles.heroInitials}>{item.name.charAt(0)}</Text>
            <Text style={styles.heroHint}>Image not found</Text>
          </>
        )}
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.category}>{item.category}</Text>
        <View style={styles.tagsRow}>
          {item.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.price}>
          ${item.price.toFixed(2)}
          <Text style={styles.unit}> / {item.unit}</Text>
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.addButton}
          onPress={() => onAddToCart(item)}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  hero: {
    height: 120,
    borderRadius: spacing.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroInitials: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.surface,
    opacity: 0.75,
  },
  heroHint: {
    color: colors.surface,
    fontSize: 12,
    marginTop: spacing.xs,
    opacity: 0.6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    color: colors.mutedText,
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.lg,
    backgroundColor: colors.background,
  },
  tagText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.mutedText,
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  unit: {
    fontSize: 14,
    color: colors.mutedText,
    fontWeight: '400',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: '700',
  },
});

