import * as React from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  ListView,
  ListViewDataSource,
  RefreshControl,
  DrawerLayoutAndroid,
  StyleSheet
} from 'react-native';
import { BoardGameListRow } from './BoardGameListRow.react';
import { RequestRow } from './RequestRow.react';
import { BoardGameListSectionHeader } from './BoardGameListSectionHeader.react';
import { NavigationView } from '../NavigationView.react';
import { GctgsWebClient } from '../../GctgsWebClient';
import { BoardGame } from '../../models/BoardGame';
import { BoardGameRequest } from '../../models/BoardGameRequest';
import { User } from '../../models/User';

const Icon = require('react-native-vector-icons/MaterialIcons');

enum DisplayMode {
  boardGamesAlphabetical,
  requests
}

interface BoardGameListProps {
  user: User;
  client: GctgsWebClient;
  logOut: () => void;
  navigator: React.NavigatorStatic;
}

interface BoardGameListState {
  boardGames: ListViewDataSource;
  requests: ListViewDataSource;
  refreshing: boolean;
  displayMode: DisplayMode;
}

export class BoardGameList extends React.Component<BoardGameListProps, BoardGameListState> {
  public drawerOpen: boolean = false;
  private drawer: React.DrawerLayoutAndroidStatic;

  public constructor() {
    super();
    const boardGamesDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      getSectionHeaderData: (dataBlob: any, sectionId: string) => dataBlob[sectionId],
      getRowData: (dataBlob: any, sectionId: string, rowId: string) => dataBlob[`${rowId}`]
    });
    const requestDataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      boardGames: boardGamesDataSource.cloneWithRowsAndSections([]),
      requests: requestDataSource.cloneWithRows([]),
      refreshing: false,
      displayMode: DisplayMode.boardGamesAlphabetical
    }
  }

  public render() {
    console.log('rendering lel', this.state.displayMode);
    let list: JSX.Element;
    console.log(this.state.requests)

    if (this.state.boardGames.getRowCount() == 0)
      list = <ActivityIndicator size='large' style={{ flex: 1 }} />
    else if (this.state.displayMode == DisplayMode.requests)
      list = <ListView
              dataSource = {this.state.requests}
              renderRow = {(rowData: BoardGameRequest) => <RequestRow request = {rowData} />}
              renderHeader={() => <View style={styles.listHeader} />}
              refreshControl={<RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)} />}
              />
    else
      list = <ListView
              dataSource={ this.state.boardGames}
              renderRow={(rowData: BoardGame) => <BoardGameListRow boardGame={rowData} onPress={() => this.boardGameDetails(rowData)} />}
              renderSectionHeader={(sectionData) => <BoardGameListSectionHeader title={sectionData.title} />}
              renderHeader={() => <View style={styles.listHeader} />}
              enableEmptySections={true}
              refreshControl={<RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)} />}
              />

    return (
      <DrawerLayoutAndroid
        drawerWidth={304}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        ref={(drawer: any) => this.drawer = drawer}
        renderNavigationView={() => <NavigationView
                                      user = {this.props.user}
                                      onBoardGames = {() => this.setState({displayMode: DisplayMode.boardGamesAlphabetical} as BoardGameListState)}
                                      onRequests = {() => this.setState({displayMode: DisplayMode.requests} as BoardGameListState)}
                                      onLogOut = {this.props.logOut}
                                      drawer = {this.drawer}/>}
        
        onDrawerOpen={() => this.drawerOpen = true}
        onDrawerClose={() => this.drawerOpen = false} >

        <Icon.ToolbarAndroid
          navIconName = "menu"
          title="GCTGS"
          titleColor="#ffffff"
          onIconClicked={() => this.drawer.openDrawer()}
          style={styles.toolbar} />

        <View style={{ flex: 1 }}>
          { list }
        </View>

      </DrawerLayoutAndroid>
    );
  }

  public componentDidMount() {
    this.onRefresh();
  }

  public componentDidUpdate() {
    if (this.drawerOpen) this.closeDrawer();
  }

  public closeDrawer() {
    this.drawer.closeDrawer();
  }

  private boardGameDetails(boardGame: BoardGame) {
    this.props.navigator.push({ id: 'boardGameDetails', passProps: { boardGame, client: this.props.client } } as React.Route)
  }

  private onRefresh() {
    this.setState({ refreshing: true } as BoardGameListState);
    this.props.client.getBoardGames()
      .then((boardGames: BoardGame[]) => {
        const {dataBlob, sectionIds, rowIds} = this.formatDataAlphabetical(boardGames);
        this.setState({
          boardGames: this.state.boardGames.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
        } as BoardGameListState);
      })
      .then(() => this.props.client.getRequests())
      .then((requests: BoardGameRequest[]) => {
        this.setState({
          requests: this.state.requests.cloneWithRows(requests),
          refreshing: false
        } as BoardGameListState);
      });
  }

  private formatDataAlphabetical(data: BoardGame[]): { dataBlob: { [id: string]: BoardGame | { title: string } }, sectionIds: string[], rowIds: string[][] } {
    const dataBlob: { [id: string]: BoardGame | { title: string } } = { '#': { title: '#' } };
    const sectionIds: string[] = ['#'];
    const rowIds: string[][] = [[]];

    for (let i = 0; i < 10; i++) {
      data.filter(boardGame => boardGame.name.toUpperCase()[0] === i.toString())
        .map((value, index) => {
          const rowId = `#:${i}${index}`;
          rowIds[rowIds.length - 1].push(rowId);
          dataBlob[rowId] = value;
        });
    }

    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((character) => {
      const boardGames = data.filter(boardGame => boardGame.name.toUpperCase()[0] === character);

      if (boardGames.length > 0) {
        sectionIds.push(character);
        dataBlob[character] = { title: character };
        rowIds.push([]);
        boardGames.map((boardGame, index) => {
          const rowId = `${character}:${index}`;
          rowIds[rowIds.length - 1].push(rowId);
          dataBlob[rowId] = boardGame;
        });
      }
    });

    return { dataBlob, sectionIds, rowIds };
  }
}

const styles = StyleSheet.create({
  listHeader: {
    paddingTop: 16
  } as React.ViewStyle,

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
    marginLeft: 88,
  } as React.ViewStyle,

  toolbar: {
    height: 56,
    backgroundColor:
    "#4CAF50",
    elevation: 4
  } as React.ViewStyle,

})