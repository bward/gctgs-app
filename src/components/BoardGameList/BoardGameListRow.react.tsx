import * as React from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableNativeFeedback
} from 'react-native';
import { BoardGame } from '../../models/BoardGame';

interface BoardGameListRowProps {
  boardGame: BoardGame;
  onPress: () => void;
}

export class BoardGameListRow extends React.Component<BoardGameListRowProps, {}> {
  public render() {
    return (
      <TouchableNativeFeedback
        background = {TouchableNativeFeedback.SelectableBackground()}
        onPress = {this.props.onPress}
        delayPressIn={0}>
        <View style = {styles.container} >
          <Image style = {styles.image} source = {{uri: 'http:' + this.props.boardGame.bggDetails.thumbnailUrl}} />
          <View>
            <Text style = {styles.boardGameName}>{ this.props.boardGame.name }</Text>
            <View style = {{flexDirection: 'row'}}>
              <Text style = {styles.ownerName}>{this.props.boardGame.owner.name}</Text>
              <Text style = {styles.location}> — {this.props.boardGame.location}</Text>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 72,
  } as React.ViewStyle,
  
  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 32,
  } as React.ImageStyle,

  boardGameName: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.87
  } as React.TextStyle,

  ownerName: {
    color: '#000000',
    opacity: 0.87
  } as React.TextStyle,

  location: {
    color: '#000000',
    opacity: 0.54
  } as React.TextStyle
})