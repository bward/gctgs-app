import * as React from 'react';
import {
  View,
  Text,
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
        <Text onPress = {this.props.onLogOut}>Log out</Text>
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
  } as React.ViewStyle,

  name: {
    fontFamily: 'sans-serif-medium'
  } as React.TextStyle
})