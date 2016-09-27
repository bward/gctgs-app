import * as React from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet
} from 'react-native';
import { BoardGame } from '../models/BoardGame';

interface BoardGameListRowProps {
  boardGame: BoardGame;
}

export class BoardGameListRow extends React.Component<BoardGameListRowProps, {}> {
  public render() {
    return (
      <View style = {styles.container} >
        <Image style = {styles.image} source = {{uri: 'http:' + this.props.boardGame.bggDetails.thumbnailUrl}} />
        <View>
          <Text style={styles.name}>{ this.props.boardGame.name }</Text>
          <Text>{this.props.boardGame.owner.name} @ {this.props.boardGame.location}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  } as React.ViewStyle,
  
  image: {
    height: 75,
    width: 75,
    marginRight: 10
  } as React.ImageStyle,

  name: {
    fontWeight: 'bold',
    color: '#333333',
  } as React.TextStyle
})