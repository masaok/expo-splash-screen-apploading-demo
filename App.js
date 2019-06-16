import { AppLoading, SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Image, Text, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppNavigator from './navigation/AppNavigator';

// export default function App(props) {
export default class App extends React.Component {

  state = {
    isSplashReady: false,
    isAppReady: false,
    isLoadingComplete: false,
  };

  componentDidUpdate() {
    console.log("CDU")
  }

  render() {
    // const [isLoadingComplete, setLoadingComplete] = useState(false);
    const { isLoadingComplete } = this.state

    // https://docs.expo.io/versions/latest/sdk/splash-screen/#example-with-apploading
    if (!this.state.isSplashReady) {
      console.log("APP > SPLASH NOT READY > caching splash resources ...")
      return (
        <AppLoading
          startAsync={this._cacheSplashResourcesAsync}
          onFinish={() => this.setState({ isSplashReady: true })}
          onError={console.warn}
          autoHideSplash={false}
        />
      );
    }

    if (!this.state.isAppReady) {
      console.log("APP > APP NOT READY > caching other resources ...")
      return (
        <View style={{ flex: 1 }}>
          <Image
            source={require('./assets/images/splash-custom.png')}
            onLoad={this._cacheResourcesAsync}
          />
        </View>
      );
    } else {

      // The main tabs template
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      )
    }
  }

  _cacheSplashResourcesAsync = async () => {
    // async function _cacheSplashResourcesAsync() {
    console.log("APP > CACHE SPLASH RESOURCE ...")
    const gif = require('./assets/images/splash-custom.png');
    return Asset.fromModule(gif).downloadAsync()
  }

  _cacheResourcesAsync = async () => {
    // async function _cacheResourcesAsync() {
    SplashScreen.hide();
    const images = [
      require('./assets/images/icon.png'),
      require('./assets/images/icon.png'),
    ];

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });

    await Promise.all(cacheImages);
    await Promise.all([
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free to
        // remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ])
    this.setState({ isAppReady: true });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
