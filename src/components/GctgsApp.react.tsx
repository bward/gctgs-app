/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import * as React from 'react';
import {
  AppRegistry,
  WebView,
  Linking,
  AsyncStorage,
  View,
  Text,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  StyleSheet
} from 'react-native';
import { GctgsWebClient } from '../GctgsWebClient';
import { NavigationView } from './NavigationView.react';
import { BoardGameList } from './BoardGameList/BoardGameList.react';
import { User } from '../models/User';

const CookieManager = require('react-native-cookies');

interface GctgsAppState {
  user: User | null;
  client: GctgsWebClient;
}

export class GctgsApp extends React.Component<{}, GctgsAppState> {

  public constructor() {
    super();
    this.state = {user: null, client: new GctgsWebClient()};
  }

  public render() {
    if (this.state.user == null)
      return (
        <View style={{flex: 1}}>
          <ToolbarAndroid
                      title="Log In With Raven"
                      titleColor="#ffffff"
                      style={styles.toolbar} />
          <WebView source={{uri: 'https://gctgs.ben-ward.net/api/authenticate'}} />
        </View>
      );
    else {
      return (
        <DrawerLayoutAndroid
          drawerWidth = {304}
          drawerPosition = {DrawerLayoutAndroid.positions.Left}
          renderNavigationView = {() => <NavigationView
                                          user = {this.state.user as User}
                                          onLogOut = {this.logOut.bind(this)} />}
          ref = {'DRAWER_REF'}>
          <ToolbarAndroid
            title = "GCTGS"
            titleColor = "#ffffff"
            navIcon= {{ uri: 'ic_menu_black_24dp', isStatic: true }}
            onIconClicked={() => (this.refs['DRAWER_REF'] as any).openDrawer()}
            style = {styles.toolbar} />
          <BoardGameList
            user = { this.state.user }
            client = { this.state.client} />
        </DrawerLayoutAndroid>
      );
    }
      
  }

  public componentWillMount() {
    AsyncStorage.getItem('user')
      .then((value: string) => {
        this.setState({user: JSON.parse(value)} as GctgsAppState);
      })
    Linking.addEventListener('url', this.authenticationHandler.bind(this));
  }

  private authenticationHandler(event: {url: string}) {
    let userData = decodeURIComponent(event.url.substr(event.url.indexOf("=") + 1));
    AsyncStorage.setItem('user', userData)
    this.setState({user: JSON.parse(userData) as User} as GctgsAppState);
  }

  private logOut() {
    CookieManager.clearAll((err: any, res: any) => {
      this.setState({user: null} as GctgsAppState);
    });
  }
}

const styles = StyleSheet.create({
  toolbar: {
    height: 56,
    backgroundColor:
    "#009900",
    elevation: 4} as React.ViewStyle,
});