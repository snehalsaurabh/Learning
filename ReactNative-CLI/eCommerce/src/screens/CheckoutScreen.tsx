import React, { useState } from 'react';
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
import { PrimaryButton } from '../components/PrimaryButton';
import { useCart } from '../context/CartContext';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

type PaymentMethod = 'credit' | 'debit' | 'upi';

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'credit', label: 'Credit Card' },
  { value: 'debit', label: 'Debit Card' },
  { value: 'upi', label: 'UPI' },
];

export function CheckoutScreen({ navigation }: Props) {
  const { items, subtotal, clear } = useCart();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const deliveryFee = items.length ? 4.5 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (selectedPayment) {
      clear();
      navigation.navigate('Home');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.headline}>Checkout</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <Text style={styles.addressText}>Sada Colony, Madhya Pradesh, India</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <FlatList
              data={items}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.orderItem}>
                  <View style={styles.orderItemInfo}>
                    <Text style={styles.orderItemName}>{item.name}</Text>
                    <Text style={styles.orderItemMeta}>
                      {item.quantity} × ${item.price.toFixed(2)}
                    </Text>
                  </View>
                  <Text style={styles.orderItemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              )}
            />
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentCard}>
            {paymentMethods.map(method => {
              const isSelected = selectedPayment === method.value;
              return (
                <TouchableOpacity
                  key={method.value}
                  style={[styles.paymentOption, isSelected && styles.paymentOptionSelected]}
                  onPress={() => setSelectedPayment(method.value)}>
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text
                      style={[
                        styles.paymentLabel,
                        isSelected && styles.paymentLabelSelected,
                      ]}>
                      {method.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Place Order"
          onPress={handlePlaceOrder}
          disabled={!selectedPayment}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    gap: spacing.xl,
    paddingBottom: 100,
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  addressCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  orderItemInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  orderItemMeta: {
    fontSize: 14,
    color: colors.mutedText,
  },
  orderItemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.mutedText,
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
  paymentCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  paymentOption: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paymentOptionSelected: {
    backgroundColor: colors.primaryLight,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  paymentLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  paymentLabelSelected: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

