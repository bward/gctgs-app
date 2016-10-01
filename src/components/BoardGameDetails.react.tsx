import * as React from 'react';
import {
  View,
  Text,
  Image,
  WebView,
  Alert,
  ActivityIndicator,
  ToolbarAndroid,
  TouchableNativeFeedback,
  StyleSheet
} from 'react-native';
import { GctgsWebClient } from '../GctgsWebClient';
import { BoardGame } from '../models/BoardGame';

interface BoardGameDetailsProps {
  boardGame: BoardGame;
  navigator: React.NavigatorStatic;
  client: GctgsWebClient;
}

interface BoardGameDetailsState {
  loading: boolean;
}

export class BoardGameDetails extends React.Component<BoardGameDetailsProps, BoardGameDetailsState> {

  public constructor() {
    super();
    this.state = { loading: false };
  }

  public render() {
    return (
      <View style={{ flex: 1 }}>
        <ToolbarAndroid
          title="Board Game Details"
          titleColor="#ffffff"
          navIcon={{ uri: 'ic_arrow_back_black_48dp', isStatic: true }}
          onIconClicked={() => this.props.navigator.pop()}
          style={styles.toolbar} />
        <View style={styles.container}>
          <View style={styles.detail}>
            <Image
              source={{ uri: 'http:' + this.props.boardGame.bggDetails.thumbnailUrl }}
              style={styles.thumbnail}
              resizeMode='contain'
              />
            <Text style={styles.name}>{this.props.boardGame.name}</Text>
            <Text>{this.props.boardGame.owner.name}— {this.props.boardGame.location}</Text>
            <Text>{this.props.boardGame.bggDetails.rating}/10</Text>
          </View>
          <WebView
            style={styles.description}
            source={{ html: this.props.boardGame.bggDetails.description }} />
          <View style={styles.detail}>
            {!this.state.loading
              ? <TouchableNativeFeedback
                onPress={this.request.bind(this)}
                background={TouchableNativeFeedback.SelectableBackground()}
                delayPressIn={0}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>REQUEST</Text>
                </View>
              </TouchableNativeFeedback>
              : <View style={styles.loading}>
                  <ActivityIndicator />
                </View>
              }
          </View>
        </View>
      </View>
    );
  }

  private request() {
    this.setState({ loading: true });
    this.props.client.requestBoardGame(this.props.boardGame)
      .then((response: Response) => {
        if (response.status == 200) {
          Alert.alert(
            'Success',
            'Hooray! Email request sent successfully',
            [
              { text: 'OK' }
            ]
          )
        }
        else {
          Alert.alert(
            'Error',
            'Something went wrong...',
            [
              { text: 'OK' }
            ]
          )
        }
        this.setState({ loading: false });
      })
  }
}

const styles = StyleSheet.create({
  toolbar: {
    height: 56,
    backgroundColor: "#4CAF50",
    elevation: 4
  } as React.ViewStyle,

  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#FAFAFA'
  } as React.ViewStyle,

  detail: {
    alignItems: 'center'
  } as React.ViewStyle,

  name: {
    fontFamily: 'sans-serif-medium',
    fontSize: 16,
    color: '#000000',
    opacity: 0.87
  } as React.TextStyle,

  thumbnail: {
    width: 150,
    height: 150,
    marginBottom: 8,
  } as React.ImageStyle,

  description: {
    marginVertical: 12
  } as React.ViewStyle,

  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 2,
    height: 36,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginHorizontal: 8,
    marginVertical: 6,
    elevation: 2
  } as React.ViewStyle,

  buttonText: {
    color: '#ffffff',
    fontFamily: 'sans-serif-medium',
    fontSize: 14
  } as React.TextStyle,

  loading: {
    height: 36,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center'
  } as React.ViewStyle
});