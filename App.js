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

import formatDate from './web-socket-server/formatDate';

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
  const [isConnecting, setIsConnecting] = React.useState(true);
  const [formattedDate, setFormattedDate] = React.useState(undefined);
  const [wsConnectionCount, setWsConnectionCount] = React.useState(0);
  const handleIncrementPress = React.useCallback(() => {
    if (isConnecting) {
      return;
    }
    setWsConnectionCount(wsConnectionCount + 1);
  }, [isConnecting, wsConnectionCount]);
  const handleMessage = React.useCallback(({ data }) => {
    try {
      const date = new Date(data);
      setTime(date);
    } catch (err) {
      console.warn('error data', { data });
    }
  }, []);

  React.useEffect(() => {
    if (!time) {
      return;
    }

    const intervalId = setInterval(() => {
      setFormattedDate(formatDate(time));
    }, 20);

    return clearInterval.bind(null, intervalId);
  }, [time]);

  React.useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setIsConnecting(true);
    ws.onopen = async () => {
      console.warn('open');
      setIsConnecting(false);
    };
    ws.onmessage = handleMessage;
    ws.onerror = err => {
      console.warn('onerror', { err });
      setIsConnecting(false);
    };

    ws.onclose = () => {
      console.warn('closed');
      setIsConnecting(false);
    };

    return ws.close.bind(ws);
  }, [handleMessage, wsConnectionCount]);
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
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Countdown</Text>
              <Text style={styles.sectionDescription} onPress={handleIncrementPress}>
                {formattedDate ??
                  (isConnecting
                    ? 'Connecting...'
                    : `Tap here to retry the connection [${wsConnectionCount}]`)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
