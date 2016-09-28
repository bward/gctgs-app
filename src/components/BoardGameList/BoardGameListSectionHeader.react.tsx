import * as React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

interface BoardGameListSectionHeaderProps {
  title: string;
}

export class BoardGameListSectionHeader extends React.Component<BoardGameListSectionHeaderProps, {}> {
  public render() {
    return (
      <View style = {styles.container}>
        <Text>{this.props.title}</Text>
        <View style = {styles.separator} />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  } as React.ViewStyle,
  text: {
    flex: 1,
    marginRight: 20
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 360,
    backgroundColor: '#000000',
    opacity: .18,
  } as React.ViewStyle
});