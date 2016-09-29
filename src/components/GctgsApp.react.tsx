/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import * as React from 'react';
import {
  WebView,
  Linking,
  AsyncStorage,
  View,
  Text,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  StyleSheet,
  Navigator,
  BackAndroid
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
  private navigator: React.NavigatorStatic;
  private drawerOpen: boolean;
  private boardGameList: BoardGameList;

  public constructor() {
    super();
    this.state = {user: null, client: new GctgsWebClient()};
  }

  public render() {   
    return (
      <Navigator
        initialRoute = {{id: 'boardGameList'}}
        renderScene = {(route, navigator) => this.renderNavigatorScene(route, navigator) as React.ReactElement<React.ViewProperties>}
        ref = {(navigator: any) => this.navigator = navigator}
      />
    );
  }

  public componentDidMount() {
    this.logIn();
    this.initBackButton();
  }

  private logIn() {
    AsyncStorage.getItem('user')
      .then((value: string) => {
        this.setState({user: JSON.parse(value)} as GctgsAppState);
      })
    Linking.addEventListener('url', this.authenticationHandler.bind(this));
  }

  private initBackButton() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.boardGameList.drawerOpen) {
        this.boardGameList.closeDrawer();
        return true;
      }
      if (this.navigator.getCurrentRoutes().length > 1) {
        this.navigator.pop();
        return true;
      }
      return false;
    });
  }

  private renderNavigatorScene(route: React.Route, navigator: Navigator): React.ReactElement<React.ViewProperties> | undefined {
    this.navigator
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

    switch (route.id) {
      case 'boardGameList':
        return (
          <BoardGameList
            user = {this.state.user}
            client = {this.state.client}
            logOut = {this.logOut.bind(this)}
            navigator = {navigator}
            ref = {(boardGameList: any) => this.boardGameList = boardGameList}/>
        );
      case 'boardGameDetails':
        return (
          <Text>Deets</Text>
        )
    }
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