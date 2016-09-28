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
import { BoardGameListRow } from './BoardGameListRow.react';
import { BoardGameListSectionHeader } from './BoardGameListSectionHeader.react';
import { GctgsWebClient } from '../../GctgsWebClient';
import { BoardGame } from '../../models/BoardGame';
import { User } from '../../models/User';

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

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      getSectionHeaderData: (dataBlob: any, sectionId: string) => dataBlob[sectionId],
      getRowData: (dataBlob: any, sectionId: string, rowId: string) => dataBlob[`${rowId}`]
    });

    this.state = {
      boardGames: dataSource.cloneWithRowsAndSections([]),
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
          style = {styles.toolbar}
        />
        <ListView
          dataSource = {this.state.boardGames}
          renderRow = {(rowData: BoardGame) => <BoardGameListRow boardGame = { rowData } />}
          renderSectionHeader = {(sectionData) => <BoardGameListSectionHeader title = {sectionData.title} />}
          renderHeader = {() => <View style = {styles.listHeader} />}
          enableEmptySections = { true }
          refreshControl = {<RefreshControl
                              refreshing = {this.state.refreshing}
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
        const {dataBlob, sectionIds, rowIds} = this.formatData(boardGames);
        this.setState({boardGames: this.state.boardGames.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)} as BoardGameListState)
      });
  }

  private formatData(data: BoardGame[]): {dataBlob: {[id: string]: BoardGame | {title: string}}, sectionIds: string[], rowIds: string[][]} {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const dataBlob: {[id: string]: BoardGame | {title: string}} = {'#': {title: '#'}};
    const sectionIds: string[] = ['#'];
    const rowIds: string[][] = [[]];

    for (let i = 0; i < 10; i++) {
      const boardGames = data.filter(boardGame => boardGame.name.toUpperCase()[0] === i.toString());
      for (let j = 0; j < boardGames.length; j++) {
        const rowId = `#:${i}${j}`;
        rowIds[rowIds.length - 1].push(rowId);
        dataBlob[rowId] = boardGames[j];
      }
    }

    for (let i = 0; i < alphabet.length; i++) {
      const character = alphabet[i];
      const boardGames = data.filter(boardGame => boardGame.name.toUpperCase()[0] === character);
      
      if (boardGames.length > 0) {
        sectionIds.push(character);
        dataBlob[character] = {title: character};
        rowIds.push([]);

        for (let j = 0; j < boardGames.length; j++) {
          const rowId = `${character}:${j}`;
          rowIds[rowIds.length - 1].push(rowId);
          dataBlob[rowId] = boardGames[j];
        }
      }
    }

    return {dataBlob, sectionIds, rowIds};
  }
}

const styles = StyleSheet.create({
  toolbar: {
    height: 56,
    backgroundColor:
    "#009900",
    elevation: 4} as React.ViewStyle,
  
  listHeader: {
    paddingTop: 16
  } as React.ViewStyle,
    
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
    marginLeft: 88,
  } as React.ViewStyle
})