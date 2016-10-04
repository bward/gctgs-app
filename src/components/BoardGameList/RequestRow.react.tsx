import * as React from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableNativeFeedback
} from 'react-native';
import { BoardGameRequest } from '../../models/BoardGameRequest';

interface RequestRowProps {
  request: BoardGameRequest;
}

export class RequestRow extends React.Component<RequestRowProps, {}> {
  public render() {
    return (
      <TouchableNativeFeedback
        background = {TouchableNativeFeedback.SelectableBackground()}
        delayPressIn={0}>
        <View style = {styles.container} >
          <Image style = {styles.image} source = {{uri: 'http:' + this.props.request.boardGame.bggDetails.thumbnailUrl}} />
          <View>
            <Text style = {styles.boardGameName} numberOfLines={1}>{ this.props.request.boardGame.name }</Text>
            <View style = {{flexDirection: 'row'}}>
              <Text style = {styles.ownerName}>{this.props.request.requester.name}</Text>
              <Text style = {styles.location}> — {(new Date(this.props.request.dateTime)).toLocaleDateString()}</Text>
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
    opacity: 0.87,
    flexWrap: 'wrap'
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