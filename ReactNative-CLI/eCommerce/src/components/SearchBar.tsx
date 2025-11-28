import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: TextInputProps['onFocus'];
  onBlur?: TextInputProps['onBlur'];
  onFilterPress?: () => void;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search groceries',
  onFocus,
  onBlur,
  onFilterPress,
}: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        style={styles.input}
        onFocus={onFocus}
        onBlur={onBlur}
        inputMode="search"
        returnKeyType="search"
      />
      {onFilterPress ? (
        <TouchableOpacity
          onPress={onFilterPress}
          activeOpacity={0.8}
          style={styles.filterChip}>
          <Text style={styles.filterLabel}>Filter</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: spacing.xl,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  filterChip: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.lg,
  },
  filterLabel: {
    color: colors.surface,
    fontWeight: '600',
  },
});

