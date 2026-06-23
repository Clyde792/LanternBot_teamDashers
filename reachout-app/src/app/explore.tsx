import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SupportScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">How Lantern works</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            A quick guide to supporting young people through Lantern.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.sectionsWrapper}>
          <ThemedView
            style={[styles.crisisCard, { backgroundColor: theme.tintSoft }]}>
            <ThemedText type="smallBold">When a youth is in crisis</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Lantern alerts you the moment Buddy detects a young person may be
              at risk — with reminders, and a phone call if it&apos;s urgent. If
              someone is in immediate danger, call SOS at 1800-221-4444 (24/7)
              and follow your SCS escalation steps.
            </ThemedText>
          </ThemedView>

          <Collapsible title="How the bot works">
            <ThemedText type="small">
              After hours, Buddy keeps young people company on Telegram and
              passes everything back to you. It never tries to counsel or fix
              things itself — its job is to listen and make sure a real worker
              follows up.
            </ThemedText>
          </Collapsible>

          <Collapsible title="Overnight summaries">
            <ThemedText type="small">
              Each conversation is summarised with the key points and a read on
              risk, so you can catch up quickly at the start of your shift.
            </ThemedText>
          </Collapsible>

          <Collapsible title="Replying to a youth">
            <ThemedText type="small">
              You can send a reply straight to a young person on Telegram from
              Lantern, in your own words, whenever you&apos;re ready to step in.
            </ThemedText>
          </Collapsible>

          <Collapsible title="Handover & notes">
            <ThemedText type="small">
              Hand a young person over to another worker along with notes, so
              context carries across shifts and nothing slips through.
            </ThemedText>
          </Collapsible>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: 'center',
    maxWidth: 420,
  },
  sectionsWrapper: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  crisisCard: {
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.three,
  },
});
