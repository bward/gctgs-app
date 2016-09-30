import { User } from './models/User'
import { BoardGame } from './models/BoardGame';

export class GctgsWebClient {
  private readonly baseUrl = 'https://gctgs.ben-ward.net/api';
  private headers: Headers;

  public constructor(private user: User) {
    this.headers = new Headers();
    this.headers.append("X-GCTGS-Key", this.user.key);
  }

  public getBoardGames(): Promise<BoardGame[]> {
    return fetch(this.baseUrl + '/boardgames', {headers: this.headers})
      .then((response) => response.json())
      .then((responseJson) => responseJson as BoardGame[])
      .catch((error: any) => console.log(error));
  }

  public requestBoardGame(boardGame: BoardGame): Promise<Response> {
    return fetch(this.baseUrl + '/request/' + boardGame.id.toString(), {headers: this.headers})
      .catch((error: any) => console.log(error));
  }
}