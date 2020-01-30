/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import { Header, Colors } from 'react-native/Libraries/NewAppScreen';

import { format } from 'date-fns';

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
});

const App: () => React$Node = () => {
  const [time, setTime] = React.useState(undefined);
  const handleMessage = React.useCallback(({ data }) => {
    try {
      const date = new Date(data);
      setTime(date);
    } catch (err) {
      console.warn('error data', { data });
    }
  }, []);

  React.useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = async () => {
      console.warn('open');
    };
    ws.onmessage = handleMessage;
    ws.onerror = err => {
      console.warn('onerror', { err });
    };
    ws.onclose = () => {
      console.warn('closed');
    };

    return ws.close.bind(ws);
  }, [handleMessage]);
  return (
    <>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior='automatic'
          style={styles.scrollView}
        >
          <Header />
          <View style={styles.body}>
            {!!time && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Timer</Text>
                <Text style={styles.sectionDescription}>
                  {format(time, 'yyyy/MM/dd H:mm:ss.SSS') + ' '}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
