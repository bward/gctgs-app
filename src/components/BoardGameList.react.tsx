import * as React from 'react';
import {
  Text,
  View,
  ToolbarAndroid,
  ListView,
  ListViewDataSource,
  RefreshControl,
  StyleSheet
} from 'react-native';
import { BoardGameListRow } from './BoardGameListRow.react'
import { GctgsWebClient } from '../GctgsWebClient';
import { BoardGame } from '../models/BoardGame';
import { User } from '../models/User';

interface BoardGameListProps {
  user: User;
  client: GctgsWebClient;
}

interface BoardGameListState {
  boardGames: ListViewDataSource;
  refreshing: boolean;
}

export class BoardGameList extends React.Component<BoardGameListProps, BoardGameListState> {
  public constructor() {
    super();
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      boardGames: dataSource.cloneWithRows([]),
      refreshing: false
    }
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
          dataSource = {this.state.boardGames}
          renderRow = {(rowData: BoardGame) => <BoardGameListRow boardGame = { rowData } />}
          enableEmptySections = { true }
          renderSeparator = {(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          refreshControl = {<RefreshControl refreshing = {this.state.refreshing}
                                            onRefresh = {this.onRefresh.bind(this)} />}
        />
      </View>
    );
  }

  public componentDidMount() {
    this.onRefresh();
  }

  private onRefresh() {
    this.props.client.getBoardGames(this.props.user)
      .then((boardGames: BoardGame[]) => {
        console.log(boardGames);
        this.setState({boardGames: this.state.boardGames.cloneWithRows(boardGames)} as BoardGameListState)
      });
  }
}

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  } as React.ViewStyle
})