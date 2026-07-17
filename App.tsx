import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AppsAirPush from 'appsairpush-react-native';

function App() {
  const [downloading, setDownloading] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);
  const animValue = useRef(new Animated.Value(0)).current;
  const listenerId = useRef<string | null>(null);

  useEffect(() => {
    // Keep displayPercent in sync with animated value (for the text)
    listenerId.current = animValue.addListener(({value}) => {
      setDisplayPercent(Math.round(value));
    });
    return () => {
      if (listenerId.current) {
        animValue.removeListener(listenerId.current);
      }
    };
  }, [animValue]);

  useEffect(() => {
    let modalShownAt = 0;

    AppsAirPush.sync({ appId: 'sdktest-1781579110299' }, download => {
      if (!modalShownAt) {
        modalShownAt = Date.now();
        setDownloading(true);
      }
      // Smoothly animate to the new progress value
      Animated.timing(animValue, {
        toValue: download.progress,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }).then(() => {
      // Ensure modal stays visible for at least 1.5s
      const elapsed = Date.now() - modalShownAt;
      const minDisplay = 1500;
      const remaining = Math.max(0, minDisplay - elapsed);

      // Animate to 100% if not already there
      Animated.timing(animValue, {
        toValue: 100,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();

      setTimeout(() => {
        setDownloading(false);
      }, remaining + 400);
    });
  }, []);

  // Animated width for the progress bar
  const barWidth = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AppContent />

      <Modal
        visible={downloading}
        transparent
        animationType="fade"
        statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Pulsing dot indicator */}
            <View style={styles.dotsRow}>
              <PulsingDot delay={0} />
              <PulsingDot delay={200} />
              <PulsingDot delay={400} />
            </View>

            <Text style={styles.modalTitle}>Updating</Text>
            <Text style={styles.modalSubtitle}>
              Downloading latest version…
            </Text>

            <Text style={styles.modalProgress}>{displayPercent}%</Text>

            <View style={styles.barTrack}>
              <Animated.View style={[styles.barFill, {width: barWidth}]} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
}

/** A single dot that pulses in/out with a staggered delay */
function PulsingDot({delay}: {delay: number}) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [delay, opacity, scale]);

  return (
    <Animated.View
      style={[styles.dot, {opacity, transform: [{scale}]}]}
    />
  );
}

function AppContent() {
  useSafeAreaInsets();
  return (
    <View style={styles.container}>
      {/* <Image source={require('./assets/logo.png')} style={styles.logo} /> */}
      <Text style={styles.text}>
        This is base app 3.0 android v1 | Prod AppsAirPush | 6 Jul 19:07
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
    borderRadius: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: 280,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  modalProgress: {
    fontSize: 40,
    fontWeight: '800',
    color: '#4F46E5',
    marginTop: 16,
  },
  barTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginTop: 20,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
});

export default App;
