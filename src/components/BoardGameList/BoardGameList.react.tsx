import * as React from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  ToolbarAndroid,
  ListView,
  ListViewDataSource,
  RefreshControl,
  DrawerLayoutAndroid,
  StyleSheet
} from 'react-native';
import { BoardGameListRow } from './BoardGameListRow.react';
import { BoardGameListSectionHeader } from './BoardGameListSectionHeader.react';
import { NavigationView } from '../NavigationView.react';
import { GctgsWebClient } from '../../GctgsWebClient';
import { BoardGame } from '../../models/BoardGame';
import { User } from '../../models/User';

interface BoardGameListProps {
  user: User;
  client: GctgsWebClient;
  logOut: () => void;
  navigator: React.NavigatorStatic;
}

interface BoardGameListState {
  boardGames: ListViewDataSource;
  refreshing: boolean;
}

export class BoardGameList extends React.Component<BoardGameListProps, BoardGameListState> {
  public drawerOpen: boolean = false;
  private drawer: React.DrawerLayoutAndroidStatic;

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
    return (
      <DrawerLayoutAndroid
        drawerWidth={304}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => <NavigationView
          user={this.props.user}
          onLogOut={this.props.logOut} />}
        ref={(drawer: any) => this.drawer = drawer}
        onDrawerOpen={() => this.drawerOpen = true}
        onDrawerClose={() => this.drawerOpen = false} >

        <ToolbarAndroid
          title="GCTGS"
          titleColor="#ffffff"
          navIcon={{ uri: 'ic_menu_black_48dp', isStatic: true }}
          onIconClicked={() => this.drawer.openDrawer()}
          style={styles.toolbar} />

        <View style={{ flex: 1 }}>
          {this.state.boardGames.getRowCount() > 0
            ? <ListView
              dataSource={this.state.boardGames}
              renderRow={(rowData: BoardGame) => <BoardGameListRow boardGame={rowData} onPress={() => this.boardGameDetails(rowData)} />}
              renderSectionHeader={(sectionData) => <BoardGameListSectionHeader title={sectionData.title} />}
              renderHeader={() => <View style={styles.listHeader} />}
              enableEmptySections={true}
              refreshControl={<RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)} />}
              />
            : <ActivityIndicator size='large' style={{ flex: 1 }} />}
        </View>

      </DrawerLayoutAndroid>
    );
  }

  public componentDidMount() {
    this.onRefresh();
  }

  public closeDrawer() {
    this.drawer.closeDrawer();
  }

  private boardGameDetails(boardGame: BoardGame) {
    this.props.navigator.push({ id: 'boardGameDetails', passProps: { boardGame, client: this.props.client } } as React.Route)
  }

  private onRefresh() {
    this.setState({ refreshing: true } as BoardGameListState);
    this.props.client.getBoardGames(this.props.user)
      .then((boardGames: BoardGame[]) => {
        const {dataBlob, sectionIds, rowIds} = this.formatDataAlphabetical(boardGames);
        this.setState({
          boardGames: this.state.boardGames.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
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
    "#009900",
    elevation: 4
  } as React.ViewStyle,

})