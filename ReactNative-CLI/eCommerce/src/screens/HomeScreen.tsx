import React, { useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GroceryCard } from '../components/GroceryCard';
import { SearchBar } from '../components/SearchBar';
import { groceries, groceryCategories } from '../data/groceries';
import { useCart } from '../context/CartContext';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
const allCategories = ['All', ...groceryCategories];

export function HomeScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const { addToCart, totalItems, subtotal } = useCart();

  const filtered = useMemo(() => {
    return groceries.filter(item => {
      const matchesQuery =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        category === 'All' || item.category === category || item.tags.includes(category);
      return matchesQuery && matchesCategory;
    });
  }, [category, query]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Deliver to</Text>
          <Text style={styles.location}>221B Baker Street</Text>
        </View>
        <SearchBar value={query} onChangeText={setQuery} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}>
          {allCategories.map(item => {
            const selected = item === category;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setCategory(item)}
                style={[styles.categoryChip, selected && styles.categoryChipSelected]}>
                <Text
                  style={[styles.categoryText, selected && styles.categoryTextSelected]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <GroceryCard item={item} onAddToCart={addToCart} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.cartPill}
          onPress={() => navigation.navigate('Cart')}>
          <View style={styles.cartCount}>
            <Text style={styles.cartCountText}>{totalItems}</Text>
          </View>
          <Text style={styles.cartLabel}>View cart • ${subtotal.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  eyebrow: {
    textTransform: 'uppercase',
    fontSize: 12,
    color: colors.mutedText,
    letterSpacing: 1,
  },
  location: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  categoryRow: {
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  categoryChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    color: colors.text,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: colors.surface,
  },
  listContent: {
    paddingBottom: 140,
    gap: spacing.lg,
  },
  cartPill: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    bottom: spacing.xl,
    backgroundColor: colors.primaryDark,
    borderRadius: spacing.xxl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cartCount: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCountText: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  cartLabel: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});

