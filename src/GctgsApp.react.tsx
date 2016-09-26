/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import * as React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

class GctgsApp extends React.Component<{}, {}> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native, GCTGS!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  } as React.ViewStyle,
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  } as React.TextStyle,
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  } as React.TextStyle,
});

export default GctgsApp;