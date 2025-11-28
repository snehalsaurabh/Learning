import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type PrimaryButtonProps = {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}: PrimaryButtonProps) {
  const isSecondary = variant === 'secondary';
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.button,
        isSecondary && styles.secondary,
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.primary : colors.surface} />
      ) : (
        <Text style={[styles.label, isSecondary && styles.secondaryLabel]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.4,
  },
  secondary: {
    backgroundColor: colors.primaryLight,
  },
  secondaryLabel: {
    color: colors.primaryDark,
  },
  disabled: {
    opacity: 0.5,
  },
});

