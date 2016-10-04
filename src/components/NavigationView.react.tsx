import * as React from 'react';
import {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  StyleSheet
} from 'react-native';
import { User } from '../models/User';

const Icon = require('react-native-vector-icons/MaterialIcons');

interface NavigationViewProps {
  user: User;
  drawer: React.DrawerLayoutAndroidStatic;
  onBoardGames: () => void;
  onLocations: () => void;
  onOwners: () => void;
  onRequests: () => void;
  onLogOut: () => void;
}

export class NavigationView extends React.Component<NavigationViewProps, {}> {
  public render() {
    return (
      <View>
          <Image source = {{uri: 'girton'}} style = {{marginBottom: 16}} >
            <View style = {styles.subTitle}>
            <Text style = {styles.name}>{this.props.user.name}</Text>
            <Text style = {styles.email}>{this.props.user.email}</Text>
            </View>
          </Image>
        {this.navigationItem('Board Games', 'view-list', this.props.onBoardGames)}
        {this.navigationItem('Locations', 'place', this.props.onLocations)}
        {this.navigationItem('Owners', 'people', this.props.onOwners)}
        <View style = {styles.divider} />
        {this.navigationItem('My Requests', 'question-answer', this.props.onRequests)}
        <View style = {styles.divider} />
        {this.navigationItem('Log out', 'exit-to-app', this.props.onLogOut)}
      </View>
    );
  }

  private navigationItem(text: string, iconName: string, onPress: () => void): JSX.Element {
    return (
      <TouchableNativeFeedback
          onPress = {onPress}
          background = {TouchableNativeFeedback.SelectableBackground()}
          delayPressIn = {0} >
          <View style = {styles.listItem}>
            <Icon name = {iconName} size = {24} />
            <Text style = {styles.itemText}>{text}</Text>
          </View>
        </TouchableNativeFeedback>
    )
  }
}

const styles = StyleSheet.create({
  subTitle: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 145
  } as React.ImageStyle,

  name: {
    fontFamily: 'sans-serif-medium',
    color: '#ffffff'
  } as React.TextStyle,

  email: {
    color: '#ffffff'
  } as React.TextStyle,

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    backgroundColor: '#ffffff',
    height: 48
  } as React.ViewStyle,

  itemIcon: {
    marginRight: 32
  },

  itemText: {
    fontFamily: 'sans-serif-medium',
    color: '#000000',
    opacity: 0.87,
    paddingLeft: 32
  } as React.TextStyle,

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#000000',
    opacity: .18,
    marginVertical: 8,
  } as React.ViewStyle
})