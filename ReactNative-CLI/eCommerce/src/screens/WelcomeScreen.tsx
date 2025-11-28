import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Fresh groceries{'\n'}delivered fast</Text>
          <Text style={styles.heroHint}>Add hero artwork at assets/images/hero.png</Text>
        </View>
        <View style={styles.copyBlock}>
          <Text style={styles.headline}>Shop mindful, eat well</Text>
          <Text style={styles.subhead}>
            Curated produce, dairy, pantry goods, and everyday essentials
            delivered to your door with zero fuss.
          </Text>
        </View>
        <PrimaryButton
          label="Get started"
          onPress={() => navigation.navigate('Auth')}
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
  container: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: spacing.xxl,
    padding: spacing.xxl,
    minHeight: 260,
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 40,
  },
  heroHint: {
    marginTop: spacing.lg,
    color: colors.surface,
    opacity: 0.7,
  },
  copyBlock: {
    gap: spacing.md,
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subhead: {
    fontSize: 16,
    color: colors.mutedText,
    lineHeight: 22,
  },
});

