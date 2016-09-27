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
  AsyncStorage
} from 'react-native';
import { BoardGameList } from './BoardGameList.react'
import { User } from './models/User';

interface GctgsAppState {
  user: User | null;
}

export class GctgsApp extends React.Component<{}, GctgsAppState> {

  public constructor() {
    super();
    this.state = {user: null};
  }

  public render() {
    if (this.state.user == null)
      return (
        <WebView source={{ uri: 'https://gctgs.ben-ward.net/api/authenticate' }} />
      );
    else
      return (<BoardGameList user = { this.state.user } />);
  }

  public componentWillMount() {
    AsyncStorage.getItem('user')
      .then((value: string) => {
        this.setState({user: JSON.parse(value)});
      })
    Linking.addEventListener('url', this.authenticationHandler.bind(this));
  }

  private authenticationHandler(event: {url: string}) {
    let userData = decodeURIComponent(event.url.substr(event.url.indexOf("=") + 1));
    AsyncStorage.setItem('user', userData)
    this.setState({user: JSON.parse(userData) as User})
  }
}