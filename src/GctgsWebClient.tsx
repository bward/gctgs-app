import { User } from './models/User'
import { BoardGame } from './models/BoardGame';
import { BoardGameRequest } from './models/BoardGameRequest'

export class GctgsWebClient {
  private readonly baseUrl = 'https://gctgs.ben-ward.net/api';
  private headers: Headers;

  public constructor(private user: User) {
    this.headers = new Headers();
    this.headers.append("X-GCTGS-Key", this.user.key);
    this.headers.append("content-type", "application/json");
  }

  public getBoardGames(): Promise<BoardGame[]> {
    return fetch(this.baseUrl + '/boardgames', {headers: this.headers})
      .then((response) => response.json())
      .then((responseJson) => responseJson as BoardGame[])
      .catch((error: any) => console.log('get boardgames error', error));
  }

  public getRequests(): Promise<BoardGameRequest[]> {
    return fetch(this.baseUrl + '/requests', {headers: this.headers})
      .then((response) => response.json())
      .then((responseJson) => responseJson as BoardGameRequest[])
      .catch((error: any) => console.log('get requests error', error));
  }

  public requestBoardGame(boardGame: BoardGame): Promise<Response> {
    return fetch(this.baseUrl + '/request/' + boardGame.id.toString(), {headers: this.headers, method: 'POST'})
      .catch((error: any) => console.log('request error', error));
  }

  public putFCMToken(token: string): Promise<Response> {
    return fetch(this.baseUrl + '/token', {headers: this.headers, method: 'PUT', body: JSON.stringify(token)})
      .catch((error: any) => console.log('token error', error));
  }
}