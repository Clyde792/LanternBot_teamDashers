import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Brand } from '@/constants/theme';

type LanternMarkProps = {
  /** Diameter of the mark in px. Defaults to 132. */
  size?: number;
};

/**
 * The Lantern brand mark: a warm light glowing in the dark.
 * A soft amber glow gently breathes around a luminous core, evoking a
 * lantern shining in the night. Purely decorative — hidden from
 * screen readers (the screen title carries the name).
 */
export function LanternMark({ size = 132 }: LanternMarkProps) {
  const glow = useSharedValue(0.55);

  useEffect(() => {
    glow.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [glow]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + glow.value * 0.45,
    transform: [{ scale: 0.92 + glow.value * 0.12 }],
  }));

  const core = size * 0.5;
  const highlight = size * 0.2;

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      aria-hidden>
      <Animated.View
        style={[
          styles.glow,
          { width: size, height: size, borderRadius: size / 2 },
          glowStyle,
        ]}
      />
      <View
        style={[
          styles.glowInner,
          { width: size * 0.74, height: size * 0.74, borderRadius: size },
        ]}
      />
      <View
        style={[
          styles.core,
          { width: core, height: core, borderRadius: core / 2 },
        ]}
      />
      <View
        style={[
          styles.highlight,
          {
            width: highlight,
            height: highlight,
            borderRadius: highlight / 2,
            top: core * 0.18,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    backgroundColor: Brand.glow,
  },
  glowInner: {
    position: 'absolute',
    backgroundColor: Brand.glow,
    opacity: 0.28,
  },
  core: {
    experimental_backgroundImage: `linear-gradient(180deg, ${Brand.glow}, ${Brand.glowDeep})`,
    backgroundColor: Brand.glow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlight: {
    position: 'absolute',
    backgroundColor: Brand.flame,
    opacity: 0.92,
  },
});
