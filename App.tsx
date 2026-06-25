import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AppsAirPush from 'appsairpush-react-native';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    AppsAirPush.sync({
      appId: 'sdktest-1781579110299',
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is base app for iOS | 25 Jun 07:40</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default App;
