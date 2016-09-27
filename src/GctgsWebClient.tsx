import { User } from './models/User'
import { BoardGame } from './models/BoardGame';

export class GctgsWebClient {
  private readonly baseUrl = 'https://gctgs.ben-ward.net/api';

  public getBoardGames(user: User): Promise<BoardGame[]> {
    return fetch(this.baseUrl + '/boardgames')
      .then((response) => response.json())
      .then((responseJson) => responseJson as BoardGame[])
      .catch((error: any) => console.log(error));
  }
}