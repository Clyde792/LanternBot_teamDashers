import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LanternMark } from '@/components/lantern-mark';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.hero}>
          <LanternMark />
          <ThemedView style={styles.titleBlock}>
            <ThemedText type="title" style={styles.title}>
              Lantern
            </ThemedText>
            <ThemedText style={styles.tagline} themeColor="textSecondary">
              A light for the young people you support.
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    paddingTop: Platform.select({ web: Spacing.six }) ?? 0,
    maxWidth: MaxContentWidth,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
  },
  titleBlock: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    textAlign: 'center',
  },
  tagline: {
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
    maxWidth: 320,
  },
});
