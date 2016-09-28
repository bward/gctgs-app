import * as React from 'react';
import {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  StyleSheet
} from 'react-native';
import { User } from '../models/User';

interface NavigationViewProps {
  user: User;
  onLogOut: () => void;
}

export class NavigationView extends React.Component<NavigationViewProps, {}> {
  public render() {
    return (
      <View>
        <View style={styles.subTitle}>
          <Text style={styles.name}>{this.props.user.name}</Text>
          <Text>{this.props.user.email}</Text>
        </View>
        <TouchableNativeFeedback
          onPress = {() => console.log('lol')}
          background = {TouchableNativeFeedback.SelectableBackground()}
          delayPressIn={0} >
          <View style = {styles.listItem}>
            <Image source = {{uri: 'logout'}} style={styles.itemIcon} />
            <Text style={styles.itemText}>Log out</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subTitle: {
    height: 56,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 16
  } as React.ViewStyle,

  name: {
    fontFamily: 'sans-serif-medium'
  } as React.TextStyle,

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    backgroundColor: '#ffffff',
    height: 48
  } as React.ViewStyle,

  itemIcon: {
    height: 24,
    width: 24,
    marginRight: 32
  } as React.ImageStyle,

  itemText: {
    fontFamily: 'sans-serif-medium',
    color: '#000000',
    opacity: 0.87
  } as React.TextStyle
})