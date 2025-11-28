import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { useCart } from '../context/CartContext';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export function CartScreen({ navigation }: Props) {
  const { items, increment, decrement, remove, subtotal } = useCart();
  const deliveryFee = items.length ? 4.5 : 0;
  const total = subtotal + deliveryFee;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.headline}>Your cart</Text>
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Cart is empty</Text>
              <Text style={styles.emptyCopy}>
                Add a few tasty items from the home screen.
              </Text>
              <PrimaryButton
                label="Browse groceries"
                variant="secondary"
                onPress={() => navigation.navigate('Home')}
              />
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowCopy}>
                <Text style={styles.rowName}>{item.name}</Text>
                <Text style={styles.rowMeta}>
                  ${item.price.toFixed(2)} • {item.unit}
                </Text>
              </View>
              <View style={styles.quantityGroup}>
                <TouchableOpacity
                  onPress={() => decrement(item.id)}
                  style={styles.qtyButton}>
                  <Text style={styles.qtyButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => increment(item.id)}
                  style={styles.qtyButton}>
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => remove(item.id)}>
                <Text style={styles.remove}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
        {items.length ? (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <PrimaryButton
              label="Checkout"
              onPress={() => navigation.navigate('Checkout')}
            />
          </View>
        ) : null}
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
    padding: spacing.xl,
    gap: spacing.lg,
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  listContent: {
    gap: spacing.md,
  },
  row: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowCopy: {
    gap: spacing.xs,
  },
  rowName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  rowMeta: {
    color: colors.mutedText,
  },
  quantityGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  qtyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  qtyValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  remove: {
    color: colors.danger,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.xxl,
    padding: spacing.xl,
    gap: spacing.lg,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: colors.mutedText,
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  emptyCopy: {
    color: colors.mutedText,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});

