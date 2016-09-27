import * as React from 'react';
import {
  Text,
  View,
  ToolbarAndroid,
  ListView,
  ListViewDataSource
} from 'react-native';
import { GctgsWebClient } from '../GctgsWebClient';
import { BoardGame } from '../models/BoardGame';
import { User } from '../models/User';

interface BoardGameListProps {
  user: User;
  client: GctgsWebClient;
}

interface BoardGameListState {
  boardGames: ListViewDataSource;
}

export class BoardGameList extends React.Component<BoardGameListProps, BoardGameListState> {
  public constructor() {
    super();
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {boardGames: dataSource.cloneWithRows([])}
  }

  public render() {
    console.log('rendering!');
    return (
      <View style={{flex: 1}}>
        <ToolbarAndroid
          title = "GCTGS"
          titleColor = "#ffffff"
          style = {{height: 56, backgroundColor: "#009900"}}
        />
        <ListView
          dataSource = { this.state.boardGames }
          renderRow = { (rowData: BoardGame) => <Text>{rowData.name}</Text> }
          enableEmptySections = { true }
        />
      </View>
    );
  }

  public componentDidMount() {
    this.props.client.getBoardGames(this.props.user)
      .then((boardGames: BoardGame[]) => {
        console.log(boardGames);
        this.setState({boardGames: this.state.boardGames.cloneWithRows(boardGames)})
      });
  }
}