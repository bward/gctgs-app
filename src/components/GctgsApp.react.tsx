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
  Alert,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  StyleSheet,
  Navigator,
  BackAndroid
} from 'react-native';
import { GctgsWebClient } from '../GctgsWebClient';
import { NavigationView } from './NavigationView.react';
import { BoardGameList } from './BoardGameList/BoardGameList.react';
import { BoardGameDetails } from './BoardGameDetails.react';
import { User } from '../models/User';
import { BoardGame } from '../models/BoardGame';

const CookieManager = require('react-native-cookies');
const FCM = require('react-native-fcm');

interface GctgsAppState {
  user: User | null;
  client: GctgsWebClient | null;
}

export class GctgsApp extends React.Component<{}, GctgsAppState> {
  private navigator: React.NavigatorStatic;
  private drawerOpen: boolean;
  private boardGameList: BoardGameList;

  public constructor() {
    super();
    this.state = {user: null, client: null};
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
    this.tryLogInFromStorage();
    this.initBackButton();
  }

  private tryLogInFromStorage() {
    AsyncStorage.getItem('user')
      .then((value: string) => {
        let user: User = JSON.parse(value);
        if (user != null)
          this.logIn(user);
        else
          Linking.addEventListener('url', this.authenticationHandler.bind(this));
      })
  }

  private authenticationHandler(event: {url: string}) {
    let userData = decodeURIComponent(event.url.substr(event.url.indexOf("=") + 1));
    AsyncStorage.setItem('user', userData);
    this.logIn(JSON.parse(userData));
  }

  private logIn(user: User) {
    this.setState({user, client:  new GctgsWebClient(user)}, this.initFirebase.bind(this));
  }

  private initFirebase() {
    FCM.getFCMToken()
      .then((token: string) => {
      (this.state.client as GctgsWebClient).putFCMToken(token);
    });

    FCM.on('notification', (notification: {requester: string, boardGame: string}) => {
      if (notification.requester && notification.boardGame) {
        let requester = JSON.parse(notification.requester);
        let boardGame = JSON.parse(notification.boardGame);
        Alert.alert(
          'Board Game Request',
          requester.Name + ' would like to play ' + boardGame.Name,
          [{ text: 'OK' }]
        )
      }
    });
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
            client = {this.state.client as GctgsWebClient}
            logOut = {this.logOut.bind(this)}
            navigator = {navigator}
            ref = {(boardGameList: any) => this.boardGameList = boardGameList}/>
        );
      case 'boardGameDetails':
        return (
          <BoardGameDetails
            boardGame = {(route.passProps as any).boardGame} 
            navigator = {navigator}
            client = {(route.passProps as any).client} />
        );
    }
  }

  private logOut() {
    CookieManager.clearAll((err: any, res: any) => {
      this.setState({user: null, client: null});
    });
  }
}

const styles = StyleSheet.create({
  toolbar: {
    height: 56,
    backgroundColor:
    "#4CAF50",
    elevation: 4} as React.ViewStyle,
});