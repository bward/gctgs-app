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
        <View style = {styles.titleContainer}><Text>{this.props.title}</Text></View>
        {this.props.title != '#' ? <View style = {styles.separator} /> : null}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    paddingLeft: 16,
  } as React.ViewStyle,
  
  titleContainer: {
    flex: 88,
  } as React.ViewStyle,

  text: {
  } as React.TextStyle,

  separator: {
    flex: 344,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#000000',
    opacity: .18,
  } as React.ViewStyle
});