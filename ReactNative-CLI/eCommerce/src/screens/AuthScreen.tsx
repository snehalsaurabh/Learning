import React, { useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export function AuthScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const isValid = useMemo(() => /\S+@\S+\.\S+/.test(email) && password.length >= 6, [
    email,
    password,
  ]);

  const handleContinue = async () => {
    if (!isValid) {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.copyBlock}>
          <Text style={styles.eyebrow}>Welcome back</Text>
          <Text style={styles.headline}>Sign in to continue</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.mutedText}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Minimum 6 characters"
            placeholderTextColor={colors.mutedText}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Text style={styles.helper}>
            This is a sample auth flow; credentials are only validated locally.
          </Text>
        </View>
        <PrimaryButton
          label="Continue"
          onPress={handleContinue}
          disabled={!isValid}
          loading={loading}
        />
      </KeyboardAvoidingView>
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
    gap: spacing.xxl,
  },
  copyBlock: {
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.mutedText,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
  },
  form: {
    gap: spacing.md,
  },
  label: {
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: spacing.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  helper: {
    fontSize: 13,
    color: colors.mutedText,
  },
});

