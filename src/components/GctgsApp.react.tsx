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
  ToolbarAndroid
} from 'react-native';
import { GctgsWebClient } from '../GctgsWebClient';
import { BoardGameList } from './BoardGameList/BoardGameList.react';
import { User } from '../models/User';

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
    console.log(this.state);
    if (this.state.user == null)
      return (
        <View style={{flex: 1}}>
          <ToolbarAndroid
                      title="Log In With Raven"
                      titleColor="#ffffff"
                      style={{height: 56, backgroundColor: "#009900"}} />
          <WebView source={{uri: 'https://gctgs.ben-ward.net/api/authenticate'}} />
        </View>
      );
    else {
      console.log('rendering', this.state.user.name)
      return (<BoardGameList user = { this.state.user }
                             client = { this.state.client} />);
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
    this.setState({user: JSON.parse(userData) as User} as GctgsAppState)
  }
}